import "./App.css";

import React, { FunctionComponent, useContext } from "react";
import Select from "react-select";
import Loader from "react-loader-spinner";

import { viewModeOptions, ViewModeOption } from "../constants";
import { CaseDataContext } from "../providers/CaseData";

import type { Option } from "../types";
import { isParseStateActive } from "./utils";

const Selects: FunctionComponent = () => {
  const {
    countyDataParseState,
    stateDataParseState,
    selectedState,
    selectedCounty,
    selectedViewMode,
    handleStateSelect,
    handleCountySelect,
    handleViewModeSelect,
    processedCountyData,
    processedStateData,
  } = useContext(CaseDataContext);

  const { stateOptions } = processedStateData;
  const { countyOptions } = processedCountyData;

  const isLoadingStates = isParseStateActive(stateDataParseState);
  const isLoadingCounties =
    isParseStateActive(countyDataParseState) ||
    processedCountyData.isProcessingCounties;

  return (
    <>
      <div className="select-container">
        <>
          {isLoadingStates ? (
            <div>
              Loading states...
              <Loader type="TailSpin" color="#00BFFF" height={25} width={25} />
            </div>
          ) : (
            <div>
              <label htmlFor="state-select">State</label>
              <Select
                isClearable
                value={selectedState}
                options={stateOptions}
                onChange={(selected) => handleStateSelect(selected as Option)}
                placeholder="Select State"
                id="state-select"
                data-testid="state-select"
              />
            </div>
          )}
        </>
        <>
          {isLoadingCounties ? (
            <div>
              Loading counties...
              <Loader type="TailSpin" color="#00BFFF" height={25} width={25} />
            </div>
          ) : (
            <div>
              <label htmlFor="county-select">County</label>
              <Select
                isClearable
                value={selectedCounty}
                options={countyOptions}
                onChange={(selected) => handleCountySelect(selected as Option)}
                placeholder="Select County"
                id="county-select"
                data-testid="county-select"
              />
            </div>
          )}
        </>
        <label htmlFor="mode-select">View Mode</label>
        <Select
          value={selectedViewMode}
          options={viewModeOptions}
          onChange={(selected) =>
            handleViewModeSelect(selected as ViewModeOption)
          }
          placeholder="Select View Mode"
          id="mode-select"
          data-testid="mode-select"
        />
      </div>
    </>
  );
};

export default Selects;
