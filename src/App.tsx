import logo from "./logo.svg";
import "./App.css";

import React, { useState, useEffect } from "react";
import Select from "react-select";
import Chart from "react-apexcharts";

import { ParseStatus } from "./constants";
import { useParseCSV, useProcessedCountyData } from "./hooks";
import { US_COUNTIES_CSV_URL } from "./constants";
import type { CountyData, Option } from "./types";

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
    parseState: countyParseState,
    fetchAndParseData: fetchAndParseCountyData,
  } = useParseCSV<CountyData>(US_COUNTIES_CSV_URL);

  const {
    totalCasesChartData,
    newCasesChartData,
    stateOptions,
    countyOptions,
  } = useProcessedCountyData(countyParseState, selectedState, selectedCounty);

  useEffect(() => {
    fetchAndParseCountyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStateSelect = (selectedState: Option) => {
    setSelectedState(selectedState);
    setSelectedCounty(null);
  };

  if (countyParseState.status === ParseStatus.ERROR) {
    return (
      <div className="App">
        <header className="App-header">
          <div> {countyParseState.error} </div>
        </header>
      </div>
    );
  }

  if (countyParseState.status === ParseStatus.ACTIVE) {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div> Loading Data </div>
        </header>
      </div>
    );
  }

  // countyParseState.status is ParseStatus.SUCCESS

  const chartData =
    selectedViewMode.value === ViewMode.TOTAL_CASES
      ? totalCasesChartData
      : newCasesChartData;

  return (
    <div className="main-container">
      <div className="select-container">
        <label htmlFor="state-select">State</label>
        <Select
          value={selectedState}
          options={stateOptions}
          onChange={(selected) => handleStateSelect(selected as Option)}
          placeholder="Select State"
          id="state-select"
        />
        <label htmlFor="county-select">County</label>
        <Select
          value={selectedCounty}
          options={countyOptions}
          onChange={(selected) => setSelectedCounty(selected as Option)}
          placeholder="Select County"
          id="county-select"
        />
        <label htmlFor="mode-select">View Mode</label>
        <Select
          value={selectedViewMode}
          options={viewModeOptions}
          onChange={(selected) => setSelectedViewMode(selected as Option)}
          placeholder="Select View Mode"
          id="mode-select"
        />
      </div>
      {selectedCounty && (
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          width="800"
        />
      )}
    </div>
  );
}

export default App;
