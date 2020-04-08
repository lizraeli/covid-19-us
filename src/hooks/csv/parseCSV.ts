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
      status: ParseStatus.ACTIVE,
    });

    ParseCSV.parse(url, {
      download: true,
      worker: true,
      header: true,
      dynamicTyping: true,
      complete: (parseResult: DataParseResult<T> | null) => {
        if (parseResult) {
          setParseState({
            status: ParseStatus.SUCCESS,
            data: parseResult.data,
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