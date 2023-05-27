import { DependencyList, useRef, useEffect, useMemo } from "react";

export interface ThrottledFunction<Fn extends (...args: any[]) => any> {
  (this: ThisParameterType<Fn>, ...args: Parameters<Fn>): void;
}
export const useThrottledCallback = <Fn extends (...args: any[]) => void>(
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
      cb(args);

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