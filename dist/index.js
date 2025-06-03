var react = require('react');

class AbortError extends Error {
}

const DEFAULT_STREAM_DATA = {
    value: null,
    isStreaming: false,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
// This utility heavily borrows from react-hookz/useThrottledCallback,
// The goal was to ensure no dependencies.
// https://github.com/react-hookz/web/blob/master/src/useValidator/index.ts
// MIT License
// Copyright (c) 2021 react-hookz
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
const useThrottledCallback = (cb, deps, ms = 500) => {
    const timeout = react.useRef(null);
    const cachedArgs = react.useRef(null);
    react.useEffect(() => {
        const currentTimeout = timeout.current;
        return () => {
            if (currentTimeout) {
                clearTimeout(currentTimeout);
                timeout.current = null;
            }
        };
    }, []);
    return react.useMemo(() => {
        const execCbAndSchedule = (args) => {
            cachedArgs.current = null;
            cb(...args);
            timeout.current = setTimeout(() => {
                timeout.current = null;
                if (cachedArgs.current) {
                    execCbAndSchedule(cachedArgs.current);
                    cachedArgs.current = null;
                }
            }, ms);
        };
        const throttledCb = (...args) => {
            // execute immediately
            if (!timeout.current) {
                execCbAndSchedule(args);
                return;
            }
            // cache arguments to be picked up by the next scheduled execution
            cachedArgs.current = args;
        };
        return throttledCb;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cb, ms, ...deps]);
};

/**
 * Synchronize React state with an Async Iterable.
 * @param {AsyncIterable<T>} asyncGenerator that returns the async iterable to synchronize with state
 * @param {number} delay  time interval between each stream read call
 * @returns a tuple of data retrieved from the stream
and a mutation trigger function
 */
// biome-ignore lint/complexity/noUselessTypeConstraint: typescript compiler won't have me
const useIterable = (asyncGenerator, { delay, accumulate, accumulator, } = {
    delay: 500,
    accumulate: false,
}) => {
    const frequentlyUpdatedData = react.useRef(DEFAULT_STREAM_DATA);
    const abortControllerRef = react.useRef(null);
    const [{ value, isStreaming }, setData] = react.useState(frequentlyUpdatedData.current);
    const throttledUpdateState = useThrottledCallback(() => {
        setData({
            ...frequentlyUpdatedData.current,
        });
    }, [], delay);
    const abort = react.useCallback(() => {
        abortControllerRef.current?.abort();
    }, []);
    react.useEffect(() => {
        return abort;
    }, [abort]);
    const synchronize = react.useCallback(async (options) => {
        // flush state
        frequentlyUpdatedData.current = DEFAULT_STREAM_DATA;
        try {
            const response = await asyncGenerator(options?.params, options?.signal);
            for await (const value of response) {
                if (options?.signal?.aborted) {
                    throw new AbortError('Abort signal received.');
                }
                frequentlyUpdatedData.current = {
                    isStreaming: true,
                    value: accumulate && accumulator
                        ? accumulator(frequentlyUpdatedData.current.value, value)
                        : value,
                };
                throttledUpdateState();
            }
            frequentlyUpdatedData.current = {
                ...frequentlyUpdatedData.current,
                isStreaming: false,
            };
            throttledUpdateState();
            options?.onDone?.();
        }
        catch (error) {
            if ((error instanceof DOMException && error.name === 'AbortError') ||
                error instanceof AbortError) {
                frequentlyUpdatedData.current = {
                    ...frequentlyUpdatedData.current,
                    isStreaming: false,
                };
                throttledUpdateState();
                return;
            }
            throw error;
        }
    }, [accumulate, accumulator, asyncGenerator, throttledUpdateState]);
    return [{ value, isStreaming }, synchronize, abort];
};

/**
 * Synchronize React state with a ReadableStream.
 * @param {ReadableStream<T>} streamProducer
 *  readable stream to synchronize with state
 * @param {number} delay
 *  time interval between each stream read call
 * @returns a tuple of data retrieved from the stream
 *  and a mutation trigger function
 */
// biome-ignore lint/complexity/noUselessTypeConstraint: typescript compiler won't have me
const useReadable = (streamProducer, { delay, accumulate, accumulator, } = {
    delay: 500,
    accumulate: false,
}) => {
    const frequentlyUpdatedData = react.useRef(DEFAULT_STREAM_DATA);
    const abortControllerRef = react.useRef(null);
    const [{ value, isStreaming }, setData] = react.useState(frequentlyUpdatedData.current);
    const throttledUpdateState = useThrottledCallback(() => {
        setData({
            ...frequentlyUpdatedData.current,
        });
    }, [], delay);
    const abort = react.useCallback(() => {
        abortControllerRef.current?.abort();
    }, []);
    react.useEffect(() => {
        return abort;
    }, [abort]);
    const synchronize = react.useCallback(async (options) => {
        // flush state
        frequentlyUpdatedData.current = DEFAULT_STREAM_DATA;
        const response = await streamProducer(options?.params, options?.signal);
        if (!response)
            throw new Error('No response from stream.');
        const reader = response.getReader();
        try {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const { value, done } = await reader.read();
                if (done)
                    break;
                frequentlyUpdatedData.current = {
                    isStreaming: true,
                    value: accumulate && accumulator
                        ? accumulator(frequentlyUpdatedData.current.value, value)
                        : value,
                };
                throttledUpdateState();
            }
            frequentlyUpdatedData.current = {
                ...frequentlyUpdatedData.current,
                isStreaming: false,
            };
            throttledUpdateState();
            options?.onDone?.();
        }
        catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                // Stream was aborted, reset state
                frequentlyUpdatedData.current = {
                    ...frequentlyUpdatedData.current,
                    isStreaming: false,
                };
                throttledUpdateState();
                return;
            }
            throw error;
        }
        finally {
            reader.releaseLock();
        }
    }, [accumulate, accumulator, streamProducer, throttledUpdateState]);
    return [{ value, isStreaming }, synchronize, abort];
};

const readableTextStream = async (path, options) => {
    const response = await fetch(path, options);
    if (!response.body)
        throw new Error('No response body found.');
    return response.body.pipeThrough(new TextDecoderStream());
};

const useStreamingQuery = (path, delay = 500) => useReadable((_, signal) => readableTextStream(path, {
    method: 'GET',
    signal,
}), { delay });

const useStreamingMutation = (path, staticParams, options) => useReadable((params, signal) => readableTextStream(path, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        ...staticParams,
        ...params,
    }),
    signal,
}), options);

exports.useIterable = useIterable;
exports.useReadable = useReadable;
exports.useStreamingMutation = useStreamingMutation;
exports.useStreamingQuery = useStreamingQuery;
//# sourceMappingURL=index.js.map
