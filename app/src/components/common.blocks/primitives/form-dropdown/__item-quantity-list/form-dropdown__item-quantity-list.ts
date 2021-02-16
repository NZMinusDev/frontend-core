import { Plugin, PluginDecorator, ListenersByPlugin } from "@utils/devTools/tools/PluginCreationHelper";
import { has } from "@utils/devTools/tools/DOMHelper";
import merge from "lodash-es/merge";

import { dropdowns } from "./../form-dropdown";

export interface ToxinIQDropdownElement extends HTMLDivElement {
  toxinIQDropdown: ToxinIQDropdownAPI;
}

export type ToxinIQDropdownDOM = {
  self: ToxinIQDropdownElement;
  mainInput: HTMLInputElement;
  openingButton: HTMLButtonElement;
  selection: HTMLParagraphElement;
  menu: HTMLDivElement;
  optionInputs: NodeListOf<HTMLInputElement>;
  menuOptions: NodeListOf<HTMLDivElement>;
  optionTitles: NodeListOf<HTMLHeadingElement>;
  controls: NodeListOf<HTMLDivElement>;
  decrementBtns: NodeListOf<HTMLButtonElement>;
  incrementBtns: NodeListOf<HTMLButtonElement>;
  counters: NodeListOf<HTMLSpanElement>;
};
export interface ToxinIQDropdownAPI extends Plugin {
  readonly dom: ToxinIQDropdownDOM;

  readonly groupCounterList: Map<string, number>;

  open(): boolean;
  close(): boolean;
  toggle(): void;
}

// Component
export class ToxinIQDropdown implements ToxinIQDropdownAPI {
  public readonly dom: ToxinIQDropdownDOM = {
    mainInput: null,
    self: null,
    openingButton: null,
    selection: null,
    menu: null,
    optionInputs: null,
    menuOptions: null,
    optionTitles: null,
    controls: null,
    decrementBtns: null,
    incrementBtns: null,
    counters: null,
  };

  private _groupCounterList = new Map<string, number>();
  public get groupCounterList(): Map<string, number> {
    return this._groupCounterList;
  }

  private _libOptions: LibIQDropdownOptions = {
    setSelectionText: (itemCount, totalItems) => {
      let result = "";
      const groups = JSON.parse(this.dom.menu.dataset.groups);
      this._groupCounterList.clear();

      this.dom.menuOptions.forEach((menuOption) => {
        const groupKey = menuOption.dataset.group || menuOption.dataset.id;
        const groupAmount = this._groupCounterList.get(groupKey)
          ? this._groupCounterList.get(groupKey) + itemCount[menuOption.dataset.id]
          : itemCount[menuOption.dataset.id];

        this._groupCounterList.set(groupKey, groupAmount);
      });

      if (totalItems > 0) {
        let appendedText = "";

        this._groupCounterList.forEach((amount, group) => {
          if (amount > 0) {
            if (result !== "") result += ", ";

            appendedText = amount === 1 ? groups[group].selectionText : groups[group].textPlural;
            result += amount + " " + appendedText;
          }
        });
      } else {
        result = this.dom.selection.dataset.placeholder;
      }

      return result;
    },
    controls: {
      position: "right",
      displayCls: "iqdropdown-content",
      controlsCls: "form-dropdown__counter-control",
      counterCls: "counter",
    },
  };

  constructor(dropdown: ToxinIQDropdownElement, libOptions?: LibIQDropdownOptions) {
    this._initStaticDOM(dropdown);

    this._setOptions(libOptions);

    this._initLibDropdown();
    this._initGeneratedDOM();
    this._clearOpenMode();

    this._initControlBtnListeners();
    this._initInputUpdateListeners();

    dropdown.toxinIQDropdown = this;
  }

  public open() {
    if (!this.dom.openingButton.classList.contains("menu-open")) {
      this.dom.openingButton.classList.add("menu-open");
      this.dom.self.dispatchEvent(new CustomEvent("open"));
      return true;
    }
    return false;
  }
  public close() {
    if (this.dom.openingButton.classList.contains("menu-open")) {
      this.dom.openingButton.classList.remove("menu-open");
      this.dom.self.dispatchEvent(new CustomEvent("close"));
      return true;
    }
    return false;
  }
  public toggle() {
    if (!this.open()) {
      this.close();
    }
  }

  protected _setOptions(libOptions: LibIQDropdownOptions) {
    if (libOptions) this._libOptions = merge(this._libOptions, libOptions);
  }

