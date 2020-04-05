import { ParseStatus } from "./constants";

export interface CountyData {
  date: string;
  county: string;
  state: string;
  fips?: number;
  cases: number;
  deaths: number;
}

export interface StateData {
  date: string;
  state: string;
  fips?: number;
  cases: number;
  deaths: number;
}

export type StateDataDict = Record<string, StateData[]>
export type CountyDataDict = Record<string, CountyData[]>;
export type CountyDataByStateDict = Record<string, CountyDataDict>;

export interface Option {
  value: string;
  label: string;
}

export type ParseState<T> =
  | { status: ParseStatus.SUCCESS; data: T[] }
  | { status: ParseStatus.UNDEFINED }
  | { status: ParseStatus.ACTIVE }
  | { status: ParseStatus.ERROR; error: string };
