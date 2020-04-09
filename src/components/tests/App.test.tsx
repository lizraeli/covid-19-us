import React from "react";
import { render, fireEvent, waitForElement } from "@testing-library/react";
import xhrMock from "xhr-mock";
import ParseCSV from "papaparse";

import "./setup";
import { US_STATES_CSV_URL, US_COUNTIES_CSV_URL } from "../../constants";
import { stateData, countyData } from "./fixtures/data";
import { calcNewCases } from "../../hooks/data/utils";

// Mocking the chart component
const mockChart = jest.fn((props: any) => (
  <div data-testid="chart" {...props} />
));

jest.mock("react-apexcharts", () => jest.fn(mockChart));

describe("App", () => {
  beforeAll(() => {
    xhrMock.setup();
    xhrMock.get(US_STATES_CSV_URL, {
      body: ParseCSV.unparse(stateData),
    });

    xhrMock.get(US_COUNTIES_CSV_URL, {
      body: ParseCSV.unparse(countyData),
    });
  });

  beforeEach(() => {
    mockChart.mockClear();
  });

  test("View total cases for state and county", async () => {
    const App = require("../App").default;
    const { getByTestId } = render(<App />);

    // State dropdown will be rendered once the CSV is fetched and parsed
    const stateSelect = await waitForElement(() => getByTestId("state-select"));
    // Selecting a state
    const selectedState = "New York";
    fireEvent.change(stateSelect, {
      target: { value: selectedState },
    });

    const dataForState = stateData.filter(
      (data) => data.state === selectedState
    );
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

    // Mode dropdown will be rendered once the CSV is fetched and parsed
    const modeSelect = await waitForElement(() => getByTestId("mode-select"));
    // Selecting "New Cases"
    fireEvent.change(modeSelect, {
      target: { value: "NEW_CASES" },
    });

    // selecting a state from the state dropdown
    const selectedState = "New York";
    fireEvent.change(getByTestId("state-select"), {
      target: { value: selectedState },
    });

    const dataForState = stateData.filter(
      (data) => data.state === selectedState
    );
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
});
