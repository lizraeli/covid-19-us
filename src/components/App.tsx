import logo from "./logo.svg";
import "./App.css";

import React, { useState, useEffect } from "react";
import Select from "react-select";
import Chart from "react-apexcharts";

import { US_STATES_CSV_URL, US_COUNTIES_CSV_URL } from "../constants";
import {
  useParseCSV,
  useProcessedCountyData,
  useProcessedStateData,
} from "../hooks";
import { isAnyParseStateActive, getErrorFromParseStates } from "./utils";

import type { CountyData, Option, StateData } from "../types";

enum ViewMode {
  TOTAL_CASES = "TOTAL_CASES",
  NEW_CASES = "NEW_CASES",
}

const viewModeOptions: Option[] = [
  {
    label: "Total Cases",
    value: ViewMode.TOTAL_CASES,
  },
  {
    label: "New Cases",
    value: ViewMode.NEW_CASES,
  },
];

function App() {
  const [selectedState, setSelectedState] = useState<Option | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<Option | null>(null);
  const [selectedViewMode, setSelectedViewMode] = useState(viewModeOptions[0]);

  const {
    parseState: countyDataParseState,
    fetchAndParseData: fetchAndParseCountyData,
  } = useParseCSV<CountyData>(US_COUNTIES_CSV_URL);

  const {
    parseState: stateDataParseState,
    fetchAndParseData: fetchAndParseStateData,
  } = useParseCSV<StateData>(US_STATES_CSV_URL);

  const {
    totalCasesChartData: totalCasesForCountyChartData,
    newCasesChartData: newCasesForCountyChartData,
    countyOptions,
  } = useProcessedCountyData(
    countyDataParseState,
    selectedState,
    selectedCounty
  );

  const {
    stateOptions,
    totalCasesChartData: totalCasesForStateChartData,
    newCasesChartData: newCasesForStateChartData,
  } = useProcessedStateData(stateDataParseState, selectedState);

  useEffect(() => {
    fetchAndParseCountyData();
    fetchAndParseStateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStateSelect = (selectedState: Option) => {
    setSelectedState(selectedState);
    setSelectedCounty(null);
  };

  const handleCountySelect = (selectedCounty: Option) => {
    setSelectedCounty(selectedCounty);
  };

  const error = getErrorFromParseStates(
    countyDataParseState,
    stateDataParseState
  );

  if (error) {
    return (
      <div className="App">
        <header className="App-header">
          <div data-testid="error-message"> {error} </div>
        </header>
      </div>
    );
  }

  const isActive = isAnyParseStateActive(
    countyDataParseState,
    stateDataParseState
  );

  if (isActive) {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div> Loading Data </div>
        </header>
      </div>
    );
  }
  const getTotalCasesChartData = () =>
    selectedCounty ? totalCasesForCountyChartData : totalCasesForStateChartData;

  const getNewCasesChartData = () =>
    selectedCounty ? newCasesForCountyChartData : newCasesForStateChartData;

  const getHeading = () => {
    if (!selectedState) {
      return `Please choose a state`;
    }

    return selectedCounty
      ? `${selectedViewMode.label} in ${selectedCounty.label}, ${selectedState.label}`
      : `${selectedViewMode.label} in ${selectedState.label}`;
  };

  const chartData =
    selectedViewMode.value === ViewMode.TOTAL_CASES
      ? getTotalCasesChartData()
      : getNewCasesChartData();

  return (
    <div className="main-container">
      <h2>Covid-19 Case Tracker</h2>
      <div className="select-container">
        <div>
          <label htmlFor="state-select">State</label>
          <Select
            isClearable
            value={selectedState}
            options={stateOptions}
            onChange={(selected) => handleStateSelect(selected as Option)}
            placeholder="Select State"
            id="state-select"
          />
        </div>
        <div>
          <label htmlFor="county-select">County</label>
          <Select
            isClearable
            value={selectedCounty}
            options={countyOptions}
            onChange={(selected) => handleCountySelect(selected as Option)}
            placeholder="Select County"
            id="county-select"
          />
        </div>
        <label htmlFor="mode-select">View Mode</label>
        <Select
          value={selectedViewMode}
          options={viewModeOptions}
          onChange={(selected) => setSelectedViewMode(selected as Option)}
          placeholder="Select View Mode"
          id="mode-select"
        />
      </div>
      <h2>{getHeading()}</h2>
      {selectedState && (
        <Chart
          data-testid="chart"
          options={chartData.options}
          series={chartData.series}
          width={"100%"}
          height={380}
          type="bar"
        />
      )}
    </div>
  );
}

export default App;
