import "./App.css";

import React, { useState, useEffect } from "react";
import Select from "react-select";
import Chart from "react-apexcharts";
import Loader from "react-loader-spinner";

import {
  US_STATES_CSV_URL,
  US_COUNTIES_CSV_URL,
  ParseStatus,
} from "../constants";
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
  TOTAL_DEATHS = "TOTAL_DEATHS",
  NEW_DEATHS = "NEW_DEATHS",
}

interface ViewModeOption extends Option {
  value: ViewMode;
}

const viewModeOptions: ViewModeOption[] = [
  {
    label: "Total Cases",
    value: ViewMode.TOTAL_CASES,
  },
  {
    label: "New Cases",
    value: ViewMode.NEW_CASES,
  },
  {
    label: "Total Deaths",
    value: ViewMode.TOTAL_DEATHS,
  },
  {
    label: "New Deaths",
    value: ViewMode.NEW_DEATHS,
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
    countyOptions,
    totalCasesForCountyChartData,
    newCasesForCountyChartData,
    totalDeathsForCountyChartData,
    newDeathsForCountyChartData,
  } = useProcessedCountyData(
    countyDataParseState,
    selectedState,
    selectedCounty
  );

  const {
    stateOptions,
    totalUSCasesChartData,
    newUSCasesChartData,
    totalUSDeathsChartData,
    newUSDeathsChartData,
    totalCasesForStateChartData,
    newCasesForStateChartData,
    totalDeathsForStateChartData,
    newDeathsForStateChartData,
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

  const renderContent = () => {
    const getChartData = () => {
      switch (selectedViewMode.value) {
        case ViewMode.TOTAL_CASES: {
          if (selectedCounty) {
            return totalCasesForCountyChartData;
          }

          if (selectedState) {
            return totalCasesForStateChartData;
          }

          return totalUSCasesChartData;
        }

        case ViewMode.NEW_CASES: {
          if (selectedCounty) {
            return newCasesForCountyChartData;
          }

          if (selectedState) {
            return newCasesForStateChartData;
          }

          return newUSCasesChartData;
        }

        case ViewMode.TOTAL_DEATHS: {
          if (selectedCounty) {
            return totalDeathsForCountyChartData;
          }

          if (selectedState) {
            return totalDeathsForStateChartData;
          }

          return totalUSDeathsChartData;
        }

        case ViewMode.NEW_DEATHS: {
          if (selectedCounty) {
            return newDeathsForCountyChartData;
          }

          if (selectedState) {
            return newDeathsForStateChartData;
          }

          return newUSDeathsChartData;
        }
      }
    };

    const getHeading = () => {
      if (!selectedState) {
        return `${selectedViewMode.label} in the US`;
      }

      return selectedCounty
        ? `${selectedViewMode.label} in ${selectedCounty.label}, ${selectedState.label}`
        : `${selectedViewMode.label} in ${selectedState.label}`;
    };

    const chartData = getChartData();

    return (
      <>
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
            onChange={(selected) =>
              setSelectedViewMode(selected as ViewModeOption)
            }
            placeholder="Select View Mode"
            id="mode-select"
          />
        </div>
        <div className="heading-container">
          <h2 data-testid="heading" className="heading chart">
            {getHeading()}
          </h2>
        </div>
        <div className="flex-column-container">
          <div className="chart-container">
            <Chart
              data-testid="chart"
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height={380}
              width={1200}
            />
          </div>
        </div>
      </>
    );
  };

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
        renderContent()
      )}
    </div>
  );
}

export default App;
