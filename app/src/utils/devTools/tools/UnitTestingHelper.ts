import { cloneDeep, isPlainObject } from "lodash-es";
import { TemplateResult } from "lit-html";

import { OptionalTupleValues, RequiredTupleValues } from "./TypingHelper";
import { eachDeep, resolveLongBracketNotation } from "./ObjectHelper";
import { isReferenceType } from "./TypeOf";
import { renderMVPView } from "./PluginCreationHelper";

/**
 * Testing(expect non undefined bounded(by instancePropsExpecter) properties) of arguments of constructor by creating the instance with argsOfCreator
 * @param Creator A Class or Function
 * @param argsOfCreator default arguments for constructor
 * @param instancePropsExpecter callback with expect calls
 */
export function testInitDEFAULT_OPTIONS<
  TCreator extends new (...args: TCreatorArgs) => TInstance,
  TCreatorArgs extends unknown[],
  TInstance extends object
>(
  Creator: TCreator,
  argsOfCreator: TCreatorArgs,
  instancePropsExpecter: InstancePropsExpecter<TCreatorArgs, TInstance>
) {
  describe("DEFAULT_OPTIONS", () => {
    expectValidInstanceProps(argsOfCreator, instancePropsExpecter, new Creator(...argsOfCreator));
  });
}

/**
 * Testing(expect non undefined, bounded(by instancePropsExpecter), setting up(by propsToSet), immutable(deep cloned) properties of instance after init and immutable passed args)
 * @param Creator A Class or Function
 * @param differentConstructorArgs different arguments for constructor: validRequiredArguments - the first will be used as shim for optional args, invalidRequiredArguments, invalidOptionalArguments, partialOptionalArguments - part of valid optional args, fullOptionalArguments - full valid optional args
 * @param instancePropsExpecter callback with expect calls
 * @param propsToSet association of valid constructor's args with properties of instance, for example: new Map().set("_options", 0).set("taxes.3", 1).set("payout","2.doc.payout") - It means the first arg set this._options property and the second one set this.taxes[3] property, the third one set this.payout as doc.payout property of 2 argument
 */
export function testInit<
  TCreator extends new (...args: TCreatorArgs) => TInstance,
  TCreatorArgs extends unknown[],
  TInstance extends object
>({
  Creator,
  differentConstructorArgs,
  instancePropsExpecter,
  propsToSet,
}: {
  Creator: TCreator;
  differentConstructorArgs: DifferentArguments<TCreatorArgs>;
  instancePropsExpecter: InstancePropsExpecter<TCreatorArgs, TInstance>;
  propsToSet?: PropsToSet<number | string>;
}) {
  runMethodOfInstanceWithDifferentArguments({
    Creator,
    differentConstructorArgs,
    instancePropsExpecter,
    propsToSet,
  });
}

/**
 * Testing(expect non undefined bounded(by instancePropsExpecter) properties of instance. Calls toHaveReturnedWith expecter for the method, returned value is expected be cloned)
 * @param Creator A Class or Function
 * @param constructorArgs arguments to pass to constructor
 * @param instancePropsExpecter callback with expect calls for instance state
 * @param methodOfInstanceToTest data about tested method
 */
export function testGetter<
  TCreator extends new (...args: TCreatorArgs) => TInstance,
  TCreatorArgs extends unknown[],
  TMethod extends (args: any) => any,
  TInstance extends object
