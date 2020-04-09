import { useMemo } from "react";
import groupBy from "lodash/groupBy";

import { ParseStatus, START_DATE } from "../../constants";
import {
  createOptionsFromDataDict,
  mapSelectedRows,
  makeChartData,
  getDataAfterStartDate,
} from "./utils";
import type {
  CountyDataByStateDict,
  ParseState,
  Option,
  CountyData,
} from "../../types";

export const getSelectedCountyData = (
  CountyDataByStateDict: CountyDataByStateDict,
  selectedState: Option | null,
  selectedCounty: Option | null
) => {
  const countyDataByStateDict = selectedState
    ? CountyDataByStateDict[selectedState.value]
    : {};
  const countyData = selectedCounty
    ? countyDataByStateDict[selectedCounty.value]
    : [];

  return countyData;
};

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
    totalCasesChartData,
    newCasesChartData,
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

    const { dateRows, casesRows, newCasesRows } = mapSelectedRows(
      selectedCountyDataRows
    );

    const totalCasesChartData = makeChartData(
      selectedCounty?.value,
      dateRows,
      casesRows
    );

    const newCasesChartData = makeChartData(
      selectedCounty?.value,
      dateRows,
      newCasesRows
    );
    return { countyOptions, totalCasesChartData, newCasesChartData };
  }, [stateDictWithCountyData, selectedState, selectedCounty]);

  return {
    countyOptions,
    totalCasesChartData,
    newCasesChartData,
  };
};
