import { useState, useCallback } from "react";
import ParseCSV from "papaparse";

import { ParseStatus } from "../../constants";
import type { ParseState } from "../../types";

type TypeGuard<T> = (value: any) => value is T;

export const useParseCSV = <T>(url: string, typeGuard: TypeGuard<T>) => {
  const [parseState, setParseState] = useState<ParseState<T>>({
    status: ParseStatus.UNDEFINED,
  });

  const fetchAndParseData = useCallback(() => {
    setParseState({
      status: ParseStatus.PARSING,
    });

    ParseCSV.parse(url, {
      download: true,
      worker: true,
      header: true,
      dynamicTyping: true,
      complete: (parseResult) => {
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
      },
      error: (err) => {
        setParseState({
          status: ParseStatus.ERROR,
          error: err.message,
        });
      },
    });
  }, [url, typeGuard]);

  return { parseState, fetchAndParseData };
};
