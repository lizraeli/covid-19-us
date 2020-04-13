import "./App.css";

import React, { FunctionComponent, useContext } from "react";
import Chart from "react-apexcharts";

import { ViewMode } from "../constants";
import { CaseDataContext } from "../providers/CaseData";

const ChartContent: FunctionComponent = () => {
  const {
    processedCountyData,
    processedStateData,
    selectedViewMode,
    selectedState,
    selectedCounty,
  } = useContext(CaseDataContext);

  const getChartData = () => {
    const {
      totalCasesForCountyChartData,
      newCasesForCountyChartData,
      totalDeathsForCountyChartData,
      newDeathsForCountyChartData,
    } = processedCountyData;

    const {
      totalUSCasesChartData,
      newUSCasesChartData,
      totalUSDeathsChartData,
      newUSDeathsChartData,
      totalCasesForStateChartData,
      newCasesForStateChartData,
      totalDeathsForStateChartData,
      newDeathsForStateChartData,
    } = processedStateData;

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

export default ChartContent;