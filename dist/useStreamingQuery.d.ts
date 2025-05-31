import { PrimitiveParam } from './constants';
export declare const useStreamingQuery: (path: string, delay?: number) => [{
    value: string | null;
    isStreaming: boolean;
}, (options?: {
    params?: Record<string, PrimitiveParam>;
    onDone?: (value?: string) => void;
}) => Promise<void>];
