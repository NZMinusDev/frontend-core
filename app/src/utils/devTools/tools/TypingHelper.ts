export type GenericFunc<TFuncArgs extends unknown[], TFuncReturn extends unknown> = (
  ...funcArgs: TFuncArgs
) => TFuncReturn;
/**
 * @example
 * class Class {
 *  constructor(a:number,b?:string) {}
 * }
 * type T = GenericConstructor<typeof Class>
 * // type T = new (a: number, b?: string | undefined) => typeof Class
 */
export type GenericConstructor<TCreator extends new (...args: any[]) => any> = new (
  ...args: ConstructorParameters<TCreator>
) => TCreator;

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
export type Unpacked<TType> = TType extends (infer TUnpacked)[]
  ? TUnpacked
  : TType extends (...args: any[]) => infer TUnpacked
  ? TUnpacked
  : TType extends Promise<infer TUnpacked>
  ? TUnpacked
  : TType;
/**
 * @example
 * type test = {
 *   param: number;
 *   param2: number[];
 *   param3: () => void;
 *   param4?: string[][];
 *   param5: { p1: string; p2: number };
 * };
 * let test: ArrayPacked<test> = {
 *   param: [1, 2],
 *   param2: [
 *     [1, 2],
 *     [1, 4],
 *   ],
 *   param3: [() => {}, () => {}, () => {}],
 *   param5: [{ p1: "p1", p2: 0 }],
 * };
 */
export type ArrayPacked<TObject extends object> = { [TKey in keyof TObject]: TObject[TKey][] };

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
export type FunctionPropertyNames<TObject extends object> = {
  [TKey in keyof TObject]: TObject[TKey] extends Function ? TKey : never;
}[keyof TObject];
export type FunctionProperties<TObject extends object> = Pick<
  TObject,
  FunctionPropertyNames<TObject>
>;
export type NonFunctionPropertyNames<TObject extends object> = {
  [TKey in keyof TObject]: TObject[TKey] extends Function ? never : TKey;
}[keyof TObject];
export type NonFunctionProperties<TObject extends object> = Pick<
  TObject,
  NonFunctionPropertyNames<TObject>
>;

/**
 * @example
 * interface SomeType {
 *   required: string;
 *   optional?: number;
 *   requiredButPossiblyUndefined: boolean | undefined;
 *   [k: string]: unknown; // index signature
 * }
 * type SomeTypeRequiredKeys = RequiredKeys<SomeType>;
 * // type SomeTypeRequiredKeys = "required" | "requiredButPossiblyUndefined" 🙂
 *
 * type SomeTypeOptionalKeys = OptionalKeys<SomeType>;
 * // type SomeTypeOptionalKeys = "optional" 🙂
 *
 * type SomeTypeIndexKeys = IndexKeyType<SomeType>;
 * // type SomeTypeIndexKeys = string 🙂
 */
export type RequiredKeys<TObject extends object> = {
  [TKey in keyof TObject]-?: string extends TKey
    ? never
    : number extends TKey
    ? never
    : {} extends Pick<TObject, TKey>
    ? never
    : TKey;
} extends { [_ in keyof TObject]-?: infer TInfer }
  ? TInfer extends keyof TObject
    ? TInfer
    : never
  : never;
export type OptionalKeys<TObject extends object> = {
  [TKey in keyof TObject]-?: string extends TKey
    ? never
    : number extends TKey
    ? never
    : {} extends Pick<TObject, TKey>
    ? TKey
    : never;
} extends { [_ in keyof TObject]-?: infer TInfer }
  ? TInfer extends keyof TObject
    ? TInfer
    : never
  : never;
export type IndexKeyType<TObject> = string extends keyof TObject
  ? string
  : number extends keyof TObject
  ? number
  : never;

/**
 * @example
 * type MyTuple = [container:HTMLElement, id: number, name?:string, data?:{}]
 *
 * type MyTupleWithRequired = RequiredTupleValues<MyTuple>
 * // type MyTupleWithRequired = [HTMLElement, number]
 * type MyTupleWithOptional = OptionalTupleValues<MyTuple>
 * // type MyTupleWithRequired = [name?: string | undefined, data?: {} | undefined]
 */
export type RequiredTupleValues<TTuple extends unknown[]> = FilterType<
  RequiredToNeverInTuple<TTuple>,
  never
>;
export type OptionalTupleValues<TTuple extends unknown[]> = FilterType<
  OptionalToNeverInTuple<TTuple>,
  null
>;
type RequiredToNeverInTuple<TTuple extends unknown[]> = {
  [TKey in keyof TTuple]: TTuple[TKey] extends TTuple[RequiredKeys<TTuple>] ? TTuple[TKey] : never;
};
type OptionalToNeverInTuple<TTuple extends unknown[]> = {
  [TKey in keyof TTuple]: RequiredKeys<TTuple> extends never
    ? TTuple[TKey]
    : TTuple[TKey] extends TTuple[RequiredKeys<TTuple>]
    ? null
    : TTuple[TKey];
};

/**
 * @example
 * type T1 = FilterType<[number, string, undefined, number],undefined>
 * // [number, string, number]
 * type T2 = FilterType<[1, undefined, 2],undefined> // [1, 2]
 * type T3 = FilterType<[undefined, 2],undefined> // [2]
 * type T4 = FilterType<[2, undefined],undefined> // [2]
 * type T5 = FilterType<[undefined, undefined, 2],undefined> // [2]
 * type T6 = FilterType<[undefined],undefined> // []
 * type T7 = FilterType<[],undefined> // []
 */
export type FilterType<TTuple extends unknown[], TType> = TTuple extends []
  ? []
  : TTuple extends [infer H, ...infer R]
  ? H extends TType
    ? FilterType<R, TType>
    : [H, ...FilterType<R, TType>]
  : TTuple;

/**
 * @example
 * interface SomeType {
 *   required: string;
 *   optional?: number;
 *   requiredButPossiblyUndefined: boolean | undefined;
 *   [k: string]: unknown; // index signature
 * }
 * type T =  RequiredValues<SomeType>
 * // { required: string; requiredButPossiblyUndefined: boolean | undefined; }
 * type T2 =  OptionalValues<SomeType>
 * // { optional?: number | undefined; }
 */
export type RequiredValues<TObject extends object> = Pick<TObject, RequiredKeys<TObject>>;
export type OptionalValues<TObject extends object> = Pick<TObject, OptionalKeys<TObject>>;

/**
 * @example
 * let people = getDriversLicenseQueue(); // return LinkedList<Person>
 * people.name;
 * people.next.name;
 * people.next.next.name;
 * people.next.next.next.name;
 */
export type LinkedList<TType> = TType & { next: LinkedList<TType> };
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
export type Boxed<TType> = TType extends any[] ? BoxedArray<TType[number]> : BoxedValue<TType>;
type BoxedValue<TType> = { value: TType };
type BoxedArray<TType> = { array: TType[] };
