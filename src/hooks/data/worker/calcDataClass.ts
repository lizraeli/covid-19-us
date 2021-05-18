import * as methods from "./calcData";

/**
 * This class is for testing purposes with jest.
 * Jest will not create worker threads so these are faked. 
 */
function CalcData() {}

Object.entries(methods).forEach(([key, val]) => {
  const fn = val as any;
  CalcData.prototype[key] = fn
});

export default CalcData;
