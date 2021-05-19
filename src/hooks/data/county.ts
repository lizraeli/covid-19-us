import { useMemo } from "react";
import groupBy from "lodash/groupBy";

import { ParseStatus, START_DATE } from "../../constants";
import { createOptionsFromDataDict } from "./utils";
import { defaultChartData, makeChartData } from "../../utils/chart";
import CalcDataWorker from "./worker";

import type {
  CountyDataByStateDict,
  ParseState,
  Option,
  CountyData,
} from "../../types";
import { useAsyncMemo } from "../useAsyncMemo";

const worker = new CalcDataWorker();

export const createCountyOptions = (
  countyDataByStateDict: CountyDataByStateDict,
  selectedState: Option | null
) => {
  const countiesDataDict = selectedState
    ? countyDataByStateDict[selectedState.value]
    : {};

  return createOptionsFromDataDict(countiesDataDict);
};

/**
 * Returns an object where each key is a state
 * and each value is an object,
 * where each key is a county in the state,
 * and each value is an array of data for that county
 *
 * {
 *   "Louisiana": {
 *      "New Orleans": [CountyData, CountyData, ...]
 *      ...
 *   },
 *   "New York": {
 *      "Weschester": [CountyData, CountyData, ...],
 *      "New York City": [CountyData, CountyData, ...]
 *      ...
 *   },
 *   ...
 * }
 * @param countyDataRows
 */
export const makeCountyDataByStateDict = (
  countyDataRows: CountyData[]
): CountyDataByStateDict => {
  const dataGroupedByState = groupBy(
    countyDataRows,
    (countyData) => countyData.state
  );

  const stateDictWithCountyData = Object.entries(dataGroupedByState).reduce(
    (dict, [state, countyDataRows]) => {
      return {
        ...dict,
        [state]: groupBy(countyDataRows, (countyData) => countyData.county),
      };
    },
    {} as CountyDataByStateDict
  );

  return stateDictWithCountyData;
};

export const useProcessedCountyData = (
  countyParseState: ParseState<CountyData>,
  selectedState: Option | null,
  selectedCounty: Option | null
) => {
  const dataRows = useMemo(
    () =>
      countyParseState.status === ParseStatus.SUCCESS
        ? countyParseState.data
        : [],
    [countyParseState]
  );

  const [stateDictWithCountyData, isProcessingCounties] = useAsyncMemo(
    async () => {
      const filteredDataRows = await worker.getDataAfterStartDate(
        dataRows,
        START_DATE
      );
      const stateDictWithCountyData = filteredDataRows
        ? makeCountyDataByStateDict(filteredDataRows)
        : {};

      return stateDictWithCountyData;
    },
    [dataRows],
    makeCountyDataByStateDict([])
  );

  const countyOptions = useMemo(
    () => createCountyOptions(stateDictWithCountyData, selectedState),
    [stateDictWithCountyData, selectedState]
  );

  const [
    {
      totalCasesForCountyChartData,
      newCasesForCountyChartData,
      totalDeathsForCountyChartData,
      newDeathsForCountyChartData,
    },
    isProcessingData,
  ] = useAsyncMemo(
    async () => {
      const countyDataInStateDict = selectedState
        ? stateDictWithCountyData[selectedState.value]
        : {};
      const selectedCountyDataRows = selectedCounty
        ? countyDataInStateDict[selectedCounty.value] ?? []
        : [];

      const {
        dateRows,
        totalCasesRows,
        newCasesRows,
        totalDeathsRows,
        newDeathsRows,
      } = await worker.processCaseDataRows(selectedCountyDataRows);

      const totalCasesForCountyChartData = makeChartData(
        selectedCounty?.value,
        dateRows,
        totalCasesRows
      );
      const newCasesForCountyChartData = makeChartData(
        selectedCounty?.value,
        dateRows.slice(1),
        newCasesRows.slice(1)
      );
      const totalDeathsForCountyChartData = makeChartData(
        selectedCounty?.value,
        dateRows,
        totalDeathsRows
      );
      const newDeathsForCountyChartData = makeChartData(
        selectedCounty?.value,
        dateRows.slice(1),
        newDeathsRows.slice(1)
      );

      return {
        totalCasesForCountyChartData,
        newCasesForCountyChartData,
        totalDeathsForCountyChartData,
        newDeathsForCountyChartData,
      };
    },
    [stateDictWithCountyData, selectedState, selectedCounty],
    {
      totalCasesForCountyChartData: defaultChartData,
      newCasesForCountyChartData: defaultChartData,
      totalDeathsForCountyChartData: defaultChartData,
      newDeathsForCountyChartData: defaultChartData,
    }
  );

  return {
    isProcessingCounties,
    isProcessingData,
    countyOptions,
    totalCasesForCountyChartData,
    newCasesForCountyChartData,
    totalDeathsForCountyChartData,
    newDeathsForCountyChartData,
  };
};

export type ProccessedCountyData = ReturnType<typeof useProcessedCountyData>;
