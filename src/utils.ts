import groupBy from "lodash/groupBy";

import type {
  CountyData,
  CountyDataDict,
  CountyDataByStateDict,
  Option,
  StateData,
  StateDataDict,
} from "./types";

const groupCountyDataByCounty = (
  countyDataRows: CountyData[]
): CountyDataDict => {
  return groupBy(countyDataRows, (countyData) => countyData.county);
};

const groupCountyDataByState = (
  countyDataRows: CountyData[]
): CountyDataDict => {
  return groupBy(countyDataRows, (countyData) => countyData.state);
};

export const groupStateDataByState = (stateDataRows: StateData[]): StateDataDict => {
  return groupBy(stateDataRows, (stateData) => stateData.state);
};

const createOption = (state: string) => ({ value: state, label: state });

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
  const dataGroupedByState = groupCountyDataByState(countyDataRows);
  const stateDictWithCountyData = Object.entries(dataGroupedByState).reduce(
    (dict, [state, dataRows]) => {
      return {
        ...dict,
        [state]: groupCountyDataByCounty(dataRows),
      };
    },
    {} as CountyDataByStateDict
  );

  return stateDictWithCountyData;
};

// export const getCountyDataByState = (
//   countyDataRows: CountyData[] | null
// ) => {
//   const stateDictWithCountyData = countyDataRows
//     ? getCountyDataByState(countyDataRows)
//     : {};

//   return stateDictWithCountyData,
  
// };


export const createCountyOptions = (
  countyDataByStateDict: CountyDataByStateDict,
  selectedState: Option | null
) => {
  const countiesDataDict = selectedState
    ? countyDataByStateDict[selectedState.value]
    : {};
  const counties = countiesDataDict
    ? Object.keys(countiesDataDict)
    : [];
  const countyOptions = counties.map(createOption);

  return countyOptions;
};

export const createStateOptions = (
    stateDataDict: StateDataDict | null,
  ) => {
    const states = stateDataDict
      ? Object.keys(stateDataDict)
      : [];
    const stateOptions = states.map(createOption);
  
    return stateOptions;
  };

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
