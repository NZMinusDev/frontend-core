/**
 * @returns milliseconds
 */
const diffDate = (date1: Date, date2: Date) => date2.getTime() - date1.getTime();

// eslint-disable-next-line import/prefer-default-export
export { diffDate };
