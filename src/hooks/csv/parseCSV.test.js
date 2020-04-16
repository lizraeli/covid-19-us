import { renderHook, act } from "@testing-library/react-hooks";
import { ParseStatus } from "../../constants";
import ParseCSV from "papaparse";
import { useParseCSV } from "./parseCSV";

const url = "some-url";

describe("test useParseSCV", () => {
  const mockParse = jest.spyOn(ParseCSV, "parse");

  beforeEach(() => {
    mockParse.mockClear();
  })

  test("initial parseState parseState ", async () => {
    const { result } = renderHook(() => useParseCSV(url));
    expect(result.current.parseState).toEqual({
      status: ParseStatus.UNDEFINED
    });
  });

  test("parseState on parse complete ", async () => {
    const parseResult = {
      errors: [],
      data: ["some-data"],
    };
    mockParse.mockImplementation((_, options) => {
      setTimeout(() => {
        options.complete(parseResult);
      }, 0);
    });

    const { result, waitForNextUpdate } = renderHook(() => useParseCSV(url));

    act(() => {
      result.current.fetchAndParseData();
    });

    expect(result.current.parseState).toEqual({
      status: ParseStatus.PARSING
    });

    await waitForNextUpdate();
    expect(result.current.parseState).toEqual({
      status: ParseStatus.SUCCESS,
      data: parseResult.data,
    });
  });


  test("parseState on parse complete with errors and data", async () => {
    const parseResult = {
      errors: ["error"],
      data: ["some data"],
    };

    mockParse.mockImplementation((_, options) => {
      setTimeout(() => {
        options.complete(parseResult);
      }, 0);
    });

    const { result, waitForNextUpdate } = renderHook(() => useParseCSV(url));

    act(() => {
      result.current.fetchAndParseData();
    });

    expect(result.current.parseState).toEqual({
      status: ParseStatus.PARSING
    });

    await waitForNextUpdate();
    expect(result.current.parseState).toEqual({
      status: ParseStatus.SUCCESS,
      data: parseResult.data,
    });
  });

  test("parseState on parse complete with errors and no data", async () => {
    const parseResult = {
      errors: ["error"],
      data: [],
    };

    mockParse.mockImplementation((_, options) => {
      setTimeout(() => {
        options.complete(parseResult);
      }, 0);
    });

    const { result, waitForNextUpdate } = renderHook(() => useParseCSV(url));

    act(() => {
      result.current.fetchAndParseData();
    });

    expect(result.current.parseState).toEqual({
      status: ParseStatus.PARSING
    });

    await waitForNextUpdate();
    expect(result.current.parseState).toEqual({
      status: ParseStatus.ERROR,
      error: "Error parsing data",
    });
  });

  test("parseState on error", async () => {
    const parseError = {
      message: "something went wrong"
    };

    mockParse.mockImplementation((_, options) => {
      setTimeout(() => {
        options.error(parseError);
      }, 0);
    });

    const { result, waitForNextUpdate } = renderHook(() => useParseCSV(url));

    act(() => {
      result.current.fetchAndParseData();
    });

    expect(result.current.parseState).toEqual({
      status: ParseStatus.PARSING
    });

    await waitForNextUpdate();
    expect(result.current.parseState).toEqual({
      status: ParseStatus.ERROR,
      error: parseError.message,
    });
  });
});
