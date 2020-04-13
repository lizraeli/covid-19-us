import groupBy from "lodash/groupBy";

import { START_DATE } from "../constants";
import {
  calcDataForUS,
  createOptionsFromDataDict,
  getDataAfterStartDate,
  processCaseDataRows,
} from "./caseData";
import { makeChartData } from "./chart";

import type { Option, StateData } from "../types";

export const processStateData = (
  dataRows: StateData[] | null = null,
  selectedState: Option | null = null
) => {
  const filteredDataRows = getDataAfterStartDate(dataRows, START_DATE);

  // create state options
  const stateDataDict = filteredDataRows
    ? groupBy(filteredDataRows, (stateData) => stateData.state)
    : {};
  const stateOptions = createOptionsFromDataDict(stateDataDict);

  // Calculate data series for the US
  const {
    dateRowsUS,
    totalCasesRowsUS,
    newCasesRowsUS,
    totalDeathsRowsUS,
    newDeathRowsUS,
  } = calcDataForUS(filteredDataRows || []);

  const totalUSCasesChartData = makeChartData(
    "US",
    dateRowsUS,
    totalCasesRowsUS
  );
  const newUSCasesChartData = makeChartData("US", dateRowsUS, newCasesRowsUS);

  const totalUSDeathsChartData = makeChartData(
    "US",
    dateRowsUS,
    totalDeathsRowsUS
  );
  const newUSDeathsChartData = makeChartData("US", dateRowsUS, newDeathRowsUS);

  // calculate data series for all states
  const selectedStateDataRows = selectedState
    ? stateDataDict[selectedState.value]
    : [];

  const {
    dateRows,
    totalCasesRows,
    newCasesRows,
    totalDeathsRows,
    newDeathsRows,
  } = processCaseDataRows(selectedStateDataRows);

  const totalCasesForStateChartData = makeChartData(
    selectedState?.value,
    dateRows,
    totalCasesRows
  );
  const newCasesForStateChartData = makeChartData(
    selectedState?.value,
    dateRows,
    newCasesRows
  );
  const totalDeathsForStateChartData = makeChartData(
    selectedState?.value,
    dateRows,
    totalDeathsRows
  );
  const newDeathsForStateChartData = makeChartData(
    selectedState?.value,
    dateRows,
    newDeathsRows
  );

  return {
    stateOptions,
    totalUSCasesChartData,
    newUSCasesChartData,
    totalUSDeathsChartData,
    newUSDeathsChartData,
    totalCasesForStateChartData,
    newCasesForStateChartData,
    totalDeathsForStateChartData,
    newDeathsForStateChartData,
  };
};
