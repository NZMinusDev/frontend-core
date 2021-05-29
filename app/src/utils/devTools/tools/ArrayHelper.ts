/**
 * Adds missing and removes extra elements
 */
const fixLength = <TArray extends unknown[]>(
  arr: TArray,
  desiredLength: number,
  filler: TArray[number]
) => {
  const previousLength = arr.length;
  if (arr.length !== desiredLength) {
    // eslint-disable-next-line no-param-reassign
    arr.length = desiredLength;
    // eslint-disable-next-line no-param-reassign
    arr = arr.fill(filler, previousLength);
  }
};

// eslint-disable-next-line import/prefer-default-export
export { fixLength };
