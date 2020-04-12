import type { ApexOptions } from "apexcharts";

export const getNumberWithCommas = (num: number) => {
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

interface ApexSeries {
  name: string;
  data: number[];
}
interface ApexChartData {
  options: ApexOptions;
  series: ApexSeries[];
}

export const makeChartData = (
  name: string = "US",
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
