import moment from "moment";

import type { CaseData } from "../../../types";
import { mapToProp } from "../utils";

export const getDataAfterStartDate = <T extends CaseData>(
  dataRows: T[],
  startDate: string
) => {
  const momentStartDate = moment(startDate);
  return dataRows.filter((data) => moment(data.date).isAfter(momentStartDate));
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
    if (isFirstElement) {
      return cases;
    }

    const prevCases = totalCasesRows[index - 1];
    const newCases = cases - prevCases;

    // return 0 if total number was adjusted down,
    // where otherwise the number of new cases would be negative
    return newCases < 0 ? 0 : newCases;
  });

  return newCasesRows;
};
