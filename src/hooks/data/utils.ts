import moment from "moment";

import type { CaseData, DataDict } from "../../types";
import type { ApexOptions } from "apexcharts";

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

const getNumberWithCommas = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const axisOptions: ApexOptions = {
  xaxis: {
    labels: {
      rotate: -45,
      rotateAlways: true,
      formatter: function (value: string) {
        return value.replace("2020-", "").replace("-", "/");
      },
    }
  },
}

const chartOptions: ApexOptions = {
  chart: {
    id: "basic-bar",
  },
  
  dataLabels: {
    formatter: getNumberWithCommas,
    textAnchor: "end",
    offsetY: 20,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "80%",
      dataLabels: {
        position: "bottom",
        maxItems: 100,
        hideOverflowingLabels: true,
        orientation: "vertical",
      },
      colors: {
        ranges: [
          {
            from: 0,
            to: Infinity,
            color: "#D9534F",
          },
        ],
      },
    },
  },
};

export const makeChartData = (
  name: string = "chart",
  categories: string[],
  data: number[]
) => {
  return {
    options: {
      ...chartOptions,
      xaxis: {
        ...axisOptions.xaxis,
        categories,
      },
    },
    series: [
      {
        name,
        data,
      },
    ],
  };
};
