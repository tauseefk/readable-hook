var react = require('react');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

var useThrottledCallback = function (cb, deps, ms) {
    if (ms === void 0) { ms = 500; }
    var timeout = react.useRef();
    var cachedArgs = react.useRef();
    react.useEffect(function () {
        var currentTimeout = timeout.current;
        return function () {
            if (currentTimeout) {
                clearTimeout(currentTimeout);
                timeout.current = undefined;
            }
        };
    }, []);
    return react.useMemo(function () {
        var execCbAndSchedule = function (args) {
            cachedArgs.current = undefined;
            cb(args);
            timeout.current = setTimeout(function () {
                timeout.current = undefined;
                if (cachedArgs.current) {
                    execCbAndSchedule(cachedArgs.current);
                    cachedArgs.current = undefined;
                }
            }, ms);
        };
        var throttledCb = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
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
    }, __spreadArray([cb, ms], deps, true));
};

var DEFAULT_STREAM_DATA = {
    value: '',
    done: false,
    isStreaming: false,
};

/**
 * Synchronize React state with a ReadableStream.
 * @param {ReadableStream<String>} streamProducer
 *  readable stream to synchronize with state
 * @param {number} delay
 *  time interval between each stream read call
 * @returns a tuple of data retrieved from the stream,
 *  and a mutation trigger function
 */
var useReadable = function (streamProducer, delay) {
    if (delay === void 0) { delay = 500; }
    var frequentlyUpdatedData = react.useRef(DEFAULT_STREAM_DATA);
    var _a = react.useState(frequentlyUpdatedData.current), _b = _a[0], value = _b.value, done = _b.done, isStreaming = _b.isStreaming, setThrottledData = _a[1];
    var throttledUpdateState = useThrottledCallback(function () {
        setThrottledData(__assign({}, frequentlyUpdatedData.current));
    }, [], delay);
    var synchronize = react.useCallback(function (options) { return __awaiter(void 0, void 0, void 0, function () {
        function syncWithStream() {
            return __awaiter(this, void 0, void 0, function () {
                var _a, value, done;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, reader.read()];
                        case 1:
                            _a = _b.sent(), value = _a.value, done = _a.done;
                            if (!done) {
                                frequentlyUpdatedData.current = { value: value, done: done, isStreaming: true };
                                throttledUpdateState();
                                requestAnimationFrame(function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, syncWithStream()];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                                return [2 /*return*/];
                            }
                            frequentlyUpdatedData.current = __assign(__assign({}, frequentlyUpdatedData.current), { done: true, isStreaming: false });
                            throttledUpdateState();
                            if (options === null || options === void 0 ? void 0 : options.onDone)
                                options.onDone(frequentlyUpdatedData.current.value);
                            return [2 /*return*/];
                    }
                });
            });
        }
        var response, reader;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    frequentlyUpdatedData.current = DEFAULT_STREAM_DATA;
                    return [4 /*yield*/, streamProducer(options === null || options === void 0 ? void 0 : options.params)];
                case 1:
                    response = _a.sent();
                    if (!response)
                        throw new Error('No response from stream.');
                    reader = response.getReader();
                    return [4 /*yield*/, syncWithStream()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [streamProducer, throttledUpdateState]);
    return [{ value: value, done: done, isStreaming: isStreaming }, synchronize];
};

var readableTextStream = function (path, options) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch(path, options)];
            case 1:
                response = _a.sent();
                if (!response.body)
                    throw new Error('No response body found.');
                return [2 /*return*/, response.body.pipeThrough(new TextDecoderStream())];
        }
    });
}); };

/**
 * Query a streaming endpoint
 * @param path streaming endpoint
 * @param delay time interval between each stream read call
 * @returns {[UseStreamingQueryData, () => void]}
 * returns a tuple of data retrieved from the stream, and a query function
 */
