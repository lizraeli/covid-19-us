import React from "react";
import { render, fireEvent } from "@testing-library/react";

import "./setup";
import { ParseStatus, US_STATES_CSV_URL } from "../../constants";
import { stateData, countyData } from "./fixtures/data";
import { useParseCSV } from "../../hooks/csv/parseCSV";
import { calcNewCases } from "../../hooks/data/utils"

/** begin setup  */

// This hook is used twice in App
// Once to fetch and parse the state data
// And once to fetch and parse the county data
jest.mock("../../hooks/csv/parseCSV");
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

// Mocking the chart component
const mockChart = jest.fn((props: any) => (
  <div data-testid="chart" {...props} />
));
jest.mock("react-apexcharts", () => jest.fn(mockChart));

/** end setup  */

beforeEach(() => {
  mockChart.mockClear();
});

test("View total cases for state and county", async () => {
  const App = require("../App").default;
  const { getByTestId } = render(<App />);

  // selecting a state from the state dropdown
  const selectedState = "New York";
  fireEvent.change(getByTestId("state-select"), {
    target: { value: selectedState },
  });

  const dataForState = stateData.filter((data) => data.state === selectedState);
  const stateDataDates = dataForState.map((data) => data.date);
  const stateDataCases = dataForState.map((data) => data.cases);

  // assertions
  let mockChartCall;
  mockChartCall = mockChart.mock.calls[0][0];
  expect(mockChartCall.options.xaxis.categories).toEqual(stateDataDates);
  expect(mockChartCall.series[0]).toEqual({
    name: selectedState,
    data: stateDataCases,
  });

  // selecting a county from the county dropdown
  const selectedCounty = "Essex";
  fireEvent.change(getByTestId("county-select"), {
    target: { value: selectedCounty },
  });

  const dataForCounty = countyData.filter(
    (data) => data.state === selectedState && data.county === selectedCounty
  );
  const countyDataDates = dataForCounty.map((data) => data.date);
  const countyDataCases = dataForCounty.map((data) => data.cases);

  // assertions
  mockChartCall = mockChart.mock.calls[1][0];
  expect(mockChartCall.options.xaxis.categories).toEqual(countyDataDates);
  expect(mockChartCall.series[0]).toEqual({
    name: selectedCounty,
    data: countyDataCases,
  });
});

test("View new cases for state and county", async () => {
  const App = require("../App").default;
  const { getByTestId } = render(<App />);
   
  // Selecting "New Cases" from the mode dropdown
  fireEvent.change(getByTestId("mode-select"), {
    target: { value: "NEW_CASES" },
  });

  // selecting a state from the state dropdown
  const selectedState = "New York";
  fireEvent.change(getByTestId("state-select"), {
    target: { value: selectedState },
  });

  const dataForState = stateData.filter((data) => data.state === selectedState);
  const stateDataDates = dataForState.map((data) => data.date);
  const stateDataNewCases = calcNewCases(dataForState);
  
  // assertions
  let mockChartCall;
  mockChartCall = mockChart.mock.calls[0][0];
  expect(mockChartCall.options.xaxis.categories).toEqual(stateDataDates);
  expect(mockChartCall.series[0]).toEqual({
    name: selectedState,
    data: stateDataNewCases,
  });

  // selecting a county from the county dropdown
  const selectedCounty = "Essex";
  fireEvent.change(getByTestId("county-select"), {
    target: { value: selectedCounty },
  });

  const dataForCounty = countyData.filter(
    (data) => data.state === selectedState && data.county === selectedCounty
  );
  const countyDataDates = dataForCounty.map((data) => data.date);
  const countyDataCases = calcNewCases(dataForCounty);

  // assertions
  mockChartCall = mockChart.mock.calls[1][0];
  expect(mockChartCall.options.xaxis.categories).toEqual(countyDataDates);
  expect(mockChartCall.series[0]).toEqual({
    name: selectedCounty,
    data: countyDataCases,
  });
});
