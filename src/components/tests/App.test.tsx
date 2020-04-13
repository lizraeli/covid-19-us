import React from "react";
import { render, fireEvent, waitForElement } from "@testing-library/react";
import xhrMock from "xhr-mock";
import ParseCSV from "papaparse";

import "./setup";
import { US_STATES_CSV_URL, US_COUNTIES_CSV_URL } from "../../constants";
import { stateData, countyData } from "./fixtures/data";
import { calcNewCasesRows, calcDataForUS } from "../../hooks/data/utils";

import type { CaseData } from "../../types";

// Mocking the chart component
const mockChart = jest.fn((props: any) => (
  <div data-testid="chart" {...props} />
));

jest.mock("react-apexcharts", () => jest.fn(mockChart));

describe("App", () => {
  const renderAppWithProvider = () => {
    const App = require("../App").default;
    const CaseDataProvider = require("../../providers/CaseData").CaseDataProvider;
    return render(
      <CaseDataProvider>
        <App />
      </CaseDataProvider>
    );
  };
  const mapAndCalcNewDataRows = (
    caseDataRows: CaseData[],
    property: "cases" | "deaths"
  ) => {
    const totalCasesRows = caseDataRows.map((caseData) => caseData[property]);
    return calcNewCasesRows(totalCasesRows);
  };

  const csvStateData = ParseCSV.unparse(stateData);
  const csvCountyData = ParseCSV.unparse(countyData);

  beforeEach(() => {
    xhrMock.setup();
    mockChart.mockClear();
  });

  afterEach(() => {
    xhrMock.teardown();
  });

  test("Error fetching", async () => {
    const errorMessage = "Could not fetch.";
    xhrMock.get(US_STATES_CSV_URL, {
      status: 400,
      reason: errorMessage,
      body: '{"error": "error"}',
    });
    xhrMock.get(US_COUNTIES_CSV_URL, {
      body: csvCountyData,
    });

    const { getByTestId } = renderAppWithProvider();

    // State dropdown will be rendered once the CSV fails to fetch
    const errorElem = await waitForElement(() => getByTestId("error-message"));

    expect(errorElem.textContent).toContain(errorMessage);
  });

  test("Invalid csv", async () => {
    xhrMock.get(US_STATES_CSV_URL, {
      body: "asdsa/sadsadsDasdas/",
    });
    xhrMock.get(US_COUNTIES_CSV_URL, {
      body: csvCountyData,
    });

    const { getByTestId } = renderAppWithProvider();

    // State dropdown will be rendered once the CSV fails to fetch
    const errorElem = await waitForElement(() => getByTestId("error-message"));

    expect(errorElem.textContent).toContain("");
  });

  test("View total cases for state and county", async () => {
    xhrMock.get(US_STATES_CSV_URL, {
      body: csvStateData,
    });
    xhrMock.get(US_COUNTIES_CSV_URL, {
      body: csvCountyData,
    });

    const { getByTestId } = renderAppWithProvider();;

    // State dropdown will be rendered once the CSV is fetched and parsed
    const stateSelect = await waitForElement(() => getByTestId("state-select"));

    // Initially will show data for the US
    expect(getByTestId("heading").textContent).toEqual("Total Cases in the US");

    // assertions about data provided to chart
    const { totalCasesRowsUS, dateRowsUS } = calcDataForUS(stateData);

    let mockChartCall;
    mockChartCall = mockChart.mock.calls[0][0];
    expect(mockChartCall.options.xaxis.categories).toEqual(dateRowsUS);
    expect(mockChartCall.series[0]).toEqual({
      name: "US",
      data: totalCasesRowsUS,
    });

    // Selecting a state
    const selectedState = "New York";
    fireEvent.change(stateSelect, {
      target: { value: selectedState },
    });

    // assert heading content
    expect(getByTestId("heading").textContent).toEqual(
      "Total Cases in New York"
    );

    // assertions about data provided to chart
    const dataForState = stateData.filter(
      (data) => data.state === selectedState
    );
    const stateDataDates = dataForState.map((data) => data.date);
    const stateDataCases = dataForState.map((data) => data.cases);

    mockChartCall = mockChart.mock.calls[1][0];
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

    // assert heading content
    expect(getByTestId("heading").textContent).toEqual(
      "Total Cases in Essex, New York"
    );

    // assertions about data provided to chart
    const dataForCounty = countyData.filter(
      (data) => data.state === selectedState && data.county === selectedCounty
    );
    const countyDataDates = dataForCounty.map((data) => data.date);
    const countyDataCases = dataForCounty.map((data) => data.cases);

    mockChartCall = mockChart.mock.calls[2][0];
    expect(mockChartCall.options.xaxis.categories).toEqual(countyDataDates);
    expect(mockChartCall.series[0]).toEqual({
      name: selectedCounty,
      data: countyDataCases,
    });
  });

  test("View new cases for US, state and county", async () => {
    xhrMock.get(US_STATES_CSV_URL, {
      body: csvStateData,
    });

    xhrMock.get(US_COUNTIES_CSV_URL, {
      body: csvCountyData,
    });

    const { getByTestId } = renderAppWithProvider();

    // Mode dropdown will be rendered once the CSV is fetched and parsed
    const modeSelect = await waitForElement(() => getByTestId("mode-select"));
    // Selecting "New Cases"
    fireEvent.change(modeSelect, {
      target: { value: "NEW_CASES" },
    });

    // Initially will show data for the US
    expect(getByTestId("heading").textContent).toEqual("New Cases in the US");

    // assertions about data provided to chart
    const { newCasesRowsUS, dateRowsUS } = calcDataForUS(stateData);

    let mockChartCall;
    // Will show total cases by default. This is tested elsewhere.
    mockChartCall = mockChart.mock.calls[1][0];
    expect(mockChartCall.options.xaxis.categories).toEqual(dateRowsUS);
    expect(mockChartCall.series[0]).toEqual({
      name: "US",
      data: newCasesRowsUS,
    });

    // selecting a state from the state dropdown
    const selectedState = "New York";
    fireEvent.change(getByTestId("state-select"), {
      target: { value: selectedState },
    });

    // assert heading content
    expect(getByTestId("heading").textContent).toEqual("New Cases in New York");

    // assertions about data provided to chart
    const dataForState = stateData.filter(
      (caseData) => caseData.state === selectedState
    );
    const stateDataDateRows = dataForState.map((caseData) => caseData.date);
    const stateDataNewCases = mapAndCalcNewDataRows(dataForState, "cases");

    mockChartCall = mockChart.mock.calls[2][0];
    expect(mockChartCall.options.xaxis.categories).toEqual(stateDataDateRows);
    expect(mockChartCall.series[0]).toEqual({
      name: selectedState,
      data: stateDataNewCases,
    });

    // selecting a county from the county dropdown
    const selectedCounty = "Essex";
    fireEvent.change(getByTestId("county-select"), {
      target: { value: selectedCounty },
    });
    // assert heading content
    expect(getByTestId("heading").textContent).toEqual(
      "New Cases in Essex, New York"
    );

    // assertions about data provided to chart
    const dataForCounty = countyData.filter(
      (data) => data.state === selectedState && data.county === selectedCounty
    );
    const countyDataDates = dataForCounty.map((data) => data.date);
    const countyDataCases = mapAndCalcNewDataRows(dataForCounty, "cases");

    mockChartCall = mockChart.mock.calls[3][0];
    expect(mockChartCall.options.xaxis.categories).toEqual(countyDataDates);
    expect(mockChartCall.series[0]).toEqual({
      name: selectedCounty,
      data: countyDataCases,
    });
  });

  test("View total deaths for US, state and county", async () => {
    xhrMock.get(US_STATES_CSV_URL, {
      body: csvStateData,
    });

    xhrMock.get(US_COUNTIES_CSV_URL, {
      body: csvCountyData,
    });

    const { getByTestId } = renderAppWithProvider();

    // Mode dropdown will be rendered once the CSV is fetched and parsed
    const modeSelect = await waitForElement(() => getByTestId("mode-select"));

    // Selecting "Total Deaths"
    fireEvent.change(modeSelect, {
      target: { value: "TOTAL_DEATHS" },
    });

    // Initially will show data for the US
    expect(getByTestId("heading").textContent).toEqual(
      "Total Deaths in the US"
    );

    // assertions about data provided to chart
    const { totalDeathsRowsUS, dateRowsUS } = calcDataForUS(stateData);

    let mockChartCall;
    // Will show total cases by default. This is tested elsewhere.
    // assertions about data provided to chart
    mockChartCall = mockChart.mock.calls[1][0];
    expect(mockChartCall.options.xaxis.categories).toEqual(dateRowsUS);
    expect(mockChartCall.series[0]).toEqual({
      name: "US",
      data: totalDeathsRowsUS,
    });

    // selecting a state from the state dropdown
    const selectedState = "New York";
    fireEvent.change(getByTestId("state-select"), {
      target: { value: selectedState },
    });

    // assert heading content
    expect(getByTestId("heading").textContent).toEqual(
      "Total Deaths in New York"
    );

    // assertions about data provided to chart
    const dataForState = stateData.filter(
      (caseData) => caseData.state === selectedState
    );
    const stateDataDateRows = dataForState.map((caseData) => caseData.date);
    const stateDataTotalDeaths = dataForState.map(
      (caseData) => caseData.deaths
    );

    mockChartCall = mockChart.mock.calls[2][0];
    expect(mockChartCall.options.xaxis.categories).toEqual(stateDataDateRows);
    expect(mockChartCall.series[0]).toEqual({
      name: selectedState,
      data: stateDataTotalDeaths,
    });

    // selecting a county from the county dropdown
    const selectedCounty = "Essex";
    fireEvent.change(getByTestId("county-select"), {
      target: { value: selectedCounty },
    });
    // assert heading content
    expect(getByTestId("heading").textContent).toEqual(
      "Total Deaths in Essex, New York"
    );

    // assertions about data provided to chart
    const dataForCounty = countyData.filter(
      (data) => data.state === selectedState && data.county === selectedCounty
    );
    const countyDataDates = dataForCounty.map((data) => data.date);
    const countyDataDeaths = dataForCounty.map((data) => data.deaths);

    mockChartCall = mockChart.mock.calls[3][0];
    expect(mockChartCall.options.xaxis.categories).toEqual(countyDataDates);
    expect(mockChartCall.series[0]).toEqual({
      name: selectedCounty,
      data: countyDataDeaths,
    });
  });

  test("View new deaths for US, state and county", async () => {
    xhrMock.get(US_STATES_CSV_URL, {
      body: csvStateData,
    });

    xhrMock.get(US_COUNTIES_CSV_URL, {
      body: csvCountyData,
    });

    const { getByTestId } = renderAppWithProvider();

    // Mode dropdown will be rendered once the CSV is fetched and parsed
    const modeSelect = await waitForElement(() => getByTestId("mode-select"));
    // Selecting "New Deaths"
    fireEvent.change(modeSelect, {
      target: { value: "NEW_DEATHS" },
    });

    // Initially will show data for the US
    expect(getByTestId("heading").textContent).toEqual("New Deaths in the US");

    // assertions about data provided to chart
    const { newDeathRowsUS, dateRowsUS } = calcDataForUS(stateData);

    let mockChartCall;
    // Will show total cases by default. This is tested elsewhere.
    mockChartCall = mockChart.mock.calls[1][0];
    expect(mockChartCall.options.xaxis.categories).toEqual(dateRowsUS);
    expect(mockChartCall.series[0]).toEqual({
      name: "US",
      data: newDeathRowsUS,
    });

    // selecting a state from the state dropdown
    const selectedState = "New York";
    fireEvent.change(getByTestId("state-select"), {
      target: { value: selectedState },
    });

    // assert heading content
    expect(getByTestId("heading").textContent).toEqual(
      "New Deaths in New York"
    );

    // assertions about data provided to chart
    const dataForState = stateData.filter(
      (caseData) => caseData.state === selectedState
    );
    const stateDataDateRows = dataForState.map((caseData) => caseData.date);
    const stateDataNewCases = mapAndCalcNewDataRows(dataForState, "deaths");

    mockChartCall = mockChart.mock.calls[2][0];
    expect(mockChartCall.options.xaxis.categories).toEqual(stateDataDateRows);
    expect(mockChartCall.series[0]).toEqual({
      name: selectedState,
      data: stateDataNewCases,
    });

    // selecting a county from the county dropdown
    const selectedCounty = "Essex";
    fireEvent.change(getByTestId("county-select"), {
      target: { value: selectedCounty },
    });
    // assert heading content
    expect(getByTestId("heading").textContent).toEqual(
      "New Deaths in Essex, New York"
    );

    // assertions about data provided to chart
    const dataForCounty = countyData.filter(
      (data) => data.state === selectedState && data.county === selectedCounty
    );
    const countyDataDates = dataForCounty.map((data) => data.date);
    const countyDataCases = mapAndCalcNewDataRows(dataForCounty, "deaths");

    mockChartCall = mockChart.mock.calls[3][0];
    expect(mockChartCall.options.xaxis.categories).toEqual(countyDataDates);
    expect(mockChartCall.series[0]).toEqual({
      name: selectedCounty,
      data: countyDataCases,
    });
  });
});
