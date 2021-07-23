/* eslint-disable max-classes-per-file */
import defaultsDeep from 'lodash-es/defaultsDeep';

/**
 * It's shortcut of default handleEvent in EventListenerObject
 */
// eslint-disable-next-line func-style
function handleEvent(event: Event) {
  const [theFirstLetterOfEventType] = event.type;
  const theRestLettersOfEventType = event.type.slice(1);

  // mousedown -> onMousedown
  const handlerName = `_on${theFirstLetterOfEventType.toUpperCase()}${theRestLettersOfEventType}`;

  if (this[handlerName] !== undefined) {
    this[handlerName](event);
  }

  return this;
}

interface ListenerOfIsolatedEvent {
  (...args: unknown[]): void;
}

interface ListenerObjectOfIsolatedEvent {
  handleEvent(...args: unknown[]): void;
  [key: string]: unknown;
}

type ListenerOfIsolatedEventOrListenerObjectOfIsolatedEvent =
  | ListenerOfIsolatedEvent
  | ListenerObjectOfIsolatedEvent;

/**
 * Add events processing inside class without inheritances and make child's handlers inside one class
 * @example
 * // example 1
 * class Menu {
 *   choose(value) { this.trigger("select", value); }
 * }
 * applyMixins(Menu, EventManagerMixin);// add mixin (or use "extends" if you can)
 *
 * interface Menu extends Menu, EventManagerMixin {}
 *
 * let menu = new Menu();
 *
 * menu.on("select", value => alert(`The selected value: ${value}`));
 * menu.choose("123"); // 123
 *
 * // example 2
 * class Menu {
 *   onMousedown(event) {
 *     event.currentTarget.innerHTML = "The mouse button is pressed";
 *   }
 *
 *   onMouseup(event) {
 *     event.currentTarget.innerHTML += "...and unpressed.";
 *   }
 * }
 *
 * let menu = new Menu();
 * btn.addEventListener('mousedown', menu);
 * btn.addEventListener('mouseup', menu);
 */
class EventManagerMixin<TEvents extends string> {
  protected _eventHandlers: {
    [key: string]: ListenerOfIsolatedEventOrListenerObjectOfIsolatedEvent[];
  } = {};

  // Subscribe to the event
  on(eventName: TEvents, eventHandler: ListenerOfIsolatedEventOrListenerObjectOfIsolatedEvent) {
    if (this._eventHandlers[eventName] === undefined) {
      this._eventHandlers[eventName] = [];
    }

    if (!this._eventHandlers[eventName].includes(eventHandler)) {
      this._eventHandlers[eventName].push(eventHandler);
    }

    return this;
  }

  // Cancel subscribe
  off(eventName: TEvents, eventHandler: (...args: unknown[]) => void) {
    const handlers = this._eventHandlers && this._eventHandlers[eventName];

    if (handlers === undefined) {
      return this;
    }

    handlers.splice(handlers.findIndex(eventHandler), 1);

    return this;
  }

  // Generate the event with the specified name and data
  trigger(eventName: TEvents, ...args: unknown[]) {
    // no handlers
    if (this._eventHandlers === undefined || this._eventHandlers[eventName] === undefined) {
      return this;
    }

    // calling the handlers
    this._eventHandlers[eventName].forEach((eventHandler) => {
      if (typeof eventHandler === 'function') {
        eventHandler.apply(this, args);
      } else {
        eventHandler.handleEvent(...args);
      }
    });

    return this;
  }

  handleEvent(event: Event) {
    const [theFirstLetterOfEventType] = event.type;
    const theRestLettersOfEventType = event.type.slice(1);

    // mousedown -> onMousedown
    const methodName = `_on${theFirstLetterOfEventType.toUpperCase()}${theRestLettersOfEventType}`;

    if (this[methodName] !== undefined) {
      this[methodName](event);
    }

    return this;
  }
}

/**
 * Apply mixins to derivedConstructor. Tip: if you can use `extends` - do it instead of this function
 * @param derivedConstructor - class/constructor to derived
 * @param mixinConstructors - classes/constructors adding functionality to derivedConstructor
 * @example
 * // Each mixin is a traditional ES class
 * class Jumpable {
 *  jump() {}
 * }
 *
 * class Duckable {
 *   duck() {}
 * }
 *
 * // Including the base
 * class Sprite {
 *   x = 0;
 *   y = 0;
 * }
 *
 * // Then you create an interface which merges
 * // the expected mixins with the same name as your base
 * interface Sprite extends Jumpable, Duckable {}
 * // Apply the mixins into the base class via the JS at runtime
 * applyMixins(Sprite, [Jumpable, Duckable]);
 *
 * let player = new Sprite();
 * player.jump();
 * console.log(player.x, player.y);
 */
const applyMixins = <
  TDerivedConstructor extends new (...args: unknown[]) => unknown,
  TMixinConstructors extends new (...args: unknown[]) => unknown
