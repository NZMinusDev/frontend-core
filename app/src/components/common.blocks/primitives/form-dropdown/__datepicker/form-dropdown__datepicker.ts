import { Plugin } from "@utils/devTools/tools/PluginCreationHelper";

import { dropdowns } from "./../form-dropdown";
import {
  CardDatepickerElement,
  CardDatepickerDOM,
} from "@common.blocks/primitives/card-datepicker/card-datepicker";

export interface DatepickerDropdownElement extends HTMLDivElement {
  datepickerDropdown: DatepickerDropdown;
}

export type DatepickerDropdownDOM = {
  self: DatepickerDropdownElement;
  openingButton: HTMLButtonElement;
  selection: HTMLTimeElement;
  cardDatepickerDOM: CardDatepickerDOM;
};
export interface DatepickerDropdownAPI extends Plugin {
  readonly dom: DatepickerDropdownDOM;
}
export class DatepickerDropdown implements DatepickerDropdownAPI {
  readonly dom: DatepickerDropdownDOM = {
    self: null,
    openingButton: null,
    selection: null,
    cardDatepickerDOM: null,
  };

  constructor(datepickerDropdown: DatepickerDropdownElement) {
    this._initStaticDOM(datepickerDropdown);

    this._init();

    this._initOpenMod();
    this._initDisplayUpdate();

    this._initAltFieldsBehavior();

    datepickerDropdown.datepickerDropdown = this;
  }

  protected _initStaticDOM(datepickerDropdown: DatepickerDropdownElement) {
    this.dom.cardDatepickerDOM = (datepickerDropdown.querySelector(
      ".card-datepicker"
    ) as CardDatepickerElement).cardDatepicker.dom;

    this.dom.self = datepickerDropdown;
    this.dom.openingButton = this.dom.self.querySelector(".form-dropdown__datepicker-btn");
    this.dom.selection = this.dom.openingButton.querySelector(
      ".form-dropdown__selection-text time"
    );
  }
  protected _initOpenMod() {
    this.dom.cardDatepickerDOM.calendar.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    this.dom.openingButton.addEventListener("click", (event) => {
      this.dom.cardDatepickerDOM.calendar.classList.remove("form-dropdown__calendar_isHidden-js");
    });
    this.dom.cardDatepickerDOM.applyBtn.addEventListener("click", (event) => {
      this.dom.cardDatepickerDOM.calendar.classList.add("form-dropdown__calendar_isHidden-js");
    });
  }
  protected _initDisplayUpdate() {
    this.dom.cardDatepickerDOM.self.addEventListener("change", (event) => {
      this._changeValue();

      this.dom.self.dispatchEvent(new CustomEvent("change"));
    });
  }
  protected _initAltFieldsBehavior() {
    this.dom.cardDatepickerDOM.$altFields.each((index, element) => {
      const altDatepickerDropdown = new AltDatepickerDropdown(
        this.dom.self,
        element.closest(".form-dropdown") as AltDatepickerDropdownElement
      );

      altDatepickerDropdown.dom.openingButton.addEventListener("click", (event) => {
        this.dom.cardDatepickerDOM.calendar.classList.remove("form-dropdown__calendar_isHidden-js");
      });

      const changeValue = () => {
        const formattedValue = this.dom.cardDatepickerDOM.self.cardDatepicker.lastFormattedDate.split(
          this.dom.cardDatepickerDOM.self.getAttribute("data-multiple-dates-separator")
        )[index + 1];
        const value = this.dom.cardDatepickerDOM.self.cardDatepicker.lastDates[index + 1]
          ? this.dom.cardDatepickerDOM.self.cardDatepicker.lastDates[index + 1].toISOString()
          : "";

        altDatepickerDropdown.dom.input.value = value;
        altDatepickerDropdown.dom.selection.setAttribute("datetime", value);
        altDatepickerDropdown.dom.selection.textContent =
          formattedValue || altDatepickerDropdown.dom.selection.getAttribute("placeholder");
      };
      changeValue();
      this.dom.cardDatepickerDOM.self.addEventListener("change", (event) => {
        changeValue();

        altDatepickerDropdown.dom.self.dispatchEvent(new CustomEvent("change"));
      });
      // delete the value set by the datepicker lib plugin
      this.dom.cardDatepickerDOM.self.addEventListener("select", () => {
        altDatepickerDropdown.dom.input.value = "";
      });
    });
  }

  private _init() {
    this._changeValue();

    this.dom.cardDatepickerDOM.calendar.classList.add(
      "form-dropdown__calendar-js",
      "form-dropdown__calendar_isHidden-js"
    );
  }
  private _changeValue() {
    if (
      this.dom.cardDatepickerDOM.self.getAttribute("data-range") &&
      this.dom.cardDatepickerDOM.self.dataset.altFields
    ) {
      this.dom.cardDatepickerDOM.input.value = this.dom.cardDatepickerDOM.input.value.split(",")[0];

      this.dom.selection.setAttribute("datetime", this.dom.cardDatepickerDOM.input.value);
      this.dom.selection.textContent =
        this.dom.cardDatepickerDOM.self.cardDatepicker.lastFormattedDate.split(
          this.dom.cardDatepickerDOM.self.getAttribute("data-multiple-dates-separator")
        )[0] || this.dom.selection.getAttribute("placeholder");
    } else {
      this.dom.selection.setAttribute("datetime", this.dom.cardDatepickerDOM.input.value);
      this.dom.selection.textContent =
        this.dom.cardDatepickerDOM.self.cardDatepicker.lastFormattedDate ||
        this.dom.selection.getAttribute("placeholder");
    }
  }
}

export interface AltDatepickerDropdownElement extends HTMLDivElement {
  altDatepickerDropdown: AltDatepickerDropdown;
}

export type AltDatepickerDropdownDOM = {
  datepickerDropdown: DatepickerDropdownElement;
  self: AltDatepickerDropdownElement;
  openingButton: HTMLButtonElement;
  input: HTMLInputElement;
  selection: HTMLParagraphElement;
};
export interface AltDatepickerDropdownAPI extends Plugin {
  readonly dom: AltDatepickerDropdownDOM;
}
export class AltDatepickerDropdown implements AltDatepickerDropdownAPI {
  readonly dom = {
    datepickerDropdown: null,
    self: null,
    openingButton: null,
    input: null,
    selection: null,
  };

  constructor(
    datepickerDropdown: DatepickerDropdownElement,
    altDatepickerDropdown: AltDatepickerDropdownElement
  ) {
    this._initStaticDOM(datepickerDropdown, altDatepickerDropdown);

    altDatepickerDropdown.altDatepickerDropdown = this;
  }

  protected _initStaticDOM(
    datepickerDropdown: DatepickerDropdownElement,
    altDatepickerDropdown: AltDatepickerDropdownElement
  ) {
    this.dom.datepickerDropdown = datepickerDropdown;
    this.dom.self = altDatepickerDropdown;
    this.dom.openingButton = this.dom.self.querySelector(".form-dropdown__datepicker-btn");
    this.dom.input = this.dom.openingButton.querySelector("input");
    this.dom.selection = this.dom.openingButton.querySelector(
      ".form-dropdown__selection-text time"
    );
  }
}

// init and export our dropdowns
export const dropdownsWithDatepicker = Array.from(dropdowns).filter((dropdown) => {
  if (dropdown.querySelector(".form-dropdown__datepicker")) {
    $(function () {
      new DatepickerDropdown(dropdown as DatepickerDropdownElement);
    });
    return true;
  }
  return false;
});
