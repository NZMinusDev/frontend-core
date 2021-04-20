export const MS_IN_DAY = 1000 * 60 * 60 * 24;

/**
 * @returns milliseconds
 */
export function diffDate(date1: Date, date2: Date) {
  return date2.getTime() - date1.getTime();
}
