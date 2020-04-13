import { getNumberWithCommas, formatDate } from "./chart";

describe("getNumberWithCommas", () => {
  test("number with 3 digits", () => {
    expect(getNumberWithCommas(123)).toEqual("123");
  });
  test("number with 6 digits", () => {
    expect(getNumberWithCommas(123456)).toEqual("123,456");
  });
  test("number with 9 digits", () => {
    expect(getNumberWithCommas(123456789)).toEqual("123,456,789");
  });
});

describe("formatDate", () => {
  test("removes the years and replaces dashes with backslashes ", () => {
    expect(formatDate("2020-03-12")).toEqual("03/12");
  });
});
