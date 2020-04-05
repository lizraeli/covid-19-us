import { useState, useCallback, useMemo } from "react";
import ParseCSV from "papaparse";
import type { ParseResult } from "papaparse";

import { ParseStatus } from "./constants";
import {
  getCountyDataByState,
  getSelectedCountyData,
  groupStateDataByState,
  createCountyOptions,
  makeChartData,
  createStateOptions,
} from "./utils";
import type { ParseState, Option, CountyData, StateData } from "./types";

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

  const stateDictWithCountyData = useMemo(
    () => (dataRows ? getCountyDataByState(dataRows) : {}),
    [dataRows]
  );

  const countyOptions = useMemo(
    () => createCountyOptions(stateDictWithCountyData, selectedState),
    [stateDictWithCountyData, selectedState]
  );

  const selectedCountyDataRows = useMemo(
    () =>
      getSelectedCountyData(
        stateDictWithCountyData,
        selectedState,
        selectedCounty
      ),
    [stateDictWithCountyData, selectedState, selectedCounty]
  );

  const dateRows = useMemo(
    () => selectedCountyDataRows.map((countyData) => countyData.date),
    [selectedCountyDataRows]
  );

  const casesRows = useMemo(
    () => selectedCountyDataRows.map((countyData) => countyData.cases),
    [selectedCountyDataRows]
  );

  const newCasesRows = useMemo(() => {
    return selectedCountyDataRows.map((countyData, index) => {
      const isFirstElement = index === 0;
      const prevCases = isFirstElement
        ? 0
        : selectedCountyDataRows[index - 1].cases;
      const newCases = countyData.cases - prevCases;

      return newCases;
    }, []);
  }, [selectedCountyDataRows]);

  const totalCasesChartData = useMemo(
    () => makeChartData(selectedCounty?.value, dateRows, casesRows),
    [dateRows, casesRows, selectedCounty]
  );

  const newCasesChartData = useMemo(
    () => makeChartData(selectedCounty?.value, dateRows, newCasesRows),
    [dateRows, newCasesRows, selectedCounty]
  );

  return {
    selectedCountyDataRows,
    countyOptions,
    totalCasesChartData,
    newCasesChartData,
  };
};

export const useProcessedStateData = (
  stateDataParseState: ParseState<StateData>,
  selectedState: Option | null
) => {
  const dataRows =
    stateDataParseState.status === ParseStatus.SUCCESS
      ? stateDataParseState.data
      : null;

  const stateDataDict = dataRows ? groupStateDataByState(dataRows) : {};

  const stateOptions = useMemo(() => createStateOptions(stateDataDict), [
    stateDataDict,
  ]);

  const selectedStateDataRows = selectedState
    ? stateDataDict[selectedState.value]
    : [];

  const dateRows = useMemo(
    () => selectedStateDataRows.map((stateData) => stateData.date),
    [selectedStateDataRows]
  );

  const casesRows = useMemo(
    () => selectedStateDataRows.map((stateData) => stateData.cases),
    [selectedStateDataRows]
  );

  const newCasesRows = useMemo(() => {
    return selectedStateDataRows.map((stateData, index) => {
      const isFirstElement = index === 0;
      const prevCases = isFirstElement
        ? 0
        : selectedStateDataRows[index - 1].cases;
      const newCases = stateData.cases - prevCases;

      return newCases;
    }, []);
  }, [selectedStateDataRows]);

  const totalCasesChartData = useMemo(
    () => makeChartData(selectedState?.value, dateRows, casesRows),
    [dateRows, casesRows, selectedState]
  );

  const newCasesChartData = useMemo(
    () => makeChartData(selectedState?.value, dateRows, newCasesRows),
    [dateRows, newCasesRows, selectedState]
  );

  return {
    stateDataDict,
    stateOptions,
    totalCasesChartData,
    newCasesChartData,
  };
};
