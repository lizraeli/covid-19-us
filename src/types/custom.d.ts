declare module "comlink-loader!./calcData" {
  interface CaseData {
    date: string;
    cases: number;
    deaths: number;
  }

  type DataDict<T extends CaseData> = Record<string, T[]>;

  class CalcDataWorker extends Worker {
    constructor();

    calcNewCasesRows: (totalCasesRows: number[]) => Promise<number[]>;
    createOptionsFromDataDict: <T extends CaseData>(
      dataDict: DataDict<T>
    ) => Promise<
      {
        value: string;
        label: string;
      }[]
    >;
    processCaseDataRows: (caseDataRows: CaseData[]) => Promise<{
      dateRows: string[];
      totalCasesRows: number[];
      newCasesRows: number[];
      totalDeathsRows: number[];
      newDeathsRows: number[];
    }>;
  }

  export = CalcDataWorker;
}

declare module "comlink-loader!./csv" {
  import { ParseResult } from "papaparse";

  class CSVWorker extends Worker {
    constructor();

    parse(url: string): Promise<ParseResult>;
  }

  export = CSVWorker;
}
