import {
  calcDataForUS,
  calcNewCasesRowsFromTotalCasesRows,
  getDataAfterStartDate,
  getNumberWithCommas,
} from "./utils";
import { CaseData } from "../../types";

describe("getNumberWithCommas", () => {
  test("number with 3 digits", () => {
    expect(getNumberWithCommas(123)).toEqual("123");
  });
  test("number with 6 digits", () => {
    expect(getNumberWithCommas(123456)).toEqual("123,456");
  });
  test("number with 9 digits", () => {
    expect(getNumberWithCommas(123456789)).toEqual("123,456,789");
  });
});

describe("calcNewCasesRowsFromTotalCasesRows", () => {
  const calcNewsCasesRows = (caseDataRows: CaseData[]) => {
    const totalCasesRows = caseDataRows.map((caseData) => caseData.cases);
    return calcNewCasesRowsFromTotalCasesRows(totalCasesRows);
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

    expect(calcNewsCasesRows(data)).toEqual([10, 20, 10]);
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

    expect(calcNewsCasesRows(data)).toEqual([0, 20, 10]);
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

    expect(calcNewsCasesRows(data)).toEqual([10, 10, 0]);
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

    expect(calcNewsCasesRows(data)).toEqual([0, 0, 0]);
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

describe("calcDataForUS", () => {
  test("calcDataForUS", () => {
    const stateCaseData = [
      {
        date: "2020-03-27",
        state: "New Jersey",
        cases: 0,
        deaths: 0,
      },
      {
        date: "2020-03-27",
        state: "New York",
        cases: 500,
        deaths: 0,
      },
      {
        date: "2020-03-28",
        state: "New Jersey",
        cases: 1000,
        deaths: 10,
      },
      {
        date: "2020-03-28",
        state: "New York",
        cases: 2000,
        deaths: 20,
      },
      {
        date: "2020-03-29",
        state: "New Jersey",
        fips: 34,
        cases: 1500,
        deaths: 15,
      },
      {
        date: "2020-03-29",
        state: "New York",
        fips: 36,
        cases: 3000,
        deaths: 25,
      },
    ];
    const { dateRowsUS, totalCasesRowsUS, newCasesRowsUS } = calcDataForUS(
      stateCaseData
    );
    expect(dateRowsUS).toEqual(["2020-03-27", "2020-03-28", "2020-03-29"]);
    expect(totalCasesRowsUS).toEqual([500, 3000, 4500]);
    expect(newCasesRowsUS).toEqual([500, 2500, 1500]);
  });
});
