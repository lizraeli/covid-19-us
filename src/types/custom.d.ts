declare module "comlink-loader!./calcData" {
  interface CaseData {
    date: string;
    cases: number;
    deaths: number;
  }
  class CalcDataWorker extends Worker {
    constructor();

    getDataAfterStartDate: <T extends CaseData>(
      dataRows: T[],
      startDate: string
    ) => T[];
    calcNewCasesRows: (totalCasesRows: number[]) => Promise<number[]>;
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
