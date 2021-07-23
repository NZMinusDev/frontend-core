import { GenericFunc } from './TypingHelper';

/**
 * Currying of function
 * @param func
 * @example
 * function sum(a, b, c) {
 *  return a + b + c;
 *}
 *
 *let curriedSum = makeCurry(sum);
 *
 *alert( curriedSum(1, 2, 3) ); // 6
 *alert( curriedSum(1)(2,3) ); // 6
 *alert( curriedSum(1)(2)(3) ); // 6
 */
const makeCurry = (func: (...args: unknown[]) => unknown) =>
  function curried(...args: unknown[]) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    }

    // eslint-disable-next-line func-names
    return function (...args2: unknown[]) {
      return curried.apply(this, args.concat(args2));
    };
  };

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
const cloneFunction = <TFuncArgs extends unknown[], TFuncReturn>(
  func: GenericFunc<TFuncArgs, TFuncReturn>
) => {
  const that = func;

  // eslint-disable-next-line func-names
  const temp = function (...args: TFuncArgs) {
    return that.apply(func, args);
  };

  Object.keys(func).forEach((key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (func.hasOwnProperty(key)) {
      temp[key] = func[key];
    }
  });

  Object.defineProperty(temp, 'name', { value: func.name });

  return temp;
};

export { makeCurry, cloneFunction };