>({
  Creator,
  constructorArgs,
  instancePropsExpecter,
  methodOfInstanceToTest,
}: {
  Creator: TCreator;
  constructorArgs: TCreatorArgs;
  instancePropsExpecter: InstancePropsExpecter<TCreatorArgs, TInstance>;
  methodOfInstanceToTest: MethodOfInstanceToTest<TMethod, Parameters<TMethod>, TInstance>;
}) {
  function defaultGetterExpecterDecorator(
    expecter: InstanceMethodExpecter<Parameters<TMethod>, TInstance>
  ): InstanceMethodExpecter<Parameters<TMethod>, TInstance> {
    return function ({ mock, passedArgs, instance }) {
      if (methodOfInstanceToTest.returns) {
        expect(mock).toHaveReturnedWith(
          resolveLongBracketNotation(methodOfInstanceToTest.returns, instance)
        );
      }

      expecter({ mock, passedArgs, instance });
    };
  }

  methodOfInstanceToTest.expecter = defaultGetterExpecterDecorator(methodOfInstanceToTest.expecter);

  runMethodOfInstanceWithDifferentArguments({
    Creator,
    differentConstructorArgs: { validRequiredArguments: [constructorArgs] } as DifferentArguments<
      TCreatorArgs
    >,
    instancePropsExpecter: instancePropsExpecter as InstancePropsExpecter<
      TCreatorArgs | Parameters<TMethod>,
      TInstance
    >,
    methodOfInstanceToTest,
  });
}
/**
 * Testing(expect non undefined bounded(by instancePropsExpecter) properties of instance. Also expects the method sets targeted property, resets property to default if undefined is passed and returns this. Expects passed arguments are immutable and deep cloned).
 * @param Creator A Class or Function
 * @param constructorArgs arguments to pass to constructor, should be full(with optional arguments) if you use resetPropsTo with the same default options as in constructor for reset testing purpose
 * @param instancePropsExpecter callback with expect calls for instance state
 * @param methodOfInstanceToTest data about tested method
 * @param propsToSet association of valid method's args with properties of instance, for example: new Map().set("_options", 0).set("taxes.3", 1).set("payout","2.doc.payout") - It means the first arg set this._options property and the second one set this.taxes[3] property, the third one set this.payout as doc.payout property of 2 argument
 * @param resetPropsTo association of properties of instance with reset to values, for example: new Map().set("_options", DEFAULT_OPTIONS) - It means this._options should be DEFAULT_OPTIONS after resetting
 */
export function testSetter<
  TCreator extends new (...args: TCreatorArgs) => TInstance,
  TCreatorArgs extends unknown[],
  TMethod extends (args: any) => any,
  TInstance extends object
>({
  Creator,
  constructorArgs,
  instancePropsExpecter,
  methodOfInstanceToTest,
  propsToSet,
  resetPropsTo,
}: {
  Creator: TCreator;
  constructorArgs: TCreatorArgs;
  instancePropsExpecter: InstancePropsExpecter<TCreatorArgs, TInstance>;
  methodOfInstanceToTest: MethodOfInstanceToTest<TMethod, Parameters<TMethod>, TInstance>;
  propsToSet: PropsToSet<number | string>;
  resetPropsTo: ResetPropsTo<unknown>;
}) {
  const argsToReset = methodOfInstanceToTest.differentArguments
    ? methodOfInstanceToTest.differentArguments.validRequiredArguments
      ? methodOfInstanceToTest.differentArguments.validRequiredArguments[0]
      : []
    : [];

  function defaultSetterExpecterDecorator(
    expecter: InstanceMethodExpecter<Parameters<TMethod>, TInstance>
  ): InstanceMethodExpecter<Parameters<TMethod>, TInstance> {
    return function ({ mock, passedArgs, instance }) {
      expect(mock).toHaveReturnedWith(instance);

      //reset when undefined is passed
      if (Object.is(passedArgs, argsToReset)) {
        resetPropsTo.forEach((defaultValue, pathToPropInInstance) => {
          expect(instance[pathToPropInInstance]).toEqual(defaultValue);
        });
      }

      expecter({ mock, passedArgs, instance });
    };
  }

  methodOfInstanceToTest.expecter = defaultSetterExpecterDecorator(methodOfInstanceToTest.expecter);
  runMethodOfInstanceWithDifferentArguments({
    Creator,
    differentConstructorArgs: { validRequiredArguments: [constructorArgs] } as DifferentArguments<
      TCreatorArgs
    >,
    instancePropsExpecter: instancePropsExpecter as InstancePropsExpecter<
      TCreatorArgs | Parameters<TMethod>,
      TInstance
    >,
    methodOfInstanceToTest,
    propsToSet,
  });

  //reset when undefined is passed
  const methodOfInstanceToRun = {
    methodReference: methodOfInstanceToTest.methodReference,
    argsToPass: (argsToReset as unknown) as Parameters<TMethod>,
    expecter: methodOfInstanceToTest.expecter,
  } as MethodOfInstanceToRun<TMethod, Parameters<TMethod>, TInstance>;
  describe(`${
    typeof methodOfInstanceToTest.methodReference === "string"
      ? methodOfInstanceToTest.methodReference
      : methodOfInstanceToTest.methodReference.name
  }`, () => {
    testInstance({
      describeSentence: "reset (undefined is passed)",
      Creator,
      constructorArgs,
      instancePropsExpecter: instancePropsExpecter as InstancePropsExpecter<
        TCreatorArgs | Parameters<TMethod>,
        TInstance
      >,
      methodOfInstanceToRun,
    });
  });
}

