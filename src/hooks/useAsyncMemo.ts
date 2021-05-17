import { useEffect, useState } from "react";

export function useAsyncMemo<T>(
  factory: () => Promise<T> | undefined | null,
  deps: readonly any[],
  initial: T
): [T, boolean] {
  const [data, setData] = useState<T>(initial);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancel = false;
    const promise = factory();

    if (promise === undefined || promise === null) {
      return;
    }

    setIsLoading(true);

    promise.then((data) => {
      setIsLoading(false);
      if (!cancel) {
        setData(data);
      }
    });

    return () => {
      cancel = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return [data, isLoading];
}
