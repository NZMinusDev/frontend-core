/**
 * Callback function for Array<number>.prototype.sort()
 */
const ascending = (a: number, b: number) => a - b;

/**
 * Check even or not the number
 * @param number any number
 * @returns true if event false otherwise
 */
const isEven = (number: number) => number % 2 === 0;

/**
 * Callback function for Array<string>.prototype.sort()
 */
const compareLocaleString = (a: string, b: string) => {
  a.normalize();
  b.normalize();

  return a.localeCompare(b);
};

/**
 * Replacement or str.slice() cause of surrogate couples support.
 */
const slice = (str: string, start: number, end: number) =>
  Array.from(str).slice(start, end).join('');

export { ascending, isEven, compareLocaleString, slice };