//FIXME: TTemplateArgs typing
/**
 * It runs tests with corresponding constructor and its template arguments and provides rendered container, also uses toMatchSnapshot
 * @param Creator A Class or Function
 * @param constructorsArgs arguments of constructors
 * @param templatesArgs arguments of templates
 * @param callbacksWithTest callback which runs test
 */
export function testDOM<
  TCreator extends new (...args: any) => InstanceType<TCreator>,
  TInstance extends { template: (...args: any) => TemplateResult }
>({
  Creator,
  constructorsArgs,
  templatesArgs,
  callbacksWithTest,
}: {
  Creator: TCreator;
  constructorsArgs: ConstructorParameters<TCreator>[];
  templatesArgs: any[];
  callbacksWithTest: (({
    container,
    instance,
  }: {
    container: DocumentFragment;
    instance: InstanceType<TCreator>;
  }) => void)[];
}) {
  describe("DOM manipulation", () => {
    callbacksWithTest.push(() => {
      test("renders correctly", () => {
        expect(container).toMatchSnapshot();
      });
    });

    let container: DocumentFragment, instance: InstanceType<TCreator>;
    callbacksWithTest.forEach((testCallback, index) => {
      container = new DocumentFragment();
      instance = renderMVPView(
        Creator,
        constructorsArgs[index] === undefined ? [] : (constructorsArgs[index] as any),
        container
      );

      testCallback({ container, instance });
    });
  });
}

export type DifferentArguments<TArgs extends unknown[]> = {
  validRequiredArguments?: RequiredTupleValues<TArgs>[];
  invalidRequiredArguments?: RequiredTupleValues<TArgs>[];
  invalidOptionalArguments?: OptionalTupleValues<TArgs>[];
  partialOptionalArguments?: OptionalTupleValues<TArgs>[];
  fullOptionalArguments?: OptionalTupleValues<TArgs>[];
};
export type InstancePropsExpecter<TArgs extends unknown[], TInstance> = (parts: {
  passedArgs: TArgs;
  instance: TInstance;
}) => void;
export type InstanceMethodExpecter<TArgs extends unknown[], TInstance> = (parts: {
  mock: jest.Mock;
  passedArgs: TArgs;
  instance: TInstance;
}) => void;

function runMethodOfInstanceWithDifferentArguments<
  TCreator extends new (...args: TCreatorArgs) => TInstance,
  TCreatorArgs extends unknown[],
  TMethod extends (...args: TMethodArgs) => unknown,
  TMethodArgs extends unknown[],
  TInstance extends object
