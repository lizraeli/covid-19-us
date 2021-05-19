import React, { FunctionComponent, createContext, useState } from "react";

import {
  US_STATES_CSV_URL,
  US_COUNTIES_CSV_URL,
  viewModeOptions,
  ViewModeOption,
  US_CSV_URL,
} from "../constants";
import {
  useParseCSV,
  useProcessedUSData,
  useProcessedCountyData,
  useProcessedStateData,
} from "../hooks";
import {
  dataIsCountyData,
  dataIsStateData,
  dataIsUSData,
} from "../hooks/data/utils";

import type {
  ProccessedUSData,
  ProccessedStateData,
  ProccessedCountyData,
} from "../hooks";

import type {
  CountyData,
  Option,
  StateData,
  ParseState,
  USData,
} from "../types";

interface CaseDataContext {
  selectedState: Option | null;
  selectedCounty: Option | null;
  selectedViewMode: ViewModeOption;
  fetchAndParseCountyData: () => Promise<void>;
  fetchAndParseStateData: () => Promise<void>;
  fetchAndParseUSData: () => Promise<void>;
  handleStateSelect: (state: Option) => void;
  handleCountySelect: (county: Option) => void;
  handleViewModeSelect: (viewMode: ViewModeOption) => void;
  countyDataParseState: ParseState<CountyData>;
  stateDataParseState: ParseState<StateData>;
  USDataParseState: ParseState<USData>;
  processedCountyData: ProccessedCountyData;
  processedStateData: ProccessedStateData;
  processedUSData: ProccessedUSData;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CaseDataContext = createContext<CaseDataContext>(
  {} as CaseDataContext
);

export const CaseDataProvider: FunctionComponent = ({ children }) => {
  const [selectedState, setSelectedState] = useState<Option | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<Option | null>(null);
  const [selectedViewMode, setSelectedViewMode] = useState(viewModeOptions[0]);

  const handleStateSelect = (state: Option) => {
    setSelectedState(state);
    setSelectedCounty(null);
  };

  const handleCountySelect = (county: Option) => {
    setSelectedCounty(county);
  };

  const handleViewModeSelect = (viewMode: ViewModeOption) => {
    setSelectedViewMode(viewMode);
  };

  const {
    parseState: countyDataParseState,
    fetchAndParseData: fetchAndParseCountyData,
  } = useParseCSV<CountyData>(US_COUNTIES_CSV_URL, dataIsCountyData);

  const {
    parseState: stateDataParseState,
    fetchAndParseData: fetchAndParseStateData,
  } = useParseCSV<StateData>(US_STATES_CSV_URL, dataIsStateData);

  const {
    parseState: USDataParseState,
    fetchAndParseData: fetchAndParseUSData,
  } = useParseCSV<USData>(US_CSV_URL, dataIsUSData);

  const processedCountyData = useProcessedCountyData(
    countyDataParseState,
    selectedState,
    selectedCounty
  );

  const processedStateData = useProcessedStateData(
    stateDataParseState,
    selectedState
  );

  const processedUSData = useProcessedUSData(USDataParseState);

  return (
    <CaseDataContext.Provider
      value={{
        fetchAndParseCountyData,
        fetchAndParseStateData,
        fetchAndParseUSData,
        selectedState,
        selectedCounty,
        selectedViewMode,
        handleStateSelect,
        handleCountySelect,
        handleViewModeSelect,
        countyDataParseState,
        stateDataParseState,
        USDataParseState,
        processedCountyData,
        processedStateData,
        processedUSData,
      }}
    >
      {children}
    </CaseDataContext.Provider>
  );
};
