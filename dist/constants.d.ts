export type PrimitiveParam = string | boolean | number;
export interface HookData<T> {
    value: T | null;
    isStreaming: boolean;
}
export declare const DEFAULT_STREAM_DATA: {
    value: null;
    isStreaming: false;
};
