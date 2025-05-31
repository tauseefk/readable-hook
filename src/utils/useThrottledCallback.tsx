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

import { DependencyList, useRef, useEffect, useMemo } from 'react';

export type ThrottledFunction<Fn extends (...args: unknown[]) => unknown> = (
  ...args: Parameters<Fn>
) => void;

export const useThrottledCallback = <Fn extends (...args: unknown[]) => void>(
  cb: Fn,
  deps: DependencyList,
  ms = 500,
): ThrottledFunction<Fn> => {
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const cachedArgs = useRef<Parameters<Fn>>();

  useEffect(() => {
    const currentTimeout = timeout.current;
    return () => {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
        timeout.current = undefined;
      }
    };
  }, []);

  return useMemo(() => {
    const execCbAndSchedule = (args: Parameters<Fn>) => {
      cachedArgs.current = undefined;
      cb(...args);

      timeout.current = setTimeout(() => {
        timeout.current = undefined;

        if (cachedArgs.current) {
          execCbAndSchedule(cachedArgs.current);

          cachedArgs.current = undefined;
        }
      }, ms);
    };

    const throttledCb = (...args: Parameters<Fn>) => {
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
