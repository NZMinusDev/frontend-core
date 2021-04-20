import { GenericFunc } from "./TypingHelper";

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
export function curry(func: (...args: unknown[]) => unknown) {
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

/**
 * Clone function
 * @param func function to clone
 * @returns clone of function
 * @example
 * const test1 =  function(a,b,c) {
 *   return a+b+c;
 * };
 *
 * console.log(test1 === cloneFunction(test1)); // false
 * console.log(test1(1,1,1) === cloneFunction(test1)(1,1,1)); // true
 * console.log(cloneFunction(test1)(1,1,1)); // 3
 */
export function cloneFunction<TFuncArgs extends unknown[], TFuncReturn>(
  func: GenericFunc<TFuncArgs, TFuncReturn> | any
) {
  const that = func;
  const temp = function () {
    return that.apply(func, (arguments as unknown) as TFuncArgs);
  };

  for (let key in func) {
    if (func.hasOwnProperty(key)) {
      temp[key] = func[key];
    }
  }

  Object.defineProperty(temp, "name", { value: func.name });

  return temp;
}
