import { useMemo } from "react";
import groupBy from "lodash/groupBy";

import { ParseStatus, START_DATE } from "../../constants";
import {
  calcDataForUS,
  createOptionsFromDataDict,
  getDataAfterStartDate,
  processCaseDataRows,
} from "./utils";
import { makeChartData } from "../../utils/chart";

import type { ParseState, Option, StateData } from "../../types";

export const useProcessedStateData = (
  stateDataParseState: ParseState<StateData>,
  selectedState: Option | null
) => {
  const dataRows =
    stateDataParseState.status === ParseStatus.SUCCESS
      ? stateDataParseState.data
      : null;

  const filteredDataRows = useMemo(
    () => getDataAfterStartDate(dataRows, START_DATE),
    [dataRows]
  );

  // create state options
  const { stateDataDict, stateOptions } = useMemo(() => {
    const stateDataDict = filteredDataRows
      ? groupBy(filteredDataRows, (stateData) => stateData.state)
      : {};
    const stateOptions = createOptionsFromDataDict(stateDataDict);

    return { stateDataDict, stateOptions };
  }, [filteredDataRows]);

  // Calculate data series for the US
  const {
    totalUSCasesChartData,
    newUSCasesChartData,
    totalUSDeathsChartData,
    newUSDeathsChartData,
  } = useMemo(() => {
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
    const newUSDeathsChartData = makeChartData(
      "US",
      dateRowsUS,
      newDeathRowsUS
    );

    return {
      totalUSCasesChartData,
      newUSCasesChartData,
      totalUSDeathsChartData,
      newUSDeathsChartData,
    };
  }, [filteredDataRows]);

  // calculate data series for all states
  const {
    totalCasesForStateChartData,
    newCasesForStateChartData,
    totalDeathsForStateChartData,
    newDeathsForStateChartData
  } = useMemo(() => {
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
      totalCasesForStateChartData,
      newCasesForStateChartData,
      totalDeathsForStateChartData,
      newDeathsForStateChartData
    };
  }, [selectedState, stateDataDict]);

  return {
    stateOptions,
    totalUSCasesChartData,
    newUSCasesChartData,
    totalUSDeathsChartData,
    newUSDeathsChartData,
    totalCasesForStateChartData,
    newCasesForStateChartData,
    totalDeathsForStateChartData,
    newDeathsForStateChartData
  };
};
