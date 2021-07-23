/**
 * Get file path without extension and extension separately
 * @param fullPath - path to file
 * @returns file path without extension and file extension parts, comma non included
 */
const parseFileExtension = (fullPath: string) => {
  const filePath = fullPath.substring(0, fullPath.lastIndexOf('.')) || fullPath;
  const fileExt = fullPath.substring(fullPath.lastIndexOf('.') + 1, fullPath.length) || fullPath;

  return { filePath, fileExt };
};

/**
 * Converts a string to an integer by collapse numbers
 * @param str - A string to convert into a number
 * @returns integer number
 */
const collapsingParseInt = (str: string, radix = 10): number =>
  Number(parseInt(str.replace(/[^0-9]-./g, ''), radix).toFixed(0));

/**
 * Converts a string to a floating-point number by collapse numbers
 * @param str A string that contains a floating-point number
 * @param precision - amount of digits after the decimal point, must be in the range 0 - 20, inclusive
 * @returns
 */
const collapsingParseFloat = (str: string, precision = 2): number =>
  Number(Number(str.replace(/[^0-9-.]/g, '')).toFixed(precision));

/**
 * Get amount of digits after the decimal point
 * @param number A number
 * @returns amount of digits after the decimal point
 */
const getPrecision = (number: number) =>
  number.toString().includes('.') ? number.toString().split('.').pop()!.length : 0;

export { parseFileExtension, collapsingParseInt, collapsingParseFloat, getPrecision };
