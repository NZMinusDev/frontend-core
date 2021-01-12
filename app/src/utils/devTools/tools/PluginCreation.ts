export interface Plugin {
  readonly dom: { self: HTMLElement };
}
export interface ListenersByPlugin {
  currentTarget: HTMLElement | Array<HTMLElement>;
  eventType: keyof HTMLElementEventMap;
  listener: (this: Element, ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => any;
  options?: boolean | AddEventListenerOptions;
}
export abstract class PluginDecorator {
  protected plugin: Plugin;
  protected listeners: Array<ListenersByPlugin>;

  constructor(plugin: Plugin, listeners: Array<ListenersByPlugin>, modifierName: string) {
    this.plugin = plugin;
    this.listeners = listeners;

    if (this.plugin.dom.self[modifierName]) {
      this.plugin.dom.self[modifierName].cancel();
    }

    this.plugin.dom.self[modifierName] = this;
    this.plugin.dom.self[modifierName].assign();
  }

  protected assign(): void {
    if (this.listeners) {
      this.listeners.forEach(function (listener) {
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
      this.listeners.forEach(function (listener) {
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
