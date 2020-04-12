import moment from "moment";
import groupBy from "lodash/groupBy";

import type { CaseData, DataDict } from "../../types";

export const mapToProp = <T, K extends keyof T>(array: T[], key: K) =>
  array.map((element) => element[key]);

export const getDataAfterStartDate = <T extends CaseData>(
  dataRows: T[] | null,
  startDate: string
) => {
  const momentStartDate = moment(startDate);
  return dataRows?.filter((data) => moment(data.date).isAfter(momentStartDate));
};

export const createOptionsFromDataDict = <T extends CaseData>(
  dataDict: DataDict<T> | null
) => {
  const keys = dataDict ? Object.keys(dataDict) : [];
  const options = keys.map((key: string) => ({ value: key, label: key }));

  return options;
};

export const processCaseDataRows = (caseDataRows: CaseData[]) => {
  const dateRows = mapToProp(caseDataRows, "date");
  const totalCasesRows = mapToProp(caseDataRows, "cases");
  const newCasesRows = calcNewCasesRows(totalCasesRows);

  return {
    dateRows,
    totalCasesRows,
    newCasesRows,
  };
};

export const calcNewCasesRows = (
  totalCasesRows: number[]
) => {
  const newCasesRows = totalCasesRows.map((cases, index) => {
    const isFirstElement = index === 0;
    const prevCases = isFirstElement ? 0 : totalCasesRows[index - 1];
    const newCases = cases - prevCases;

    return newCases;
  });

  return newCasesRows;
};

export const calcDataForUS = (caseDataRowsByState: CaseData[]) => {
  const dateDataDict = groupBy(caseDataRowsByState, (data) => data.date)

  const totalCasesRowsUS = Object.values(dateDataDict).map((caseDataRows) =>
    caseDataRows.reduce((cases, data) => cases + data.cases, 0)
  );
  const newCasesRowsUS = calcNewCasesRows(totalCasesRowsUS);
  const dateRowsUS = Object.keys(dateDataDict);

  return { dateRowsUS, totalCasesRowsUS, newCasesRowsUS };
};
