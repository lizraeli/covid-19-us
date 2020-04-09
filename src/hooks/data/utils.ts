import moment from "moment";

import type { CaseData, DataDict } from "../../types";

export const getDataAfterStartDate = <T extends CaseData>(
  dataRows: T[] | null,
  startDate: string
) => {
  const momentStartDate = moment(startDate);
  return dataRows?.filter((data) => moment(data.date).isAfter(momentStartDate));
};

export const createOptionsFromDataDict = <T extends CaseData>(
  dataDict: DataDict<T> | null
) => {
  const keys = dataDict ? Object.keys(dataDict) : [];
  const options = keys.map((key: string) => ({ value: key, label: key }));

  return options;
};

export const calcNewCases = (dataRows: CaseData[]) => {
  return dataRows.map((data, index) => {
    const isFirstElement = index === 0;
    const prevCases = isFirstElement ? 0 : dataRows[index - 1].cases;
    const newCases = data.cases - prevCases;

    return newCases;
  });
};

export const mapSelectedRows = (selectedDataRows: CaseData[]) => {
  const dateRows = selectedDataRows.map((data) => data.date);
  const casesRows = selectedDataRows.map((stateData) => stateData.cases);
  const newCasesRows = calcNewCases(selectedDataRows);

  return {
    dateRows,
    casesRows,
    newCasesRows,
  };
};

export const makeChartData = (
  name: string = "chart",
  categories: string[],
  data: number[]
) => {
  return {
    options: {
      chart: {
        id: "basic-bar",
        width: "50%",
        height: 380,
        type: "bar",
      },
      xaxis: {
        categories,
      },
      dataLabels: {
        enabled: false,
      },
      colors: [
        function ({
          value,
          seriesIndex,
          w,
        }: {
          value: number;
          seriesIndex: number;
          w: number;
        }) {
          if (value < 55) {
            return "#7E36AF";
          } else {
            return "#D9534F";
          }
        },
        function ({ value }: { value: number }) {
          //   if (value < 55) {
          //     return "#7E36AF";
          //   } else {
          //     return "#D9534F";
          //   }
          return "FFFFFF";
        },
      ],
    },
    series: [
      {
        name,
        data,
      },
    ],
  };
};
