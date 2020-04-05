import logo from "./logo.svg";
import "./App.css";

import React, { useState, useEffect } from "react";
import Select from "react-select";
import Chart from "react-apexcharts";

import { ParseStatus, US_STATES_CSV_URL } from "./constants";
import {
  useParseCSV,
  useProcessedCountyData,
  useProcessedStateData,
} from "./hooks";
import { US_COUNTIES_CSV_URL } from "./constants";
import type { CountyData, StateData, Option, ParseState } from "./types";

function getErrorFromParseStates(...parseStates: ParseState<any>[]) {
  // const parseStateWithError = parseStates.find(parseState => parseState.status === ParseStatus.ERROR)
  for (const parseState of parseStates) {
    if (parseState.status === ParseStatus.ERROR) {
      return parseState.error;
    }
  }

  return null;
}

function isAnyParseStateActive(...parseStates: ParseState<any>[]) {
  return parseStates.some(
    (parseState) => parseState.status === ParseStatus.ACTIVE
  );
}

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
    stateDataDict,
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

  const error = getErrorFromParseStates(
    countyDataParseState,
    stateDataParseState
  );

  if (error) {
    return (
      <div className="App">
        <header className="App-header">
          <div> {error} </div>
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
  console.log("stateDataDict: ", stateDataDict);
  /* countyParseState.status is ParseStatus.SUCCESS */

  const totalCasesChartData = selectedCounty
    ? totalCasesForCountyChartData
    : totalCasesForStateChartData;

  const newCasesChartData = selectedCounty
    ? newCasesForCountyChartData
    : newCasesForStateChartData;

  const chartData =
    selectedViewMode.value === ViewMode.TOTAL_CASES
      ? totalCasesChartData
      : newCasesChartData;

  return (
    <div className="main-container">
      <div className="select-container">
        <label htmlFor="state-select">State</label>
        <Select
          isClearable
          value={selectedState}
          options={stateOptions}
          onChange={(selected) => handleStateSelect(selected as Option)}
          placeholder="Select State"
          id="state-select"
        />
        <label htmlFor="county-select">County</label>
        <Select
          isClearable
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
      {selectedState && (
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
