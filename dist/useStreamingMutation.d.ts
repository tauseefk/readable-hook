import { PrimitiveParam } from './constants';
export declare const useStreamingMutation: (path: string, staticParams?: Record<string, PrimitiveParam>, delay?: number) => [{
    value: string;
    done: boolean;
    isStreaming: boolean;
}, (options?: {
    params?: Record<string, PrimitiveParam> | undefined;
    onDone?: ((value?: string) => void) | undefined;
} | undefined) => Promise<void>];
