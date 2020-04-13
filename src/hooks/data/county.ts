import { useMemo } from "react";
import groupBy from "lodash/groupBy";

import { ParseStatus, START_DATE } from "../../constants";
import {
  createOptionsFromDataDict,
  processCaseDataRows,
  getDataAfterStartDate,
} from "./utils";
import { makeChartData } from "../../utils/chart";

import type {
  CountyDataByStateDict,
  ParseState,
  Option,
  CountyData,
} from "../../types";

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
export const getCountyDataByState = (
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
  const dataRows =
    countyParseState.status === ParseStatus.SUCCESS
      ? countyParseState.data
      : null;

  const stateDictWithCountyData = useMemo(() => {
    const filteredDataRows = getDataAfterStartDate(dataRows, START_DATE);
    return filteredDataRows ? getCountyDataByState(filteredDataRows) : {};
  }, [dataRows]);

  const {
    countyOptions,
    totalCasesForCountyChartData,
    newCasesForCountyChartData,
    totalDeathsForCountyChartData,
    newDeathsForCountyChartData,
  } = useMemo(() => {
    const countyOptions = createCountyOptions(
      stateDictWithCountyData,
      selectedState
    );

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
    } = processCaseDataRows(selectedCountyDataRows);

    const totalCasesForCountyChartData = makeChartData(
      selectedCounty?.value,
      dateRows,
      totalCasesRows
    );
    const newCasesForCountyChartData = makeChartData(
      selectedCounty?.value,
      dateRows,
      newCasesRows
    );
    const totalDeathsForCountyChartData = makeChartData(
      selectedCounty?.value,
      dateRows,
      totalDeathsRows
    );
    const newDeathsForCountyChartData = makeChartData(
      selectedCounty?.value,
      dateRows,
      newDeathsRows
    );

    return {
      countyOptions,
      totalCasesForCountyChartData,
      newCasesForCountyChartData,
      totalDeathsForCountyChartData,
      newDeathsForCountyChartData,
    };
  }, [stateDictWithCountyData, selectedState, selectedCounty]);

  return {
    countyOptions,
    totalCasesForCountyChartData,
    newCasesForCountyChartData,
    totalDeathsForCountyChartData,
    newDeathsForCountyChartData,
  };
};

export type ProccessedCountyData = ReturnType<typeof useProcessedCountyData>;
