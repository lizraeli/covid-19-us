import { useMemo } from "react";
import groupBy from "lodash/groupBy";

import { ParseStatus, START_DATE } from "../../constants";
import { createOptionsFromDataDict, getDataAfterStartDate } from "./utils";
import { makeChartData, defaultChartData } from "../../utils/chart";
import { useAsyncMemo } from "../useAsyncMemo";
import CalcDataWorker from "./worker";

import type { ParseState, Option, StateData } from "../../types";

const worker = new CalcDataWorker();

export const useProcessedStateData = (
  stateDataParseState: ParseState<StateData>,
  selectedState: Option | null
) => {
  const dataRows = useMemo(
    () =>
      stateDataParseState.status === ParseStatus.SUCCESS
        ? stateDataParseState.data
        : [],
    [stateDataParseState]
  );

  const filteredDataRows = useMemo(
    () => getDataAfterStartDate(dataRows, START_DATE),
    [dataRows]
  );

  // create state options
  const { stateDataDict, stateOptions } = useMemo(() => {
    const stateDataDict = groupBy(
      filteredDataRows,
      (stateData) => stateData.state
    );
    const stateOptions = createOptionsFromDataDict(stateDataDict);

    return { stateDataDict, stateOptions };
  }, [filteredDataRows]);

  // calculate data series for all states
  const [chartData, isLoading] = useAsyncMemo(
    async () => {
      const selectedStateDataRows = selectedState
        ? stateDataDict[selectedState.value]
        : [];

      const {
        dateRows,
        totalCasesRows,
        newCasesRows,
        totalDeathsRows,
        newDeathsRows,
      } = await worker.processCaseDataRows(selectedStateDataRows);

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
        newDeathsForStateChartData,
      };
    },
    [selectedState, stateDataDict],
    {
      totalCasesForStateChartData: defaultChartData,
      newCasesForStateChartData: defaultChartData,
      totalDeathsForStateChartData: defaultChartData,
      newDeathsForStateChartData: defaultChartData,
    }
  );

  return {
    isLoading,
    stateOptions,
    ...chartData,
  };
};

export type ProccessedStateData = ReturnType<typeof useProcessedStateData>;