>({
  Creator,
  differentConstructorArgs,
  instancePropsExpecter,
  methodOfInstanceToTest,
  propsToSet,
}: {
  Creator: TCreator;
  differentConstructorArgs: DifferentArguments<TCreatorArgs>;
  instancePropsExpecter: InstancePropsExpecter<TCreatorArgs | TMethodArgs, TInstance>;
  methodOfInstanceToTest?: MethodOfInstanceToTest<TMethod, TMethodArgs, TInstance>;
  propsToSet?: PropsToSet<number | string>;
}) {
  const requiredConstructorArgs = (differentConstructorArgs.validRequiredArguments
    ? differentConstructorArgs.validRequiredArguments[0]
    : []) as TCreatorArgs;
  const requiredMethodArgs = (methodOfInstanceToTest?.differentArguments?.validRequiredArguments
    ? methodOfInstanceToTest.differentArguments.validRequiredArguments[0]
    : []) as TMethodArgs;

  let constructorArgs = requiredConstructorArgs;
  let differentArguments: DifferentArguments<TCreatorArgs | TMethodArgs> = differentConstructorArgs;
  let methodOfInstanceToRun: MethodOfInstanceToRun<TMethod, TMethodArgs, TInstance> | undefined;

  describe(`${
    typeof methodOfInstanceToTest?.methodReference === "string"
      ? methodOfInstanceToTest?.methodReference
      : methodOfInstanceToTest?.methodReference.name || "init"
  }`, () => {
    if (methodOfInstanceToTest) {
      methodOfInstanceToRun = {
        methodReference: methodOfInstanceToTest.methodReference,
        argsToPass: requiredMethodArgs,
        returns: methodOfInstanceToTest.returns,
        expecter: methodOfInstanceToTest.expecter,
      };

      differentArguments = methodOfInstanceToTest.differentArguments || {};
    }

    let propsToSetWithValues: PropsToSet<unknown> | undefined;

    const amountOfDifferentArgs = eachOfDifferentArguments(
      differentArguments,
      (key, concreteDifferentArgs, index, isRequiredArgs, isValidArgs) => {
        if (methodOfInstanceToRun) {
          methodOfInstanceToRun.argsToPass = isRequiredArgs
            ? (concreteDifferentArgs as TMethodArgs)
            : (requiredMethodArgs.concat(concreteDifferentArgs) as TMethodArgs);
        } else {
          constructorArgs = isRequiredArgs
            ? (concreteDifferentArgs as TCreatorArgs)
            : (requiredConstructorArgs.concat(concreteDifferentArgs) as TCreatorArgs);
        }

        if (propsToSet !== undefined && isValidArgs) {
          propsToSetWithValues = new Map();

          propsToSet.forEach((referenceOfArgToSet, pathToPropInInstance) => {
            propsToSetWithValues?.set(
              pathToPropInInstance,
              resolveLongBracketNotation(
                `${referenceOfArgToSet}`,
                methodOfInstanceToRun?.argsToPass || constructorArgs
              )
            );
          });
        } else {
          propsToSetWithValues = undefined;
        }

        testInstance({
          describeSentence: `with ${index + 1} ${key} arguments`,
          Creator,
          constructorArgs,
          instancePropsExpecter,
          methodOfInstanceToRun,
          propsToSet: propsToSetWithValues,
        });
      }
    );

    if (amountOfDifferentArgs === 0) {
      testInstance({
        describeSentence: `without arguments`,
        Creator,
        constructorArgs,
        instancePropsExpecter,
        methodOfInstanceToRun,
        propsToSet: propsToSetWithValues,
      });
    }
  });
}
type MethodOfInstanceToTest<
  TMethod extends (...args: TMethodArgs) => unknown,
  TMethodArgs extends unknown[],
  TInstance
