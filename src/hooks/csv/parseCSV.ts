import { useState, useCallback } from "react";
import ParseCSV from "papaparse";
import type { ParseResult } from "papaparse";

import { ParseStatus } from "../../constants";
import type { ParseState } from "../../types";

type DataParseResult<T> = ParseResult & { data: T[] };

export const useParseCSV = <T>(url: string) => {
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
      complete: (parseResult: DataParseResult<T>) => {
        const { data, errors } = parseResult;
        if (data.length === 0 && errors.length !== 0) {
          const error = errors[0].message || "Error parsing data";
          setParseState({
            status: ParseStatus.ERROR,
            error,
          });
        } else {
          setParseState({
            status: ParseStatus.SUCCESS,
            data,
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
  }, [url]);

  return { parseState, fetchAndParseData };
};
