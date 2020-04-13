import "./App.css";

import React, { FunctionComponent } from "react";
import Select from "react-select";

import { viewModeOptions, ViewModeOption } from "../constants";

import type { Option } from "../types";

interface SelectsProps {
  countyOptions: Option[];
  stateOptions: Option[];
  selectedState: Option | null;
  selectedCounty: Option | null;
  selectedViewMode: ViewModeOption;
  handleStateSelect: (state: Option) => void;
  handleCountySelect: (county: Option) => void;
  handleViewModeSelect: (viewMode: ViewModeOption) => void;
}

const Selects: FunctionComponent<SelectsProps> = ({
  countyOptions,
  stateOptions,
  selectedState,
  selectedCounty,
  selectedViewMode,
  handleStateSelect,
  handleCountySelect,
  handleViewModeSelect,
}) => {
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
            handleViewModeSelect(selected as ViewModeOption)
          }
          placeholder="Select View Mode"
          id="mode-select"
        />
      </div>
    </>
  );
};

export default Selects;
