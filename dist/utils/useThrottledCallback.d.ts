import { DependencyList } from "react";
export interface ThrottledFunction<Fn extends (...args: any[]) => any> {
    (this: ThisParameterType<Fn>, ...args: Parameters<Fn>): void;
}
export declare const useThrottledCallback: <Fn extends (...args: any[]) => void>(cb: Fn, deps: DependencyList, ms?: number) => ThrottledFunction<Fn>;
