import type { ApexOptions } from "apexcharts";

export const getNumberWithCommas = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatDate = (value: string) => {
  return value.replace("2020-", "").replace("-", "/");
};

const axisOptions: ApexOptions = {
  xaxis: {
    labels: {
      rotate: -45,
      rotateAlways: true,
      formatter: formatDate,
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

interface ApexSeries {
  name: string;
  data: number[];
}
interface ApexChartData {
  options: ApexOptions;
  series: ApexSeries[];
}

export const makeChartData = (
  name: string = "",
  categories: string[],
  data: number[]
): ApexChartData => {
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
