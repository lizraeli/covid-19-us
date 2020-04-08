import { useMemo } from "react";
import groupBy from "lodash/groupBy";

import { ParseStatus } from "../../constants";
import {
  createOptionsFromDataDict,
  getDataAfterStartDate,
  mapSelectedRows,
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

  const { stateDataDict, stateOptions } = useMemo(() => {
    const filteredDataRows = getDataAfterStartDate(dataRows);
    const stateDataDict = filteredDataRows
      ? groupBy(filteredDataRows, (stateData) => stateData.state)
      : {};

    const stateOptions = createOptionsFromDataDict(stateDataDict);
    return { stateDataDict, stateOptions };
  }, [dataRows]);

  const { totalCasesChartData, newCasesChartData } = useMemo(() => {
    const selectedStateDataRows = selectedState
      ? stateDataDict[selectedState.value]
      : [];
    const { dateRows, casesRows, newCasesRows } = mapSelectedRows(
      selectedStateDataRows
    );
    const totalCasesChartData = makeChartData(
      selectedState?.value,
      dateRows,
      casesRows
    );
    const newCasesChartData = makeChartData(
      selectedState?.value,
      dateRows,
      newCasesRows
    );
    return {
      totalCasesChartData,
      newCasesChartData,
    };
  }, [selectedState, stateDataDict]);

  return {
    stateOptions,
    totalCasesChartData,
    newCasesChartData,
  };
};
