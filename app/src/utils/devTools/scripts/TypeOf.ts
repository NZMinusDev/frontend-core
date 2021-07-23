/**
 * typeof on steroids reads [Symbol.toStringTag] for more controlled result of comparison
 * @param obj - any value
 * @returns type
 * @example
 * console.log(TypeOf(123)) // Number
 * console.log(TypeOf(null)) // Null
 * console.log(TypeOf(undefined)) // Undefined
 * console.log(TypeOf([])) // Array
 * console.log(TypeOf(alert)) // Function
 * console.log(TypeOf(window)) // Window
 * console.log(new XMLHttpRequest()) // XMLHttpRequest
 *
 * let user = {};
 * console.log(user) // Object
 * user = { [Symbol.toStringTag]: "User" };
 * console.log(user) // User
 */
const TypeOf = (obj: unknown): string => {
  const type = Object.prototype.toString.call(obj);

  return type.slice(type.indexOf(' ') + 1, type.indexOf(']'));
};

/**
 * Identify whether the value is a reference
 * @param any A value
 * @returns true if value is Reference, false otherwise
 */
const isReferenceType = (any: unknown) => any instanceof Object;

export { TypeOf as default, isReferenceType };
