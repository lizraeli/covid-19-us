export enum ParseStatus {
  UNDEFINED = "UNDEFINED",
  SUCCESS = "SUCCESS",
  PARSING = "PARSING",
  ERROR = "ERROR",
}

export enum ViewMode {
  TOTAL_CASES = "TOTAL_CASES",
  NEW_CASES = "NEW_CASES",
  TOTAL_DEATHS = "TOTAL_DEATHS",
  NEW_DEATHS = "NEW_DEATHS",
}

export interface ViewModeOption {
  value: ViewMode;
  label: string;
}

export const viewModeOptions: ViewModeOption[] = [
  {
    label: "Total Cases",
    value: ViewMode.TOTAL_CASES,
  },
  {
    label: "New Cases",
    value: ViewMode.NEW_CASES,
  },
  {
    label: "Total Deaths",
    value: ViewMode.TOTAL_DEATHS,
  },
  {
    label: "New Deaths",
    value: ViewMode.NEW_DEATHS,
  },
];

export const START_DATE = "2020-03-01";

export const US_STATES_CSV_URL =
  "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv";
//   "https://cdn.jsdelivr.net/gh/nytimes/covid-19-data/us-states.csv";

export const US_COUNTIES_CSV_URL =
  "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";
//   "https://cdn.jsdelivr.net/gh/nytimes/covid-19-data/us-counties.csv";
