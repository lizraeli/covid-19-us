import { useEffect, useState } from "react";

export function useAsyncMemo<T>(
  factory: () => Promise<T> | undefined | null,
  deps: readonly any[],
  initial: T
): [T, boolean] {
  const [data, setData] = useState<T>(initial);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let canceled = false;
    const promise = factory();

    if (promise === undefined || promise === null) {
      return;
    }

    setIsLoading(true);

    promise.then((data) => {
      if (!canceled) {
        setIsLoading(false);
        setData(data);
      }
    });

    return () => {
      canceled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return [data, isLoading];
}
