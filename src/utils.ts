import groupBy from "lodash/groupBy";

import type {
  CountyData,
  CountyDataDict,
  StateDataDict,
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
): StateDataDict => {
  const dataByStateDict = getDataByState(countiesDataRows);
  const stateDataDict = Object.entries(dataByStateDict).reduce(
    (dict, [state, dataRows]) => {
      return {
        ...dict,
        [state]: getDataByCounty(dataRows),
      };
    },
    {} as StateDataDict
  );

  return stateDataDict;
};

const createOption = (state: string) => ({ value: state, label: state });

export const processCountyDataByState = (
  countyDataRows: CountyData[] | null
) => {
  const stateDataDict = countyDataRows
    ? getCountyDataByState(countyDataRows)
    : {};
  const states = Object.keys(stateDataDict);
  const stateOptions = states.map(createOption);

  return {
    stateDataDict,
    stateOptions,
  };
};

export const createCountyOptions = (
  stateDataDict: StateDataDict,
  selectedState: Option | null
) => {
  const countyInStateDataDict = selectedState
    ? stateDataDict[selectedState.value]
    : {};
  const counties = countyInStateDataDict
    ? Object.keys(countyInStateDataDict)
    : [];
  const countyOptions = counties.map(createOption);

  return countyOptions;
};

export const getSelectedCountyData = (
  stateDataDict: StateDataDict,
  selectedState: Option | null,
  selectedCounty: Option | null
) => {
  const countyInStateDataDict = selectedState
    ? stateDataDict[selectedState.value]
    : {};
  const countyData = selectedCounty
    ? countyInStateDataDict[selectedCounty.value]
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
