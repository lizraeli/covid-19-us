import moment from 'moment';

export enum ParseStatus {
  UNDEFINED = 'UNDEFINED',
  SUCCESS = 'SUCCESS',
  PARSING = 'PARSING',
  ERROR = 'ERROR',
}

export enum ViewMode {
  TOTAL_CASES = 'TOTAL_CASES',
  NEW_CASES = 'NEW_CASES',
  TOTAL_DEATHS = 'TOTAL_DEATHS',
  NEW_DEATHS = 'NEW_DEATHS',
}

export interface ViewModeOption {
  value: ViewMode;
  label: string;
}

export const viewModeOptions: ViewModeOption[] = [
  {
    label: 'Total Cases',
    value: ViewMode.TOTAL_CASES,
  },
  {
    label: 'New Cases',
    value: ViewMode.NEW_CASES,
  },
  {
    label: 'Total Deaths',
    value: ViewMode.TOTAL_DEATHS,
  },
  {
    label: 'New Deaths',
    value: ViewMode.NEW_DEATHS,
  },
];

// As of March 24, 2023, the NY times data is no longer updated
// See https://www.nytimes.com/2023/03/22/us/covid-data-cdc.html
export const END_DATE = moment('March 24, 2023');

export const START_DATE = END_DATE.subtract(90, 'days').format('YYYY-MM-DD');

export const US_CSV_URL =
  'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us.csv';

export const US_STATES_CSV_URL =
  'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv';

export const US_COUNTIES_CSV_URL =
  'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties-recent.csv';
