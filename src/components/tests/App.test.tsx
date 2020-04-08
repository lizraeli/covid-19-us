import React from "react";
import { render, fireEvent } from "@testing-library/react";

import "./setup";
import { ParseStatus, US_STATES_CSV_URL } from "../../constants";
import { stateData, countyData } from "./fixtures/data";
import { useParseCSV } from "../../hooks/csv/parseCSV";

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

test("Select a state and county", async () => {
  // Mocking the chart component
  const mockChart = jest.fn((props: any) => (
    <div data-testid="chart" {...props} />
  ));
  jest.mock("react-apexcharts", () => jest.fn(mockChart));

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
