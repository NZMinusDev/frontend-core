/*
 * //TODO: Apply for functions, Tip: do not forget change T variables on some readable variables
 *type Proxy<T> = {
 *  get(): T;
 *  set(value: T): void;
 *};
 *
 *type Proxify<T> = {
 *  [P in keyof T]: Proxy<T[P]>;
 *};
 *
 *function proxify<T>(object: T): Proxify<T> {
 *  // ... wrap proxies ...
 *}
 *
 *let props = { rooms: 4 };
 *let proxyProps = proxify(props);
 *
 *function unproxify<T>(t: Proxify<T>): T {
 *  let result = {} as T;
 *  for (const k in t) {
 *    result[k] = t[k].get();
 *  }
 *  return result;
 *}
 *
 *let originalProps = unproxify(proxyProps);
 */

/**
 *
 * @param target - proxy target
 * @returns proxy where undefined fields returns the field instead undefined
 * @example
 * let dictionary = {'Hello': 'Hola','Bye': 'Adiós'};
 * dictionary = makeProxyDictionary(dictionary);
 * alert( dictionary['Hello'] ); // Hola
 * alert( dictionary['Welcome to Proxy']); // Welcome to Proxy
 */
// eslint-disable-next-line @typescript-eslint/ban-types
const makeProxyDictionary = (target: object) =>
  new Proxy(target, {
    // eslint-disable-next-line no-shadow
    get(target, phrase) {
      // перехватываем чтение свойства в dictionary
      if (phrase in target) {
        // если перевод для фразы есть в словаре, возвращаем его
        return target[phrase];
      }

      // иначе возвращаем непереведённую фразу
      return phrase;
    },
  });

/**
 *
 * @param target - proxy target
 * @returns proxy for which the operator "in" works like inRange tester
 * @example
 * let range = { start: 1, end: 10, };
 * alert(5 in range); // true
 * alert(50 in range); // false
 */
const makeProxyInRange = (target: { start: number; end: number }) =>
  new Proxy(target, {
    // eslint-disable-next-line no-shadow
    has(target, propertyName) {
      return target[propertyName] >= target.start && target[propertyName] <= target.end;
    },
  });

/**
 * Hide "private" _fields; be sure that you know what you are doing: confusion is possible where the original object is, and where is the proxied one when transferring objects somewhere else and with multiple proxying; use it only if you really need inherit fields, otherwise see private js fields: #field
 * @param target - proxy target
 * @returns proxy where "private" _fields is hided
 * @example
 * let user = { name: "Mike", age: 30, _password: "***" };
 * user = makeOOPObject(user);
 * for(let key in user) alert(key); // name and age without _password
 * alert( Object.keys(user) ); // name,age
 * alert( Object.values(user) ); // Mike,30
 * try {
 *   alert(user._password); // Error: Access denied
 * } catch(e) { alert(e.message); }
 * try {
 *   user._password = "test"; // Error: Access denied
 * } catch(e) { alert(e.message); }
 * try {
 *   delete user._password; // Error: Access denied
 * } catch(e) { alert(e.message); }
 */
// eslint-disable-next-line @typescript-eslint/ban-types
const makeOOPObject = (target: object) =>
  new Proxy(target, {
    // eslint-disable-next-line no-shadow
    get(target, propertyName) {
      if (propertyName.toString().startsWith('_')) {
        // eslint-disable-next-line sonarjs/no-duplicate-string
        throw new Error('Отказано в доступе');
      } else {
        const value = target[propertyName];

        // method of the object itself, must have access to the property
        return typeof value === 'function' ? value.bind(target) : value;
      }
    },
    // eslint-disable-next-line no-shadow
    set(target, propertyName, val: unknown) {
      // intercept the property record
      if (propertyName.toString().startsWith('_')) {
        throw new Error('Отказано в доступе');
      } else {
        // eslint-disable-next-line no-param-reassign
        target[propertyName] = val;

        return true;
      }
    },
    // eslint-disable-next-line no-shadow
    deleteProperty(target, propertyName) {
      // intercept property deletion
      if (propertyName.toString().startsWith('_')) {
        throw new Error('Отказано в доступе');
      } else {
        // eslint-disable-next-line no-param-reassign
        delete target[propertyName];

        return true;
      }
    },
    // eslint-disable-next-line no-shadow
    ownKeys(target) {
      // intercept the iteration attempt
      return Object.keys(target).filter((key) => !key.startsWith('_'));
    },
  });

export { makeProxyDictionary, makeProxyInRange, makeOOPObject };
