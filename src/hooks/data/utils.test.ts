import { calcNewCases, getDataAfterStartDate, calcDataForUS } from "./utils";

describe("calcNewCases", () => {
  test("calcNewCases with new cases every day", () => {
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

    expect(calcNewCases(data)).toEqual([10, 20, 10]);
  });

  test("calcNewCases with no cases on day 1", () => {
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

    expect(calcNewCases(data)).toEqual([0, 20, 10]);
  });

  test("calcNewCases with no new cases on day 3", () => {
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

    expect(calcNewCases(data)).toEqual([10, 10, 0]);
  });

  test("calcNewCases with no cases on any day", () => {
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

    expect(calcNewCases(data)).toEqual([0, 0, 0]);
  });
});

describe("getDataAfterStartDate", () => {
  test("getDataAfterStartDate with start date before first day", () => {
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

  test("getDataAfterStartDate with early start date equal to first day", () => {
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

  test("getDataAfterStartDate with early start date equal to last day", () => {
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
  test("data", () => {
    const stateData = [
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
    const { dateRowsUS, totalUSCasesRows, newUSCasesRows } = calcDataForUS(
      stateData
    );
    expect(dateRowsUS).toEqual(["2020-03-27", "2020-03-28", "2020-03-29"]);
    expect(totalUSCasesRows).toEqual([500, 3000, 4500]);
    expect(newUSCasesRows).toEqual([500, 2500, 1500]);
  });
});
