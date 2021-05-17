import "./App.css";

import React, { useContext } from "react";
import Loader from "react-loader-spinner";

import {
  isAnyParseStateActive,
  getErrorFromParseStates,
  isParseStateActive,
} from "./utils";
import { CaseDataContext } from "../providers/CaseData";
import ChartContent from "./Chart";
import Selects from "./Selects";

function App() {
  const { countyDataParseState, stateDataParseState, USDataParseState } =
    useContext(CaseDataContext);

  const error = getErrorFromParseStates(
    countyDataParseState,
    stateDataParseState,
    USDataParseState
  );

  const isLoading = isAnyParseStateActive(
    countyDataParseState,
    stateDataParseState,
    USDataParseState
  );

  const getLoadingMessage = () => {
    if (isParseStateActive(USDataParseState)) {
      return "Loading US data";
    }
    if (isParseStateActive(stateDataParseState)) {
      return "Loading state data";
    }
    if (isParseStateActive(countyDataParseState)) {
      return "Loading county data";
    }

    return "Loading data...";
  };

  return (
    <div className="main-container">
      <h2 className="heading">Covid-19 Case Tracker</h2>
      {error ? (
        <div className="error-container">
          <div data-testid="error-message"> {error} </div>
        </div>
      ) : isLoading ? (
        <div className="loader-container">
          <div> {getLoadingMessage()}</div>
          <Loader type="TailSpin" color="#00BFFF" height={100} width={100} />
        </div>
      ) : (
        <>
          <Selects />
          <ChartContent />
          <div className="notes">
            This tracker uses data from The New York Times, based on reports
            from state and local health agencies. The data files can be accessed
            on github at{" "}
            <a href="https://github.com/nytimes/covid-19-data">
              nytimes/covid-19-data
            </a>
            . The code that powers this tracker is available on github at{" "}
            <a href="https://github.com/lizraeli/covid-19-us">
              lizraeli/covid-19-us
            </a>
            .
          </div>
        </>
      )}
    </div>
  );
}

export default App;
