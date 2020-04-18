import { useMemo } from "react";

import { ParseStatus, START_DATE } from "../../constants";
import {
  getDataAfterStartDate,
  processCaseDataRows,
} from "./utils";
import { makeChartData } from "../../utils/chart";

import type { ParseState, USData } from "../../types";

const US_LABEL = "US";

export const useProcessedUSData = (
  USDataParseState: ParseState<USData>
) => {
  const dataRows =
    USDataParseState.status === ParseStatus.SUCCESS
      ? USDataParseState.data
      : null;

  const filteredDataRows = useMemo(
    () => getDataAfterStartDate(dataRows, START_DATE),
    [dataRows]
  );

  // calculate data series 
  const {
    totalCasesForUSChartData,
    newCasesForUSChartData,
    totalDeathsForUSChartData,
    newDeathsForUSChartData,
  } = useMemo(() => {
    const {
      dateRows,
      totalCasesRows,
      newCasesRows,
      totalDeathsRows,
      newDeathsRows,
    } = processCaseDataRows(filteredDataRows || []);

    const totalCasesForUSChartData = makeChartData(
      US_LABEL,
      dateRows,
      totalCasesRows
    );
    const newCasesForUSChartData = makeChartData(
      US_LABEL,
      dateRows,
      newCasesRows
    );
    const totalDeathsForUSChartData = makeChartData(
      US_LABEL,
      dateRows,
      totalDeathsRows
    );
    const newDeathsForUSChartData = makeChartData(
      US_LABEL,
      dateRows,
      newDeathsRows
    );

    return {
      totalCasesForUSChartData,
      newCasesForUSChartData,
      totalDeathsForUSChartData,
      newDeathsForUSChartData,
    };
  }, [filteredDataRows]);

  return {
    totalCasesForUSChartData,
    newCasesForUSChartData,
    totalDeathsForUSChartData,
    newDeathsForUSChartData,
  };
};

export type ProccessedUSData = ReturnType<typeof useProcessedUSData>;