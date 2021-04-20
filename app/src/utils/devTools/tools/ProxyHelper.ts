/*
  //TODO: Apply for functions, Tip: do not forget change T variables on some readable variables
  type Proxy<T> = {
    get(): T;
    set(value: T): void;
  };

  type Proxify<T> = {
    [P in keyof T]: Proxy<T[P]>;
  };

  function proxify<T>(object: T): Proxify<T> {
    // ... wrap proxies ...
  }

  let props = { rooms: 4 };
  let proxyProps = proxify(props);

  function unproxify<T>(t: Proxify<T>): T {
    let result = {} as T;
    for (const k in t) {
      result[k] = t[k].get();
    }
    return result;
  }

  let originalProps = unproxify(proxyProps);
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
export function makeProxyDictionary(target: object) {
  return new Proxy(target, {
    get(target, phrase) {
      // перехватываем чтение свойства в dictionary
      if (phrase in target) {
        // если перевод для фразы есть в словаре
        return target[phrase]; // возвращаем его
      } else {
        // иначе возвращаем непереведённую фразу
        return phrase;
      }
    },
  });
}

/**
 *
 * @param target - proxy target
 * @returns proxy for which the operator "in" works like inRange tester
 * @example
 * let range = { start: 1, end: 10, };
 * alert(5 in range); // true
 * alert(50 in range); // false
 */
export function makeProxyInRange(target: { start: number; end: number }) {
  return new Proxy(target, {
    has(target, propertyName) {
      return target[propertyName] >= target.start && target[propertyName] <= target.end;
    },
  });
}

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
export function makeOOPObject(target: object) {
  return new Proxy(target, {
    get(target, propertyName) {
      if (propertyName.toString().startsWith("_")) {
        throw new Error("Отказано в доступе");
      } else {
        let value = target[propertyName];
        return typeof value === "function" ? value.bind(target) : value; // method of the object itself, must have access to the property
      }
    },
    set(target, propertyName, val: unknown) {
      // intercept the property record
      if (propertyName.toString().startsWith("_")) {
        throw new Error("Отказано в доступе");
      } else {
        target[propertyName] = val;
        return true;
      }
    },
    deleteProperty(target, propertyName) {
      // intercept property deletion
      if (propertyName.toString().startsWith("_")) {
        throw new Error("Отказано в доступе");
      } else {
        delete target[propertyName];
        return true;
      }
    },
    ownKeys(target) {
      // intercept the iteration attempt
      return Object.keys(target).filter((key) => !key.startsWith("_"));
    },
  });
}
