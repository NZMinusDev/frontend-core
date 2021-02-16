/**
 * Currying of function
 * @param func
 * @example
 * function sum(a, b, c) {
 *  return a + b + c;
 *}
 *
 *let curriedSum = curry(sum);
 *
 *alert( curriedSum(1, 2, 3) ); // 6
 *alert( curriedSum(1)(2,3) ); // 6
 *alert( curriedSum(1)(2)(3) ); // 6
 */
export default function curry(func: (...args: unknown[]) => unknown) {
  return function curried(...args: unknown[]) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function (...args: unknown[]) {
        return curried.apply(this, args.concat(args));
      };
    }
  };
}


