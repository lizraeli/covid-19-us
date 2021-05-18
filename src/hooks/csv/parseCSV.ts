import { useState, useCallback } from "react";

import { ParseStatus } from "../../constants";
import type { ParseState } from "../../types";
import CSVWorker from "./worker";

const worker = new CSVWorker();
type TypeGuard<T> = (value: any) => value is T;

export const useParseCSV = <T>(url: string, typeGuard: TypeGuard<T>) => {
  const [parseState, setParseState] = useState<ParseState<T>>({
    status: ParseStatus.UNDEFINED,
  });

  const fetchAndParseData = useCallback(async () => {
    setParseState({
      status: ParseStatus.PARSING,
    });

    try {
      const parseResult = await worker.parse(url);
      const { data, errors } = parseResult;
      if (data.length === 0 && errors.length !== 0) {
        const error = errors[0].message || "Error parsing data";
        setParseState({
          status: ParseStatus.ERROR,
          error,
        });
      } else {
        const filteredData = data.filter(typeGuard);
        setParseState({
          status: ParseStatus.SUCCESS,
          data: filteredData,
        });
      }
    } catch (err) {
      setParseState({
        status: ParseStatus.ERROR,
        error: err?.message || "Error parsing CSV",
      });
    }
  }, [url, typeGuard]);

  return { parseState, fetchAndParseData };
};
