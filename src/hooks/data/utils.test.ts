import {
  calcNewCasesRows,
  getDataAfterStartDate,
} from "./worker/calcData";
import { CaseData } from "../../types";

describe("calcNewCasesRows", () => {
  const mapAndCalcNewCasesRows = (caseDataRows: CaseData[]) => {
    const totalCasesRows = caseDataRows.map((caseData) => caseData.cases);
    return calcNewCasesRows(totalCasesRows);
  };

  test("new cases every day", () => {
    const data = [
      {
        date: "2020-03-28",
        cases: 10,
        deaths: 0,
      },
      {
        date: "2020-03-29",
        fips: 34,
        cases: 30,
        deaths: 0,
      },
      {
        date: "2020-03-30",
        fips: 36,
        cases: 40,
        deaths: 0,
      },
    ];

    expect(mapAndCalcNewCasesRows(data)).toEqual([10, 20, 10]);
  });

  test("no cases on day 1", () => {
    const data = [
      {
        date: "2020-03-28",
        cases: 0,
        deaths: 0,
      },
      {
        date: "2020-03-29",
        fips: 34,
        cases: 20,
        deaths: 0,
      },
      {
        date: "2020-03-30",
        fips: 36,
        cases: 30,
        deaths: 0,
      },
    ];

    expect(mapAndCalcNewCasesRows(data)).toEqual([0, 20, 10]);
  });

  test("no new cases on day 3", () => {
    const data = [
      {
        date: "2020-03-28",
        cases: 10,
        deaths: 0,
      },
      {
        date: "2020-03-29",
        fips: 34,
        cases: 20,
        deaths: 0,
      },
      {
        date: "2020-03-30",
        fips: 36,
        cases: 20,
        deaths: 0,
      },
    ];

    expect(mapAndCalcNewCasesRows(data)).toEqual([10, 10, 0]);
  });

  test("no cases on any day", () => {
    const data = [
      {
        date: "2020-03-28",
        cases: 0,
        deaths: 0,
      },
      {
        date: "2020-03-29",
        fips: 34,
        cases: 0,
        deaths: 0,
      },
      {
        date: "2020-03-30",
        fips: 36,
        cases: 0,
        deaths: 0,
      },
    ];

    expect(mapAndCalcNewCasesRows(data)).toEqual([0, 0, 0]);
  });
});

describe("getDataAfterStartDate", () => {
  test("start date before first day", () => {
    const data = [
      {
        date: "2020-03-28",
        cases: 10,
        deaths: 0,
      },
      {
        date: "2020-03-29",
        fips: 34,
        cases: 30,
        deaths: 0,
      },
      {
        date: "2020-03-30",
        fips: 36,
        cases: 40,
        deaths: 0,
      },
    ];

    expect(getDataAfterStartDate(data, "2020-03-27")).toEqual(data);
  });

  test("start date equal to first day", () => {
    const data = [
      {
        date: "2020-03-28",
        cases: 10,
        deaths: 0,
      },
      {
        date: "2020-03-29",
        fips: 34,
        cases: 30,
        deaths: 0,
      },
      {
        date: "2020-03-30",
        fips: 36,
        cases: 40,
        deaths: 0,
      },
    ];

    expect(getDataAfterStartDate(data, "2020-03-28")).toEqual(data.slice(1));
  });

  test("start date equal to last day", () => {
    const data = [
      {
        date: "2020-03-28",
        cases: 10,
        deaths: 0,
      },
      {
        date: "2020-03-29",
        fips: 34,
        cases: 30,
        deaths: 0,
      },
      {
        date: "2020-03-30",
        fips: 36,
        cases: 40,
        deaths: 0,
      },
    ];

    expect(getDataAfterStartDate(data, "2020-03-30")).toEqual([]);
  });
});
