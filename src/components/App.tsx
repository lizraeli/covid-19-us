import "./App.css";

import React, { useContext, useEffect } from "react";
import Loader from "react-loader-spinner";

import { getErrorFromParseStates, isParseStateActive } from "./utils";
import { CaseDataContext } from "../providers/CaseData";
import ChartContent from "./Chart";
import Selects from "./Selects";
import { ParseStatus } from "../constants";

function App() {
  const {
    fetchAndParseUSData,
    fetchAndParseStateData,
    fetchAndParseCountyData,
    countyDataParseState,
    stateDataParseState,
    USDataParseState,
  } = useContext(CaseDataContext);

  useEffect(() => {
    if (USDataParseState.status === ParseStatus.UNDEFINED) {
      fetchAndParseUSData();
    } else if (
      USDataParseState.status === ParseStatus.SUCCESS &&
      stateDataParseState.status === ParseStatus.UNDEFINED
    ) {
      fetchAndParseStateData();
    } else if (
      stateDataParseState.status === ParseStatus.SUCCESS &&
      countyDataParseState.status === ParseStatus.UNDEFINED
    ) {
      fetchAndParseCountyData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [USDataParseState, stateDataParseState, countyDataParseState]);

  const error = getErrorFromParseStates(
    countyDataParseState,
    stateDataParseState,
    USDataParseState
  );

  useEffect(() => {
    console.log("USDataParseState status: ", USDataParseState.status);
  }, [USDataParseState]);

  useEffect(() => {
    console.log("stateDataParseState status: ", stateDataParseState.status);
  }, [stateDataParseState]);

  useEffect(() => {
    console.log("countyDataParseState status: ", countyDataParseState.status);
  }, [countyDataParseState]);

  return (
    <div className="main-container">
      <h2 className="heading">Covid-19 Case Tracker</h2>
      {error ? (
        <div className="error-container">
          <div data-testid="error-message"> {error} </div>
        </div>
      ) : isParseStateActive(USDataParseState) ? (
        <div className="loader-container">
          <div>Loading US Data...</div>
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