> = {
  methodReference: TMethod | string;
  expecter: InstanceMethodExpecter<TMethodArgs, TInstance>;
  differentArguments?: DifferentArguments<TMethodArgs>;
  returns?: PropToGet;
};
function eachOfDifferentArguments<TArgs extends unknown[]>(
  differentArguments: DifferentArguments<TArgs>,
  callbackEach: (
    key: string,
    concreteDifferentArgs: TArgs[],
    index: number,
    isRequiredArgs: boolean,
    isValidArgs: boolean
  ) => void
) {
  let counter = 0;

  Object.entries(differentArguments).forEach(([key, arrayOfConcreteDifferentArgs]) => {
    (arrayOfConcreteDifferentArgs as TArgs[][] | undefined)?.forEach(
      (concreteDifferentArgs, index) => {
        callbackEach(
          key,
          concreteDifferentArgs,
          index,
          key === "validRequiredArguments" || key === "invalidRequiredArguments",
          key === "validRequiredArguments" ||
            key === "partialOptionalArguments" ||
            key === "fullOptionalArguments"
        );

        counter++;
      }
    );
  });

  return counter;
}

function testInstance<
  TCreator extends new (...args: TCreatorArgs) => TInstance,
  TCreatorArgs extends unknown[],
  TMethod extends (...args: TMethodArgs) => unknown,
  TMethodArgs extends unknown[],
  TInstance extends object
>({
  describeSentence,
  Creator,
  constructorArgs,
  instancePropsExpecter,
  methodOfInstanceToRun,
  propsToSet,
}: {
  describeSentence: string;
  Creator: TCreator;
  constructorArgs: TCreatorArgs;
  instancePropsExpecter: InstancePropsExpecter<TCreatorArgs | TMethodArgs, TInstance>;
  methodOfInstanceToRun?: MethodOfInstanceToRun<TMethod, TMethodArgs, TInstance>;
  propsToSet?: PropsToSet<unknown>;
}) {
  describe(describeSentence, () => {
    const copyOfConstructorArgs = cloneDeep(constructorArgs);
    let instance: TInstance = new Creator(...constructorArgs);
    let passedArgs: TCreatorArgs | TMethodArgs = constructorArgs;

    if (!methodOfInstanceToRun) {
      expectPassedArgsAreImmutable(constructorArgs, copyOfConstructorArgs);
    } else {
      const methodOfInstanceMock = jest.fn(
        instance[
          typeof methodOfInstanceToRun.methodReference === "string"
            ? methodOfInstanceToRun.methodReference
            : methodOfInstanceToRun.methodReference.name
        ]
      );
      passedArgs = methodOfInstanceToRun.argsToPass;
      const copyOfPassedArgs = cloneDeep(passedArgs);

      const mockReturned = methodOfInstanceMock.apply(instance, passedArgs);

      expectPassedArgsAreImmutable(passedArgs, copyOfPassedArgs);
      if (methodOfInstanceToRun.returns) {
        expectReturnedAreImmutable(mockReturned, methodOfInstanceToRun.returns, instance);
      }
      expectMethodOfInstance(
        `method ${
          typeof methodOfInstanceToRun.methodReference === "string"
            ? methodOfInstanceToRun.methodReference
            : methodOfInstanceToRun.methodReference.name
        } should pass methodOfInstanceToTest.expecter checks (possibly decorated)`,
        methodOfInstanceMock,
        passedArgs as TMethodArgs,
        methodOfInstanceToRun.expecter,
        instance
      );
    }

    if (propsToSet) {
      expectPropsAreApplied(propsToSet, instance);
    }

    expectValidInstanceProps(passedArgs, instancePropsExpecter, instance);
  });
}
type MethodOfInstanceToRun<
  TMethod extends (...args: TMethodArgs) => unknown,
  TMethodArgs extends unknown[],
  TInstance
> = {
  methodReference: TMethod | string;
  argsToPass: TMethodArgs;
  returns?: PropToGet;
  expecter: InstanceMethodExpecter<TMethodArgs, TInstance>;
};
type PathToPropInInstance = string;
type PropToGet = PathToPropInInstance;
type PropsToSet<TArgValue> = Map<PathToPropInInstance, TArgValue>;
type ResetPropsTo<TDefaultValue> = Map<PathToPropInInstance, TDefaultValue>;

