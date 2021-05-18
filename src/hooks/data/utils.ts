import moment from "moment";

import type {
  CaseData,
  DataDict,
  USData,
  StateData,
  CountyData,
} from "../../types";
import { chain, last, isNumber, isString } from "lodash";

export const mapToProp = <T, K extends keyof T>(array: T[], key: K) =>
  array.map((element) => element[key]);

export const getDataAfterStartDate = <T extends CaseData>(
  dataRows: T[],
  startDate: string
) => {
  const momentStartDate = moment(startDate);

  const startIndex = dataRows.findIndex((data) =>
    moment(data.date).isAfter(momentStartDate)
  );

  if (startIndex === -1) {
    return [];
  }

  return dataRows.slice(startIndex);
};

const dataIsCaseData = (data: any) => {
  return (
    isString(data?.date) && isNumber(data?.cases) && isNumber(data?.deaths)
  );
};

export const dataIsUSData = (data: any): data is USData => {
  return dataIsCaseData(data);
};

export const dataIsStateData = (data: any): data is StateData => {
  return dataIsCaseData(data) && isString(data?.state);
};

export const dataIsCountyData = (data: any): data is CountyData => {
  return (
    dataIsCaseData(data) && isString(data?.state) && isString(data?.county)
  );
};

export const createOptionsFromDataDict = <T extends CaseData>(
  dataDict: DataDict<T>
) => {
  // sorting by latest number of cases descending
  const keys = chain(dataDict)
    .toPairs()
    .sortBy(([_, cases]) => last(cases)?.cases)
    .map(([key, _]) => key)
    .reverse()
    .value();

  const options = keys.map((key) => ({ value: key, label: key }));

  return options;
};

export const processCaseDataRows = (caseDataRows: CaseData[]) => {
  const dateRows = mapToProp(caseDataRows, "date");
  const totalCasesRows = mapToProp(caseDataRows, "cases");
  const newCasesRows = calcNewCasesRows(totalCasesRows);
  const totalDeathsRows = mapToProp(caseDataRows, "deaths");
  const newDeathsRows = calcNewCasesRows(totalDeathsRows);

  return {
    dateRows,
    totalCasesRows,
    newCasesRows,
    totalDeathsRows,
    newDeathsRows,
  };
};

export const calcNewCasesRows = (totalCasesRows: number[]) => {
  const newCasesRows = totalCasesRows.map((cases, index) => {
    const isFirstElement = index === 0;
    const prevCases = isFirstElement ? 0 : totalCasesRows[index - 1];
    const newCases = cases - prevCases;

    return newCases;
  });

  return newCasesRows;
};
