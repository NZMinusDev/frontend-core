const getKeyByMapValue = <K, V>(map: Map<K, V>, value: V) => {
  const result = [...map].find(([key, val]) => val === value);

  if (result === undefined) {
    return undefined;
  }

  return result[0];
};

// eslint-disable-next-line import/prefer-default-export
export { getKeyByMapValue };
