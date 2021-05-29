/* eslint-disable max-classes-per-file */
import defaultsDeep from 'lodash-es/defaultsDeep';

/**
 * It's shortcut of default handleEvent in EventListenerObject
 */
// eslint-disable-next-line func-style
function handleEvent(event: Event) {
  // mousedown -> onMousedown
  const handlerName = `_on${event.type[0].toUpperCase()}${event.type.slice(1)}`;
  if (this[handlerName]) {
    this[handlerName](event);
  }

  return this;
}

interface CustomEventListener {
  (...args: any): void;
}

interface CustomEventListenerObject {
  handleEvent(...args: any): void;
  [key: string]: any;
}

type handler = CustomEventListener | CustomEventListenerObject;

interface Plugin {
  readonly dom: { self: HTMLElement | null };
}

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
    [key: string]: handler[];
  } = {};

  // Subscribe to the event
  on(eventName: TEvents, eventHandler: handler) {
    if (!this._eventHandlers[eventName]) {
      this._eventHandlers[eventName] = [];
    }

    if (!this._eventHandlers[eventName].includes(eventHandler)) {
      this._eventHandlers[eventName].push(eventHandler);
    }

    return this;
  }

  // Cancel subscribe
  off(eventName: TEvents, eventHandler: (...args: any) => void) {
    const handlers = this._eventHandlers && this._eventHandlers[eventName];

    if (!handlers) {
      return this;
    }

    handlers.splice(handlers.findIndex(eventHandler), 1);

    return this;
  }

  // Generate the event with the specified name and data
  trigger(eventName: TEvents, ...args: any) {
    // no handlers
    if (!this._eventHandlers || !this._eventHandlers[eventName]) {
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
    // mousedown -> onMousedown
    const methodName = `_on${event.type[0].toUpperCase()}${event.type.slice(1)}`;
    if (this[methodName]) this[methodName](event);

    return this;
  }
}

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
    this._theOrderOfIteratingThroughTheOptions = Array.from(
      new Set(
        ([] as OptionsKey[]).concat(
          theOrderOfIteratingThroughTheOptions,
          Object.keys(this._options) as OptionsKey[]
        )
      )
    );
    this._theOrderOfIteratingThroughTheState = Array.from(
      new Set(
        ([] as StateKey[]).concat(
          theOrderOfIteratingThroughTheState,
          Object.keys(this._state) as StateKey[]
        )
      )
    );
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
    const options: any = {};

    let getOptionMethodName;
    this._theOrderOfIteratingThroughTheOptions.forEach((optionKey) => {
      getOptionMethodName = `get${optionKey[0].toUpperCase() + optionKey.slice(1)}Option`;
      if (this[getOptionMethodName]) options[optionKey] = this[getOptionMethodName]();
    });

    return options as TOptionsToGet;
  }

  setOptions(options?: TOptionsToSet) {
    const optionsToForEach = options === undefined ? this._options : options;

    let setOptionMethodName;
    let valueToPass;
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
        setOptionMethodName = `set${optionKey[0].toUpperCase() + optionKey.slice(1)}Option`;
        valueToPass = options === undefined ? undefined : optionValue;

        if (this[setOptionMethodName]) {
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

    let setStateMethodName;
    let valueToPass;
    Object.entries(keyOfStateToForEach)
      .sort(
        ([a], [b]) =>
          this._theOrderOfIteratingThroughTheState.indexOf(a as Extract<keyof TState, string>) -
          this._theOrderOfIteratingThroughTheState.indexOf(b as Extract<keyof TState, string>)
      )
      .forEach(([stateKey, stateValue]) => {
        setStateMethodName = `_set${stateKey[0].toUpperCase() + stateKey.slice(1)}State`;
        valueToPass = state === undefined ? undefined : stateValue;

        if (this[setStateMethodName]) {
          this[setStateMethodName](valueToPass);
        }
      });

    this._render();

    return this;
  }

  protected _fixOptions() {
    let fixOptionMethodName;
    this._theOrderOfIteratingThroughTheOptions.forEach((option) => {
      fixOptionMethodName = `_fix${option[0].toUpperCase() + option.slice(1)}Option`;
      if (this[fixOptionMethodName]) this[fixOptionMethodName]();
    });

    return this;
  }

  protected _fixState() {
    let fixStateMethodName;
    this._theOrderOfIteratingThroughTheState.forEach((state) => {
      fixStateMethodName = `_fix${state[0].toUpperCase() + state.slice(1)}State`;
      if (this[fixStateMethodName]) this[fixStateMethodName]();
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
  whenStateIsChanged(callback: (state: Required<State>) => void): void;
}

interface ListenersByPlugin {
  currentTarget: HTMLElement | HTMLElement[];
  eventType: keyof HTMLElementEventMap;
  listener(this: Element, ev: HTMLElementEventMap[keyof HTMLElementEventMap]): unknown;
  options?: boolean | AddEventListenerOptions;
}

abstract class PluginDecorator {
  protected plugin: Plugin;
  protected listeners: ListenersByPlugin[];

  constructor(plugin: Plugin, listeners: ListenersByPlugin[], modifierName: string) {
    this.plugin = plugin;
    this.listeners = listeners;

    if (this.plugin.dom.self !== null) {
      if (this.plugin.dom.self[modifierName]) {
        this.plugin.dom.self[modifierName].cancel();
      }

      this.plugin.dom.self[modifierName] = this;
      this.plugin.dom.self[modifierName].assign();
    }
  }

  protected assign(): void {
    if (this.listeners) {
      this.listeners.forEach((listener) => {
        if (Array.isArray(listener.currentTarget)) {
          listener.currentTarget.forEach((element) => {
            element.addEventListener(listener.eventType, listener.listener, listener.options);
          });
        } else {
          listener.currentTarget.addEventListener(
            listener.eventType,
            listener.listener,
            listener.options
          );
        }
      });
    }
  }
  protected cancel(): void {
    if (this.listeners) {
      this.listeners.forEach((listener) => {
        if (Array.isArray(listener.currentTarget)) {
          listener.currentTarget.forEach((element) => {
            element.removeEventListener(listener.eventType, listener.listener, listener.options);
          });
        } else {
          listener.currentTarget.removeEventListener(
            listener.eventType,
            listener.listener,
            listener.options
          );
        }
      });
    }
  }
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

  if (!descendant && !parent.contains(descendant)) return false;

  return true;
};

/**
 * Apply mixins to derivedConstructor.
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

export {
  handleEvent,
  CustomEventListener,
  CustomEventListenerObject,
  handler,
  Plugin,
  EventManagerMixin,
  MVPView,
  MVPModel,
  ListenersByPlugin,
  PluginDecorator,
  checkDelegatingEvents,
  applyMixins,
};
