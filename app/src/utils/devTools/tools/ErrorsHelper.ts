export class MyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ErrorWrapper extends Error {
  public cause: Error;

  constructor(message: string, cause: Error) {
    super(message);
    this.cause = cause;
    this.name = "ReadError";
  }
}

/**
 * 
 * @example
 * type NetworkLoadingState = { state: "loading"; };
 * type NetworkFailedState = { state: "failed"; code: number; };
 * type NetworkSuccessState = {
 *   state: "success";
 *   response: {
 *    title: string;
 *    duration: number;
 *    summary: string;
 *   };
 * };
 * 
 * // Create a type which represents only one of the above types
 * // but you aren't sure which it is yet.
 * type NetworkState =
 *   | NetworkLoadingState
 *   | NetworkFailedState
 *   | NetworkSuccessState;
 * 
 * function logger(state: NetworkState): string {
 *   // Right now TypeScript does not know which of the three
 *   // potential types state could be.
 *   // Trying to access a property which isn't shared
 *   // across all types will raise an error
 *   state.code;
 *   // By switching on state, TypeScript can narrow the union
 *   // down in code flow analysis
 *   switch (state.state) {
 *     case "loading":
 *       return "Downloading...";
 *     case "failed":
 *       // The type must be NetworkFailedState here,
 *       // so accessing the `code` field is safe
 *       return `Error ${state.code} downloading`;
 *     case "success":
 *       return `Downloaded ${state.response.title} - ${state.response.summary}`;
 *     default:
 *       return assertNever(s);
 *   }
 * }
 */
export function assertNever(valueToCheck: never): never {
  throw new Error("Unexpected object: " + valueToCheck);
}