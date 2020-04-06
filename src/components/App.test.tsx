import React from "react";
import { render } from "@testing-library/react";
// import Chart from "react-apexcharts";
// import App from "./App";
import { ParseStatus, US_STATES_CSV_URL } from "../constants";
// import { stateData, countyData } from "./fixtures";
import { selectOption } from "./helpers";

import { useParseCSV } from "../hooks/csv/parseCSV";
jest.mock("../hooks/csv/parseCSV");
const useParseCSVMock = useParseCSV as jest.Mock;

useParseCSVMock.mockImplementation(
  (url: string): ReturnType<typeof useParseCSV> => {
    const data = url === US_STATES_CSV_URL ? stateData : countyData;

    return {
      fetchAndParseData: jest.fn(),
      parseState: {
        status: ParseStatus.SUCCESS,
        data,
      },
    };
  }
);

const stateData = [
  {
    date: "2020-03-28",
    state: "New Jersey",
    cases: 11124,
    deaths: 140,
  },
  {
    date: "2020-03-28",
    state: "New York",
    cases: 53363,
    deaths: 782,
  },
  {
    date: "2020-03-29",
    state: "New Jersey",
    fips: 34,
    cases: 13386,
    deaths: 161,
  },
  {
    date: "2020-03-29",
    state: "New York",
    fips: 36,
    cases: 59568,
    deaths: 965,
  },
];

const countyData = [
  {
    date: "2020-03-28",
    county: "Essex",
    state: "New Jersey",
    cases: 1086,
    deaths: 20,
  },
  {
    date: "2020-03-28",
    county: "Albany",
    state: "New York",
    cases: 195,
    deaths: 1,
  },
  {
    date: "2020-03-28",
    county: "Essex",
    state: "New York",
    cases: 4,
    deaths: 0,
  },
  {
    date: "2020-03-30",
    county: "Essex",
    state: "New Jersey",
    cases: 1564,
    deaths: 36,
  },
  {
    date: "2020-03-30",
    county: "Albany",
    state: "New York",
    cases: 217,
    deaths: 1,
  },
  {
    date: "2020-03-30",
    county: "Essex",
    state: "New York",
    cases: 5,
    deaths: 0,
  },
];

test("renders learn react link", async () => {
  const mockChart = jest.fn((props: any) => (
    <div data-testid="chart" {...props} />
  ));
  jest.mock("react-apexcharts", () => jest.fn(mockChart));

  const App = require("./App").default;
  const { getByTestId } = render(<App />);
  
  const selectedState = "New Jersey";
  await selectOption(
    getByTestId("state-select"),
    "Select State",
    selectedState
  );

  const dataForState = stateData.filter((data) => data.state === selectedState);
  const stateDataDates = dataForState.map((data) => data.date);
  const stateDataCases = dataForState.map((data) => data.cases);
  const mockChartCall = mockChart.mock.calls[0][0];

  expect(mockChartCall.options.xaxis.categories).toEqual(stateDataDates);
  expect(mockChartCall.series[0]).toEqual({
    name: selectedState,
    data: stateDataCases,
  });
});