  protected _initStaticDOM(dropdown: ToxinIQDropdownElement) {
    this.dom.self = dropdown;
    this.dom.mainInput = this.dom.self.querySelector(".form-dropdown__list-input");
    this.dom.openingButton = this.dom.self.querySelector(
      ".iqdropdown.form-dropdown__item-quantity-list"
    );
    this.dom.selection = this.dom.openingButton.querySelector(".iqdropdown-selection");
    this.dom.menu = this.dom.openingButton.querySelector(".iqdropdown-menu");
    this.dom.optionInputs = this.dom.menu.querySelectorAll(".form-dropdown__option-input");
    this.dom.menuOptions = this.dom.menu.querySelectorAll(".iqdropdown-menu-option");
    this.dom.optionTitles = this.dom.menu.querySelectorAll(".iqdropdown-itemItem");
  }
  protected _initGeneratedDOM() {
    this.dom.controls = this.dom.self.querySelectorAll(".form-dropdown__counter-control");
    this.dom.decrementBtns = this.dom.self.querySelectorAll(".button-decrement");
    this.dom.incrementBtns = this.dom.self.querySelectorAll(".button-increment");
    this.dom.counters = this.dom.self.querySelectorAll(".counter");
  }

  protected _initControlBtnListeners() {
    const counterBtnVisibilityClickHandler = (clickEvent: MouseEvent) => {
      const targetMenuOption = has(
        this.dom.menuOptions,
        clickEvent.currentTarget as Element
      );
      const decrementBtn = targetMenuOption.querySelector(".button-decrement");
      const incrementBtn = targetMenuOption.querySelector(".button-increment");
      const counterAmount = parseInt(
        (targetMenuOption.querySelector(".counter") as HTMLDivElement).textContent
      );

      if (parseInt(targetMenuOption.getAttribute("data-mincount")) === counterAmount) {
        decrementBtn.classList.add("iqdropdown__counter_isDisabled");
      } else {
        decrementBtn.classList.remove("iqdropdown__counter_isDisabled");
      }
      if (parseInt(targetMenuOption.getAttribute("data-maxcount")) === counterAmount) {
        incrementBtn.classList.add("iqdropdown__counter_isDisabled");
      } else {
        incrementBtn.classList.remove("iqdropdown__counter_isDisabled");
      }
    };
    this.dom.incrementBtns.forEach((incrementBtn) => {
      incrementBtn.addEventListener("click", counterBtnVisibilityClickHandler);
    });
    this.dom.decrementBtns.forEach((decrementBtn) => {
      decrementBtn.addEventListener("click", counterBtnVisibilityClickHandler);
    });

    // init btns' state
    Array.from(this.dom.decrementBtns)
      .concat(Array.from(this.dom.incrementBtns))
      .forEach((btn) => {
        counterBtnVisibilityClickHandler(({ currentTarget: btn } as unknown) as MouseEvent);
      });
  }
  protected _initInputUpdateListeners() {
    const changeInputValueHandler = () => {
      let accumulator = "";
      this.dom.menuOptions.forEach((menuOption, index) => {
        const counterAmount = this.dom.counters.item(index).textContent;
        const input = this.dom.optionInputs.item(index);

        input.value = counterAmount;

        if (index > 0) accumulator += ",";
        accumulator += counterAmount;
      });
      this.dom.mainInput.value = accumulator;
      this.dom.mainInput.dispatchEvent(new Event("change"));
      this.dom.self.dispatchEvent(
        new CustomEvent("change", {
          detail: {
            value: this.dom.mainInput.value,
          },
        })
      );
    };
    this.dom.self.addEventListener("close", changeInputValueHandler);
  }

  private _initLibDropdown() {
    this.dom.mainInput.value.split(",").map((menuOptionInputValue, index) => {
      this.dom.optionInputs.item(index).value = menuOptionInputValue;
      this.dom.menuOptions.item(index).dataset.defaultcount = menuOptionInputValue;
    });

    $(this.dom.openingButton).iqDropdown(this._libOptions);
  }
  private _clearOpenMode() {
    $(this.dom.openingButton).off("click");
    this.dom.menu.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }
}

// init and export our dropdowns
export const dropdownsWithIQList = Array.from(dropdowns).filter((dropdown) => {
  if (dropdown.querySelector(".form-dropdown__item-quantity-list")) {
    new ToxinIQDropdown(dropdown as ToxinIQDropdownElement);
    return true;
  }
  return false;
}) as Array<ToxinIQDropdownElement>;

// Component modifiers
export abstract class ToxinIQDropdownOpenModModifier extends PluginDecorator {
  constructor(
    toxinIQDropdown: ToxinIQDropdown,
    listeners: Array<ListenersByPlugin>
  ) {
    super(toxinIQDropdown, listeners, "toxinIQDropdownOpenModModifier");
  }
}
