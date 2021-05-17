import { ParseStatus } from "../constants";
import type { ParseState } from "../types";

export const getErrorFromParseStates = (...parseStates: ParseState<any>[]) => {
  // const parseStateWithError = parseStates.find(parseState => parseState.status === ParseStatus.ERROR)
  for (const parseState of parseStates) {
    if (parseState.status === ParseStatus.ERROR) {
      return parseState.error;
    }
  }

  return null;
};

export const isAnyParseStateActive = (...parseStates: ParseState<any>[]) => {
  return parseStates.some(isParseStateActive);
};

export const isParseStateActive = (parseState: ParseState<any>) => {
  return [ParseStatus.PARSING, ParseStatus.UNDEFINED].includes(
    parseState.status
  );
};
