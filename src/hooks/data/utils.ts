import moment from "moment";
import groupBy from "lodash/groupBy";

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

export const mapCaseDataRows = (dataRows: CaseData[]) => {
  const dateRows = dataRows.map((data) => data.date);
  const casesRows = dataRows.map((stateData) => stateData.cases);
  const newCasesRows = calcNewCases(dataRows);

  return {
    dateRows,
    casesRows,
    newCasesRows,
  };
};

export const calcDataForUS = (dataRows: CaseData[]) => {
  const dateDataDict = dataRows ? groupBy(dataRows, (data) => data.date) : {};

  const dateRowsUS = Object.keys(dateDataDict);
  const totalUSCasesRows = Object.values(dateDataDict).map((caseDataRows) =>
    caseDataRows.reduce((cases, data) => cases + data.cases, 0)
  );

  const newUSCasesRows = totalUSCasesRows.map((cases, index) => {
    const isFirstElement = index === 0;
    const prevCases = isFirstElement ? 0 : totalUSCasesRows[index - 1];
    const newCases = cases - prevCases;

    return newCases;
  });

  return { dateRowsUS, totalUSCasesRows, newUSCasesRows };
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
    },
  },
};

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
  name: string = "US",
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
