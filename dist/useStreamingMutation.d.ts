import { PrimitiveParam } from './constants';
export declare const useStreamingMutation: (path: string, staticParams?: Record<string, PrimitiveParam>, options?: {
    accumulate?: boolean;
    delay?: number;
}) => [{
    value: string | null;
    isStreaming: boolean;
}, (options?: {
    params?: Record<string, PrimitiveParam>;
    onDone?: (value?: string) => void;
}) => Promise<void>];
