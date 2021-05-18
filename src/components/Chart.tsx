import "./App.css";

import React, { FunctionComponent, useContext } from "react";
import Chart from "react-apexcharts";
import Loader from "react-loader-spinner";

import { ViewMode } from "../constants";
import { CaseDataContext } from "../providers/CaseData";

const ChartContent: FunctionComponent = () => {
  const {
    processedCountyData,
    processedStateData,
    processedUSData,
    selectedViewMode,
    selectedState,
    selectedCounty,
  } = useContext(CaseDataContext);

  const {
    totalCasesForStateChartData,
    newCasesForStateChartData,
    totalDeathsForStateChartData,
    newDeathsForStateChartData,
  } = processedStateData;

  const getChartData = () => {
    const {
      totalCasesForCountyChartData,
      newCasesForCountyChartData,
      totalDeathsForCountyChartData,
      newDeathsForCountyChartData,
    } = processedCountyData;

    const {
      totalCasesForUSChartData,
      newCasesForUSChartData,
      totalDeathsForUSChartData,
      newDeathsForUSChartData,
    } = processedUSData;

    switch (selectedViewMode.value) {
      case ViewMode.TOTAL_CASES: {
        if (selectedCounty) {
          return totalCasesForCountyChartData;
        }

        if (selectedState) {
          return totalCasesForStateChartData;
        }

        return totalCasesForUSChartData;
      }

      case ViewMode.NEW_CASES: {
        if (selectedCounty) {
          return newCasesForCountyChartData;
        }

        if (selectedState) {
          return newCasesForStateChartData;
        }

        return newCasesForUSChartData;
      }

      case ViewMode.TOTAL_DEATHS: {
        if (selectedCounty) {
          return totalDeathsForCountyChartData;
        }

        if (selectedState) {
          return totalDeathsForStateChartData;
        }

        return totalDeathsForUSChartData;
      }

      case ViewMode.NEW_DEATHS: {
        if (selectedCounty) {
          return newDeathsForCountyChartData;
        }

        if (selectedState) {
          return newDeathsForStateChartData;
        }

        return newDeathsForUSChartData;
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

  const renderChart = () => {
    const chartData = getChartData();
    return (
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
    );
  };

  const renderLoading = () => {
    return (
      <div className="chart-loader-container">
        <div>Loading Chart Data...</div>
        <Loader type="TailSpin" color="#00BFFF" height={100} width={100} />
      </div>
    );
  };

  const isLoading =
    processedStateData.isLoading || processedCountyData.isLoading;

  return (
    <>
      <div className="heading-container">
        <h2 data-testid="heading" className="heading chart">
          {getHeading()}
        </h2>
      </div>

      <div className="flex-column-container">
        {isLoading ? renderLoading() : renderChart()}
      </div>
    </>
  );
};

export default ChartContent;
