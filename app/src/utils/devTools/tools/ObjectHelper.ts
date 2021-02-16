/**
 *
 * @param object - mapped object
 * @param mapFn - key changer
 * @returns a new object with the keys mapped using mapFn(key)
 */
export function keyMap(object: object, mapFn: (key: string) => string) {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [mapFn(key), value]));
}

/**
 *
 * @param o
 * @param propertyNames
 * @example
 * interface Car {
 *   manufacturer: string;
 *   model: string;
 *   year: number;
 * }
 *
 * let taxi: Car = {
 *   manufacturer: "Toyota",
 *   model: "Camry",
 *   year: 2014,
 * };
 *
 * // Manufacturer and model are both of type string,
 * // so we can pluck them both into a typed string array
 * let makeAndModel: string[] = pluck(taxi, ["manufacturer", "model"]);
 *
 * // If we try to pluck model and year, we get an
 * // array of a union type: (string | number)[]
 * let modelYear = pluck(taxi, ["model", "year"]);
 */
export function pluck<T, K extends keyof T>(object: T, propertyNames: K[]): T[K][] {
  return propertyNames.map((propertyName) => object[propertyName]);
}
