import ParseCSV from "papaparse";


export const parse = (url: string): Promise<ParseCSV.ParseResult> => {
  return new Promise((resolve, reject) => {
    ParseCSV.parse(url, {
      download: true,
      worker: true,
      header: true,
      dynamicTyping: true,
      complete: (parseResult) => {
        resolve(parseResult);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