var useStreamingQuery = function (path, delay) {
    if (delay === void 0) { delay = 500; }
    var frequentlyUpdatedData = react.useRef(DEFAULT_STREAM_DATA);
    var _a = react.useState(frequentlyUpdatedData.current), _b = _a[0], value = _b.value, done = _b.done, isStreaming = _b.isStreaming, setThrottledData = _a[1];
    var throttledUpdateState = useThrottledCallback(function () {
        setThrottledData(__assign({}, frequentlyUpdatedData.current));
    }, [], delay);
    var streamQuery = react.useCallback(function (onDone) { return __awaiter(void 0, void 0, void 0, function () {
        function syncWithTextStream() {
            return __awaiter(this, void 0, void 0, function () {
                var _a, value, done;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, reader.read()];
                        case 1:
                            _a = _b.sent(), value = _a.value, done = _a.done;
                            if (!done) {
                                frequentlyUpdatedData.current = { value: value, done: done, isStreaming: true };
                                throttledUpdateState();
                                requestAnimationFrame(function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, syncWithTextStream()];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                                return [2 /*return*/];
                            }
                            frequentlyUpdatedData.current = __assign(__assign({}, frequentlyUpdatedData.current), { done: true, isStreaming: false });
                            throttledUpdateState();
                            if (onDone)
                                onDone(frequentlyUpdatedData.current.value);
                            return [2 /*return*/];
                    }
                });
            });
        }
        var response, reader;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    frequentlyUpdatedData.current = DEFAULT_STREAM_DATA;
                    return [4 /*yield*/, readableTextStream(path, {
                            method: 'GET',
                        })];
                case 1:
                    response = _a.sent();
                    if (!response)
                        throw new Error('No response from stream.');
                    reader = response.getReader();
                    return [4 /*yield*/, syncWithTextStream()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [path, throttledUpdateState]);
    return [{ value: value, done: done, isStreaming: isStreaming }, streamQuery];
};
var useStreamingQueryV2 = function (path, delay) {
    if (delay === void 0) { delay = 500; }
    return useReadable(function () {
        return readableTextStream(path, {
            method: 'GET',
        });
    }, delay);
};

/**
 * Trigger a mutation at a streaming endpoint
 * @param path streaming endpoint
 * @param staticParams params passed during hook initialization
 * @param delay time interval between each stream read call
 * @returns { [
 *  UseStreamingMutationData,
 *  (params?: Record<string, PrimitiveParam>) => void
 * ] }
 */
var useStreamingMutation = function (path, staticParams, delay) {
    if (delay === void 0) { delay = 500; }
    var frequentlyUpdatedData = react.useRef(DEFAULT_STREAM_DATA);
    var _a = react.useState(frequentlyUpdatedData.current), _b = _a[0], value = _b.value, done = _b.done, isStreaming = _b.isStreaming, setThrottledData = _a[1];
    var throttledUpdateState = useThrottledCallback(function () {
        setThrottledData(__assign({}, frequentlyUpdatedData.current));
    }, [], delay);
    var streamMutation = react.useCallback(function (params, onDone) { return __awaiter(void 0, void 0, void 0, function () {
        function syncWithTextStream() {
            return __awaiter(this, void 0, void 0, function () {
                var _a, value, done;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, reader.read()];
                        case 1:
                            _a = _b.sent(), value = _a.value, done = _a.done;
                            if (!done) {
                                frequentlyUpdatedData.current = { value: value, done: done, isStreaming: true };
                                throttledUpdateState();
                                requestAnimationFrame(function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, syncWithTextStream()];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                                return [2 /*return*/];
                            }
                            frequentlyUpdatedData.current = __assign(__assign({}, frequentlyUpdatedData.current), { done: true, isStreaming: false });
                            throttledUpdateState();
                            if (onDone)
                                onDone(frequentlyUpdatedData.current.value);
                            return [2 /*return*/];
                    }
                });
            });
        }
        var response, reader;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    frequentlyUpdatedData.current = DEFAULT_STREAM_DATA;
                    return [4 /*yield*/, readableTextStream(path, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(__assign(__assign({}, staticParams), params)),
                        })];
                case 1:
                    response = _a.sent();
                    if (!response)
                        throw new Error('No response from stream.');
                    reader = response.getReader();
                    return [4 /*yield*/, syncWithTextStream()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [path, staticParams, throttledUpdateState]);
    return [{ value: value, done: done, isStreaming: isStreaming }, streamMutation];
};
var useStreamingMutationV2 = function (path, staticParams, delay) {
    if (delay === void 0) { delay = 500; }
    return useReadable(function (params) {
        return readableTextStream(path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(__assign(__assign({}, staticParams), params)),
        });
    }, delay);
};

exports.useReadable = useReadable;
exports.useStreamingMutation = useStreamingMutation;
exports.useStreamingMutationV2 = useStreamingMutationV2;
exports.useStreamingQuery = useStreamingQuery;
exports.useStreamingQueryV2 = useStreamingQueryV2;
//# sourceMappingURL=index.js.map
