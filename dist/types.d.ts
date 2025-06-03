import { PrimitiveParam } from './constants';
export type RuntimeOptions = {
    params?: Record<string, PrimitiveParam>;
    onDone?: () => void;
    signal?: AbortSignal;
};
export type SynchronizeFn = (options?: RuntimeOptions) => void;
export type AbortFn = () => void;
