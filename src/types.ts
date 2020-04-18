import { ParseStatus } from "./constants";

export interface CaseData {
  date: string;
  cases: number;
  deaths: number;
}

export interface USData extends CaseData {}

export interface CountyData extends CaseData {
  county: string;
  state: string;
}

export interface StateData extends CaseData {
  state: string;
}

export interface ChartData {
  options: {
    chart: {
      id: string;
    };
    xaxis: {
      categories: string[];
    };
  };
  series: [
    {
      name: string;
      data: number[];
    }
  ];
}

export type DataDict<T extends CaseData> = Record<string, T[]>;
export type StateDataDict = Record<string, StateData[]>;
export type CountyDataDict = Record<string, CountyData[]>;
export type CountyDataByStateDict = Record<string, CountyDataDict>;

export interface Option {
  value: string;
  label: string;
}

export type ParseState<T> =
  | { status: ParseStatus.SUCCESS; data: T[] }
  | { status: ParseStatus.UNDEFINED }
  | { status: ParseStatus.PARSING }
  | { status: ParseStatus.ERROR; error: string };