>(
  derivedConstructor: TDerivedConstructor,
  mixinConstructors: TMixinConstructors[]
) => {
  mixinConstructors.forEach((baseConstructor) => {
    Object.getOwnPropertyNames(baseConstructor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedConstructor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseConstructor.prototype, name) || Object.create(null)
      );
    });
  });
};

abstract class MVPView<
  TOptionsToGet extends Record<string, unknown>,
  TOptionsToSet extends Record<string, unknown>,
  TState extends Record<string, unknown>,
  TEvents extends string = ''
> extends EventManagerMixin<Exclude<TEvents | 'render' | 'remove', ''>> {
  protected _options: TOptionsToGet;
  protected _state: TState;

  protected readonly _theOrderOfIteratingThroughTheOptions: Extract<keyof TOptionsToGet, string>[];
  protected readonly _theOrderOfIteratingThroughTheState: Extract<keyof TState, string>[];

  constructor(
    DEFAULT_OPTIONS: TOptionsToGet,
    DEFAULT_STATE: Partial<TState>,
    options: TOptionsToSet,
    state: TState,
    {
      theOrderOfIteratingThroughTheOptions = [],
      theOrderOfIteratingThroughTheState = [],
    }: {
      theOrderOfIteratingThroughTheOptions?: Extract<keyof TOptionsToGet, string>[];
      theOrderOfIteratingThroughTheState?: Extract<keyof TState, string>[];
    }
  ) {
    super();

    this._options = defaultsDeep({}, options, DEFAULT_OPTIONS);
    this._state = defaultsDeep({}, state, DEFAULT_STATE);

    type OptionsKey = Extract<keyof TOptionsToGet, string>;
    type StateKey = Extract<keyof TState, string>;
    this._theOrderOfIteratingThroughTheOptions = [
      ...new Set([
        ...theOrderOfIteratingThroughTheOptions,
        ...Object.keys(this._options),
      ] as OptionsKey[]),
    ];
    this._theOrderOfIteratingThroughTheState = [
      ...new Set([
        ...theOrderOfIteratingThroughTheState,
        ...Object.keys(this._state),
      ] as StateKey[]),
    ];
    this._theOrderOfIteratingThroughTheOptions.sort(
      (a, b) =>
        this._theOrderOfIteratingThroughTheOptions.indexOf(a as OptionsKey) -
        this._theOrderOfIteratingThroughTheOptions.indexOf(b as OptionsKey)
    );
    this._theOrderOfIteratingThroughTheState.sort(
      (a, b) =>
        this._theOrderOfIteratingThroughTheState.indexOf(a as StateKey) -
        this._theOrderOfIteratingThroughTheState.indexOf(b as StateKey)
    );

    this._fixOptions()._fixState();
  }

  getOptions(): TOptionsToGet {
    const options = {} as Record<string, unknown>;

    this._theOrderOfIteratingThroughTheOptions.forEach((optionKey) => {
      const [theFirstLetterOfOptionKey] = optionKey;
      const theRestLettersOfOptionKey = optionKey.slice(1);
      const getOptionMethodName = `get${
        theFirstLetterOfOptionKey.toUpperCase() + theRestLettersOfOptionKey
      }Option`;

      if (this[getOptionMethodName] !== undefined) {
        options[optionKey] = this[getOptionMethodName]();
      }
    });

    return options as TOptionsToGet;
  }

  setOptions(options?: TOptionsToSet) {
    const optionsToForEach = options === undefined ? this._options : options;

    Object.entries(optionsToForEach)
      .sort(
        ([a], [b]) =>
          this._theOrderOfIteratingThroughTheOptions.indexOf(
            a as Extract<keyof TOptionsToGet, string>
          ) -
          this._theOrderOfIteratingThroughTheOptions.indexOf(
            b as Extract<keyof TOptionsToGet, string>
          )
      )
      .forEach(([optionKey, optionValue]) => {
        const [theFirstLetterOfOptionKey] = optionKey;
        const theRestLettersOfOptionKey = optionKey.slice(1);
        const setOptionMethodName = `set${
          theFirstLetterOfOptionKey.toUpperCase() + theRestLettersOfOptionKey
        }Option`;
        const valueToPass = options === undefined ? undefined : optionValue;

        if (this[setOptionMethodName] !== undefined) {
          this[setOptionMethodName](valueToPass);
        }
      });

    this._render();

    return this;
  }

  remove() {
    this.trigger('remove');

    return this;
  }

  protected _setState(state?: Partial<TState>) {
    const keyOfStateToForEach = state === undefined ? this._state : state;

    Object.entries(keyOfStateToForEach)
      .sort(
        ([a], [b]) =>
          this._theOrderOfIteratingThroughTheState.indexOf(a as Extract<keyof TState, string>) -
          this._theOrderOfIteratingThroughTheState.indexOf(b as Extract<keyof TState, string>)
      )
      .forEach(([stateKey, stateValue]) => {
        const [theFirstLetterOfStateKey] = stateKey;
        const theRestLettersOfStateKey = stateKey.slice(1);
        const setStateMethodName = `_set${
          theFirstLetterOfStateKey.toUpperCase() + theRestLettersOfStateKey
        }State`;
        const valueToPass = state === undefined ? undefined : stateValue;

        if (this[setStateMethodName] !== undefined) {
          this[setStateMethodName](valueToPass);
        }
      });

    this._render();

    return this;
  }

  protected _fixOptions() {
    this._theOrderOfIteratingThroughTheOptions.forEach((optionKey) => {
      const [theFirstLetterOfOptionKey] = optionKey;
      const theRestLettersOfOptionKey = optionKey.slice(1);
      const fixOptionMethodName = `_fix${
        theFirstLetterOfOptionKey.toUpperCase() + theRestLettersOfOptionKey
      }Option`;

      if (this[fixOptionMethodName] !== undefined) {
        this[fixOptionMethodName]();
      }
    });

    return this;
  }

  protected _fixState() {
    this._theOrderOfIteratingThroughTheState.forEach((stateKey) => {
      const [theFirstLetterOfStateKey] = stateKey;
      const theRestLettersOfStateKey = stateKey.slice(1);
      const fixStateMethodName = `_fix${
        theFirstLetterOfStateKey.toUpperCase() + theRestLettersOfStateKey
      }State`;

      if (this[fixStateMethodName] !== undefined) {
        this[fixStateMethodName]();
      }
    });

    return this;
  }

  protected _render() {
    this.trigger('render');

    return this;
  }
}

