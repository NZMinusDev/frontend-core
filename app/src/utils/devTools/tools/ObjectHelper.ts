// returns a new object with the keys mapped using mapFn(key)
export function keyMap(object, mapFn) {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [mapFn(key), value]));
}
