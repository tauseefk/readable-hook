import { DependencyList } from 'react';
export interface ThrottledFunction<Fn extends (...args: unknown[]) => unknown> {
    (...args: Parameters<Fn>): void;
}
export declare const useThrottledCallback: <Fn extends (...args: unknown[]) => void>(cb: Fn, deps: DependencyList, ms?: number) => ThrottledFunction<Fn>;
