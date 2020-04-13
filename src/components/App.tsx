import "./App.css";

import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";

import { US_STATES_CSV_URL, US_COUNTIES_CSV_URL, viewModeOptions } from "../constants";
import {
  useParseCSV,
  useProcessedCountyData,
  useProcessedStateData,
} from "../hooks";
import { isAnyParseStateActive, getErrorFromParseStates } from "./utils";
import ChartContent from "./Chart";
import Selects from "./Selects";

import type { CountyData, Option, StateData } from "../types";


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

  const processedCountyData = useProcessedCountyData(
    countyDataParseState,
    selectedState,
    selectedCounty
  );

  const processedStateData = useProcessedStateData(
    stateDataParseState,
    selectedState
  );

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

  const { countyOptions } = processedCountyData;
  const { stateOptions } = processedStateData;

  const error = getErrorFromParseStates(
    countyDataParseState,
    stateDataParseState
  );

  const isLoading = isAnyParseStateActive(
    countyDataParseState,
    stateDataParseState
  );

  return (
    <div className="main-container">
      <h2 className="heading">Covid-19 Case Tracker</h2>
      {error ? (
        <div className="error-container">
          <div data-testid="error-message"> {error} </div>
        </div>
      ) : isLoading ? (
        <div className="loader-container">
          <div> Loading Data...</div>
          <Loader type="TailSpin" color="#00BFFF" height={100} width={100} />
        </div>
      ) : (
        <>
          <Selects
            countyOptions={countyOptions}
            stateOptions={stateOptions}
            selectedState={selectedState}
            selectedCounty={selectedCounty}
            selectedViewMode={selectedViewMode}
            handleStateSelect={handleStateSelect}
            handleCountySelect={handleCountySelect}
            handleViewModeSelect={setSelectedViewMode}
          />
          <ChartContent
            processedCountyData={processedCountyData}
            processedStateData={processedStateData}
            selectedViewMode={selectedViewMode}
            selectedState={selectedState}
            selectedCounty={selectedCounty}
          />
        </>
      )}
    </div>
  );
}

export default App;
