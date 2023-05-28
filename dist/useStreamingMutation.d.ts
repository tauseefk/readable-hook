import { PrimitiveParam } from './constants';
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
export declare const useStreamingMutation: (path: string, staticParams?: Record<string, PrimitiveParam>, delay?: number) => [{
    value: string;
    done: boolean;
    isStreaming: boolean;
}, (params?: Record<string, PrimitiveParam>, onDone?: ((value?: string) => void) | undefined) => Promise<void>];
export declare const useStreamingMutationV2: (path: string, staticParams?: Record<string, PrimitiveParam>, delay?: number) => [{
    value: string;
    done: boolean;
    isStreaming: boolean;
}, (options?: {
    params?: Record<string, PrimitiveParam> | undefined;
    onDone?: ((value?: string) => void) | undefined;
} | undefined) => Promise<void>];
