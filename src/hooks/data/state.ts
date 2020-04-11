import { useMemo } from "react";
import groupBy from "lodash/groupBy";

import { ParseStatus, START_DATE } from "../../constants";
import {
  calcDataForUS,
  createOptionsFromDataDict,
  getDataAfterStartDate,
  mapCaseDataRows,
  makeChartData,
} from "./utils";

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

  const { totalUSCasesChartData, newUSCasesChartData } = useMemo(() => {
    const { dateRowsUS, totalUSCasesRows, newUSCasesRows } = calcDataForUS(
      filteredDataRows || []
    );
    const totalUSCasesChartData = makeChartData("US", dateRowsUS, totalUSCasesRows);
    const newUSCasesChartData = makeChartData("US", dateRowsUS, newUSCasesRows);

    return { totalUSCasesChartData, newUSCasesChartData };
  }, [filteredDataRows]);

  const { stateDataDict, stateOptions } = useMemo(() => {
    const stateDataDict = filteredDataRows
      ? groupBy(filteredDataRows, (stateData) => stateData.state)
      : {};
    const stateOptions = createOptionsFromDataDict(stateDataDict);

    return { stateDataDict, stateOptions };
  }, [filteredDataRows]);

  const {
    totalCasesForStateChartData,
    newCasesForStateChartData,
  } = useMemo(() => {
    const selectedStateDataRows = selectedState
      ? stateDataDict[selectedState.value]
      : [];
    const { dateRows, casesRows, newCasesRows } = mapCaseDataRows(
      selectedStateDataRows
    );
    const totalCasesForStateChartData = makeChartData(
      selectedState?.value,
      dateRows,
      casesRows
    );
    const newCasesForStateChartData = makeChartData(
      selectedState?.value,
      dateRows,
      newCasesRows
    );

    return {
      totalCasesForStateChartData,
      newCasesForStateChartData,
    };
  }, [selectedState, stateDataDict]);

  return {
    stateOptions,
    totalUSCasesChartData,
    newUSCasesChartData,
    totalCasesForStateChartData,
    newCasesForStateChartData,
  };
};
