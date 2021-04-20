/**
 * Callback function for Array<number>.prototype.sort()
 */
export function ascending(a: number, b: number) {
  return a - b;
}
/**
 * Check even or not the number
 * @param number any number
 * @returns true if event false otherwise
 */
export function isEven(number: number) {
  return number % 2 == 0 ? true : false;
}

/**
 * Callback function for Array<string>.prototype.sort()
 */
export function compareLocaleString(a: string, b: string) {
  a.normalize();
  b.normalize();

  return a.localeCompare(b);
}
/**
 * Replacement or str.slice() cause of surrogate couples support.
 */
export function slice(str: string, start: number, end: number) {
  return Array.from(str).slice(start, end).join("");
}
