import groupBy from "lodash/groupBy";

import type {
  CountyData,
  CountyDataDict,
  CountyDataByStateDict,
  Option,
} from "./types";

const getDataByCounty = (countiesDataRows: CountyData[]): CountyDataDict => {
  return groupBy(countiesDataRows, (countyData) => countyData.county);
};

const getDataByState = (countiesDataRows: CountyData[]): CountyDataDict => {
  return groupBy(countiesDataRows, (countyData) => countyData.state);
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
 * @param countiesDataRows
 */
const getCountyDataByState = (
  countiesDataRows: CountyData[]
): CountyDataByStateDict => {
  const dataByStateDict = getDataByState(countiesDataRows);
  const CountyDataByStateDict = Object.entries(dataByStateDict).reduce(
    (dict, [state, dataRows]) => {
      return {
        ...dict,
        [state]: getDataByCounty(dataRows),
      };
    },
    {} as CountyDataByStateDict
  );

  return CountyDataByStateDict;
};

const createOption = (state: string) => ({ value: state, label: state });

export const processCountyDataByState = (
  countyDataRows: CountyData[] | null
) => {
  const CountyDataByStateDict = countyDataRows
    ? getCountyDataByState(countyDataRows)
    : {};
  const states = Object.keys(CountyDataByStateDict);
  const stateOptions = states.map(createOption);

  return {
    CountyDataByStateDict,
    stateOptions,
  };
};

export const createCountyOptions = (
  CountyDataByStateDict: CountyDataByStateDict,
  selectedState: Option | null
) => {
  const countyInCountyDataByStateDict = selectedState
    ? CountyDataByStateDict[selectedState.value]
    : {};
  const counties = countyInCountyDataByStateDict
    ? Object.keys(countyInCountyDataByStateDict)
    : [];
  const countyOptions = counties.map(createOption);

  return countyOptions;
};

export const getSelectedCountyData = (
  CountyDataByStateDict: CountyDataByStateDict,
  selectedState: Option | null,
  selectedCounty: Option | null
) => {
  const countyInCountyDataByStateDict = selectedState
    ? CountyDataByStateDict[selectedState.value]
    : {};
  const countyData = selectedCounty
    ? countyInCountyDataByStateDict[selectedCounty.value]
    : [];
  return countyData;
};

export const makeChartData = (
  name: string = "chart",
  categories: string[],
  data: number[]
) => {
  return {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories,
      },
    },
    series: [
      {
        name,
        data,
      },
    ],
  };
};
