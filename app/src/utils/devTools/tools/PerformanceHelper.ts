export interface BenchOptions<A extends unknown> {
  funcArgs?: A[];
  iterations?: number;
}
/**
 *
 * @param benchMarkingFunction - callback
 * @param funcArgs - callback args
 * @param iterations - amount of callback processing
 * @returns milliseconds
 * @example
 * // returns milliseconds
 * function diffDate(date1: Date, date2: Date) {
 *  return +date2 - +date1;
 * }
 *
 * const time = bench(diffDate); // process once with default parameters
 * bench(diffDate, { iterations: 200 }); // process once with optional parameter
 * bench(diffDate, { iterations: 400, funcArgs: [new Date(), new Date(24 * 60 * 60 * 1000)] }); //  process once with optional parameters (order doesn't matter)
 *
 * // process several times for more accurate results(you should process once before it)
 * for (let i = 0; i < 10; i++) time += bench(diffDate);
 */
export function bench<A extends unknown, R extends unknown>(
  benchMarkingFunction: (...funcArgs: A[]) => R,
  { funcArgs = [], iterations = 1 }: BenchOptions<A> = {}
) {
  let start = performance.now();
  for (let i = 0; i < iterations; i++) benchMarkingFunction(...funcArgs);
  return performance.now() - start;
}

/**
 *
 * @param func - heavy callback
 * @param hash - callback that creates a hash key by func arguments
 * @returns hashed result of func processing
 * @example
 *
 *let worker = {
 *  someMethod() {
 *    return 1;
 *  },
 *  slow(x:number, y:number):number {
 *
 *    // here heavy processing
 *
 *    return x + y + this.someMethod();
 *  },
 *};
 *
 *function hash(args:IArguments) {
 *  return [].join.call(args);// creates a key from a combination of arguments
 *}
 *
 *worker.slow = cachingDecorator(worker.slow, hash);
 *alert(worker.slow(3, 5)); // slow(3, 5) caching it
 *alert("Again: " + worker.slow(3, 5)); // returning from the cache
 */
export function cachingDecorator<FA extends unknown, FR extends unknown, HR extends unknown>(
  func: (...funcArgs: FA[]) => FR,
  hash: (funcArgs: IArguments) => HR
): (...funcArgs: FA[]) => FR {
  const cache = new Map();

  return function () {
    let key = hash(arguments);
    if (cache.has(key)) {
      return cache.get(key);
    }

    let result = func.apply(this, arguments as unknown as FA[]);

    cache.set(key, result);

    return result;
  };
}
const loadCachedCache = new Map();
/**
 *
 * @param url - url for getting data
 * @returns Promise<string> with resolved or cached data
 * @example
 * // wait all
 * let urls = [
 *  'https://api.github.com/users/iliakan',
 *  'https://api.github.com/users/remy',
 *  'https://no-such-url'
 * ];
 *
 * Promise.allSettled(urls.map(url => loadCached(url)))
 *  .then(results => {
 *    results.forEach((result, num) => {
 *      if (result.status == "fulfilled") {
 *        alert(`${urls[num]}: ${result.value.status}`);
 *      }
 *      if (result.status == "rejected") {
 *       alert(`${urls[num]}: ${result.reason}`);
 *      }
 *   });
 * });
 *
 * // wait the fastest
 * Promise.race(urls.map(url => loadCached(url))).then(alert);
 */
export function loadCached(url: string): Promise<string> {
  if (loadCachedCache.has(url)) {
    return Promise.resolve(loadCachedCache.get(url));
  }

  return fetch(url)
    .then((response) => response.text())
    .then((text) => {
      loadCachedCache.set(url, text);
      return text;
    });
}

/**
 * Memoize function to optimize the performance of recursive functions
 * @param memo - the original sequence array
 * @param formula - function of calculating
 * @returns a recursive function that manages the memo storage and calls the formula function as needed
 * @example
 * const fibonacci = memoizer([0, 1], function (recur, n) {
 *   return recur(n - 1) + recur(n - 2);
 * });
 *
 * const factorial = memoizer([1, 1], function (recur, n) {
 *   return n * recur(n - 1);
 * });
 */
export function memoizer(memo: number[], formula: (recursionCallback, n: number) => number) {
  function recursionCallback(n) {
    let result = memo[n];

    if (typeof result !== "number") {
      result = formula(recursionCallback, n);
      memo[n] = result;
    }

    return result;
  }
  return recursionCallback;
}
