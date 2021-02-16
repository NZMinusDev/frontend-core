/**
 * Callback function for Array<number>.prototype.sort()
 */
export function compareNumeric(a: number, b: number) {
  return a - b;
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
export function slice(str:string, start:number, end:number) {
  return Array.from(str).slice(start, end).join('');
}