interface MVPModel<State> {
  getState(): Promise<Required<State>>;
  setState(state?: Partial<State>): Promise<this>;
  whenStateIsChanged(callback: (state: Required<State>) => void): this;
}

interface CustomEventListener<TEventDetail extends Record<string, unknown>> extends EventListener {
  (event: CustomEvent<TEventDetail>): void;
}
interface CustomEventListenerObject<TEventDetail extends Record<string, unknown>>
  extends EventListenerObject {
  handleEvent(event: CustomEvent<TEventDetail>): void;
  [key: string]: unknown;
}
type CustomEventListenerOrCustomEventListenerObject<TEventDetail extends Record<string, unknown>> =
  | CustomEventListener<TEventDetail>
  | CustomEventListenerObject<TEventDetail>;

type HTMLElementWithComponent<
  THTMLElement extends HTMLElement,
  TCustomEvents extends Record<string, Record<string, unknown>>,
  // eslint-disable-next-line no-use-before-define
  TBEMComponent extends BEMComponent<THTMLElement, TCustomEvents>
> = THTMLElement & { component: TBEMComponent };

/**
 * Common BEM block / element class
 * Tip: It has side effect - assigns 'component' prop to element
 */
abstract class BEMComponent<
  THTMLElement extends HTMLElement,
  TCustomEvents extends Record<string, Record<string, unknown>>
> {
  readonly element: HTMLElementWithComponent<THTMLElement, TCustomEvents, this>;

  constructor(element: THTMLElement) {
    this.element = element as HTMLElementWithComponent<THTMLElement, TCustomEvents, this>;
    this.element.component = this;
  }

  addCustomEventListener<TCustomEventType extends keyof TCustomEvents>(
    type: TCustomEventType,
    listener: CustomEventListenerOrCustomEventListenerObject<TCustomEvents[TCustomEventType]>,
    options?: boolean | AddEventListenerOptions
  ) {
    this.element.addEventListener(type as string, listener, options);
  }
}

/**
 * BEM modifier class
 */
abstract class BEMModifier<
  TBEMComponent extends BEMComponent<HTMLElement, Record<string, Record<string, unknown>>>
> {
  protected component: TBEMComponent;

  constructor(component: TBEMComponent, modifierName: string) {
    this.component = component;

    this.component[modifierName] = this;
  }
}

/**
 *  Switchable BEM modifier class
 */
abstract class CancelableBEMModifier<
  TBEMComponent extends BEMComponent<HTMLElement, Record<string, Record<string, unknown>>>
> {
  protected component: TBEMComponent;

  constructor(component: TBEMComponent, modifierName: string) {
    this.component = component;

    if (this.component[modifierName] !== undefined) {
      this.component[modifierName].cancel();
    }

    this.component[modifierName] = this;
  }

  abstract cancel(): this;
}

/**
 *
 * @param event - event of handler
 * @param parent - HTMLElement with handlers
 * @param descendantSelector - necessary descendant
 * @returns result of checking
 */
const checkDelegatingEvents = (event: Event, parent: HTMLElement, descendantSelector: string) => {
  const descendant = (event.target as HTMLElement).closest(descendantSelector);

  if (descendant === null && !parent.contains(descendant)) {
    return false;
  }

  return true;
};

export {
  handleEvent,
  CustomEventListener,
  CustomEventListenerObject,
  ListenerOfIsolatedEventOrListenerObjectOfIsolatedEvent,
  EventManagerMixin,
  applyMixins,
  MVPView,
  MVPModel,
  HTMLElementWithComponent,
  BEMComponent,
  BEMModifier,
  CancelableBEMModifier,
  checkDelegatingEvents,
};
