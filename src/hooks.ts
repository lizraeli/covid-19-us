import { useState, useCallback, useMemo } from "react";
import ParseCSV from "papaparse";
import type { ParseResult } from "papaparse";

import { ParseStatus } from "./constants";
import {
  processCountyDataByState,
  getSelectedCountyData,
  createCountyOptions,
  makeChartData,
} from "./utils";
import type { ParseState, Option, CountyData } from "./types";

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

export const useProcessedCountyData = (
  countyParseState: ParseState<CountyData>,
  selectedState: Option | null,
  selectedCounty: Option | null
) => {
  const dataRows =
    countyParseState.status === ParseStatus.SUCCESS
      ? countyParseState.data
      : null;

  const { stateDataDict, stateOptions } = useMemo(
    () => processCountyDataByState(dataRows),
    [dataRows]
  );

  const countyOptions = useMemo(
    () => createCountyOptions(stateDataDict, selectedState),
    [stateDataDict, selectedState]
  );

  const selectedCountyDataRows = useMemo(
    () => getSelectedCountyData(stateDataDict, selectedState, selectedCounty),
    [stateDataDict, selectedState, selectedCounty]
  );

  const dateRows = useMemo(
    () => selectedCountyDataRows.map((countyData) => countyData.date),
    [selectedCountyDataRows]
  );

  const casesRows = useMemo(
    () => selectedCountyDataRows.map((countyData) => countyData.cases),
    [selectedCountyDataRows]
  );

  const totalCasesChartData = useMemo(
    () => makeChartData(selectedCounty?.value, dateRows, casesRows),
    [dateRows, casesRows, selectedCounty]
  );

  const newCasesRows = useMemo(() => {
    return selectedCountyDataRows.map((countyData, index) => {
      return index === 0
        ? 0
        : countyData.cases - selectedCountyDataRows[index - 1].cases;
    }, []);
  }, [selectedCountyDataRows]);

  const newCasesChartData = useMemo(
    () => makeChartData(selectedCounty?.value, dateRows, newCasesRows),
    [dateRows, newCasesRows, selectedCounty]
  );

  return {
    selectedCountyDataRows,
    stateOptions,
    countyOptions,
    totalCasesChartData,
    newCasesChartData,
  };
};
