import * as methods from "./csv";

/**
 * This class is for testing purposes with jest.
 * Jest will not create worker threads so these are faked.
 */
function CalcCSV() {}

Object.entries(methods).forEach(([key, val]) => {
  const fn = val as any;
  CalcCSV.prototype[key] = fn;
});

export default CalcCSV;
