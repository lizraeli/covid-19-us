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
  return parseStates.some(
    (parseState) => parseState.status === ParseStatus.ACTIVE
  );
};
