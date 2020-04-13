import "./App.css";

import React, { useContext } from "react";
import Loader from "react-loader-spinner";

import { isAnyParseStateActive, getErrorFromParseStates } from "./utils";
import { CaseDataContext } from "../providers/CaseData";
import ChartContent from "./Chart";
import Selects from "./Selects";

function App() {
  const { countyDataParseState, stateDataParseState } = useContext(
    CaseDataContext
  );

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
          <Selects />
          <ChartContent />
        </>
      )}
    </div>
  );
}

export default App;