function expectValidInstanceProps<
  TInstance,
  TCreatorArgs extends unknown[],
  TMethodArgs extends unknown[]
>(
  passedArgs: TCreatorArgs | TMethodArgs,
  expecter: InstancePropsExpecter<TCreatorArgs | TMethodArgs, TInstance>,
  instance: TInstance
): void {
  test("instance's properties should be defined", () => {
    eachDeep(instance, ({ value }) => {
      expect(value).toBeDefined();
    });
  });

  test("instance's properties should be bounded", () => {
    expecter({
      passedArgs,
      instance,
    });
  });
}
function expectMethodOfInstance<TArgs extends unknown[], TInstance>(
  describeSentence: string,
  mock: jest.Mock,
  passedArgs: TArgs,
  expecter: InstanceMethodExpecter<TArgs, TInstance>,
  instance: TInstance
) {
  test(describeSentence, () => {
    expecter({ mock, passedArgs, instance });
  });
}
function expectPropsAreApplied<TInstance extends object>(
  propsToSet: PropsToSet<unknown>,
  instance: TInstance
): void {
  test("correct user's arguments should be applied", () => {
    propsToSet.forEach((argValue, pathToPropInInstance) => {
      if (argValue !== undefined) {
        if (isPlainObject(argValue)) {
          expect(resolveLongBracketNotation(`${pathToPropInInstance}`, instance)).toMatchObject(
            argValue as {}
          );
        } else {
          expect(resolveLongBracketNotation(`${pathToPropInInstance}`, instance)).toEqual(argValue);
        }
      }
    });
  });

  propsToSet.forEach((argValue, pathToPropInInstance) => {
    if (isReferenceType(argValue)) {
      test(`passed referenced argument setting ${pathToPropInInstance} instance's property should be cloned deep`, () => {
        expect(resolveLongBracketNotation(`${pathToPropInInstance}`, instance)).not.toBe(argValue);
        expect(resolveLongBracketNotation(`${pathToPropInInstance}`, instance)).toMatchObject(
          argValue as {}
        );

        eachDeep(argValue, ({ value, path }) => {
          if (isReferenceType(value) && typeof value !== "function") {
            expect(
              resolveLongBracketNotation(`${pathToPropInInstance}.${path}`, instance)
            ).not.toBe(value);
            expect(
              resolveLongBracketNotation(`${pathToPropInInstance}.${path}`, instance)
            ).toMatchObject(value as {});
          }
        });
      });
    }
  });
}
function expectPassedArgsAreImmutable<TArgs extends unknown[]>(
  passedArgs: TArgs,
  immutableCopyOfPassedArgs: TArgs
): void {
  passedArgs.forEach((passedArgValue, index) => {
    if (isReferenceType(passedArgValue)) {
      test(`${index + 1} argument should be immutable`, () => {
        expect(passedArgValue).not.toBe(immutableCopyOfPassedArgs[index]);
        expect(passedArgValue).toStrictEqual(immutableCopyOfPassedArgs[index]);
      });
    }
  });
}
function expectReturnedAreImmutable<TInstance extends object>(
  returned: unknown,
  returns: PropToGet,
  instance: TInstance
): void {
  const propOfInstanceValue = resolveLongBracketNotation(returns, instance);
  if (isReferenceType(propOfInstanceValue)) {
    test(`returned referenced property should be cloned deep`, () => {
      expect(returned).not.toBe(propOfInstanceValue);
      expect(returned).toStrictEqual(propOfInstanceValue);

      eachDeep(returned, ({ value, path }) => {
        if (isReferenceType(value) && typeof value !== "function") {
          expect(resolveLongBracketNotation(`${returns}.${path}`, instance)).not.toBe(value);
          expect(resolveLongBracketNotation(`${returns}.${path}`, instance)).toMatchObject(
            value as {}
          );
        }
      });
    });
  }
}
