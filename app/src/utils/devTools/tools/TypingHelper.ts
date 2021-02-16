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
export default function TypeOf(obj: unknown): string {
  const type = Object.prototype.toString.call(obj);
  return type.slice(type.indexOf(" ") + 1, type.indexOf("]"));
}

export type GenericFunc<FA extends unknown, FR extends unknown> = (...funcArgs: FA[]) => FR;

/**
 * @example
 * type T0 = Unpacked<string>;
 * //   ^ = type T0 = string
 * type T1 = Unpacked<string[]>;
 * //   ^ = type T1 = string
 * type T2 = Unpacked<() => string>;
 * //   ^ = type T2 = string
 * type T3 = Unpacked<Promise<string>>;
 * //   ^ = type T3 = string
 * type T4 = Unpacked<Promise<string>[]>;
 * //   ^ = type T4 = Promise
 * type T5 = Unpacked<Unpacked<Promise<string>[]>>;
 * //   ^ = type T5 = string
 */
export type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

/**
 * @example
 * interface Part {
 *   id: number;
 *   name: string;
 *   subparts: Part[];
 *   updatePart(newName: string): void;
 * }
 *
 * type T1 = FunctionPropertyNames<Part>;
 * //   ^ = type T1 = "updatePart"
 * type T2 = NonFunctionPropertyNames<Part>;
 * //   ^ = type T2 = "id" | "name" | "subparts"
 * type T3 = FunctionProperties<Part>;
 * //   ^ = type T3 = {
 * //       updatePart: (newName: string) => void;
 * //   }
 * type T4 = NonFunctionProperties<Part>;
 * //   ^ = type T4 = {
 * //       id: number;
 * //       name: string;
 * //       subparts: Part[];
 * //   }
 */
export type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
export type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;
export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

/**
 * @example
 * let people = getDriversLicenseQueue(); // return LinkedList<Person>
 * people.name;
 * people.next.name;
 * people.next.next.name;
 * people.next.next.next.name;
 */
export type LinkedList<Type> = Type & { next: LinkedList<Type> };
/**
 * @example
 * type T1 = Boxed<string>;
 * //   ^ = type T1 = {
 * //       value: string;
 * //   }
 * type T2 = Boxed<number[]>;
 * //   ^ = type T2 = {
 * //       array: number[];
 * //   }
 * type T3 = Boxed<string | number[]>;
 * //   ^ = type T3 = BoxedValue | BoxedArray
 */
export type Boxed<T> = T extends any[] ? BoxedArray<T[number]> : BoxedValue<T>;
type BoxedValue<T> = { value: T };
type BoxedArray<T> = { array: T[] };
