import { PluginCreation } from "@utils/devTools/devTools";

import "@common.blocks/primitives/apply-control/apply-control.scss";
import "@common.blocks/primitives/apply-control/__clear-btn-js/apply-control__clear-btn-js.scss";
import "@common.blocks/primitives/apply-control/__clear-btn-js/_isHidden/apply-control__clear-btn-js_isHidden.scss";
import "@common.blocks/primitives/apply-control/__apply-btn-js/apply-control__apply-btn-js.scss";

export const cardDatePickers = document.querySelectorAll(
  ".datepicker-here.card-datepicker"
) as NodeListOf<CardDatepickerElement>;

export interface CardDatepickerElement extends HTMLElement {
  cardDatepicker: CardDatepickerAPI;
}

export type CardDatepickerDOM = {
  self: CardDatepickerElement;
  $self: JQuery<CardDatepickerElement>;
  input: HTMLInputElement;
  calendar: HTMLDivElement;
  clearBtn: HTMLButtonElement;
  applyBtn: HTMLButtonElement;
  $altFields: JQuery<HTMLElement>;
};
export interface CardDatepickerAPI extends PluginCreation.Plugin {
  readonly dom: CardDatepickerDOM;
  readonly lastFormattedDate: string;
  readonly lastDates: Array<Date>;
}
export class CardDatepicker implements CardDatepickerAPI {
  readonly dom: CardDatepickerDOM = {
    self: null,
    $self: null,
    input: null,
    calendar: null,
    clearBtn: null,
    applyBtn: null,
    $altFields: null,
  };

  private _lastFormattedDate = "";
  public get lastFormattedDate(): string {
    return this._lastFormattedDate;
  }
  private _lastDates = [];
  public get lastDates(): Array<Date> {
    return this._lastDates;
  }

  private APPLY_CONTROL = `<div class="apply-control"><input class="apply-control__clear-btn-js apply-control__clear-btn-js_isHidden" type="button" value="очистить"><input class="apply-control__apply-btn-js" type="button" value="применить"></div>`;

  constructor(cardDatepicker: CardDatepickerElement) {
    this._initStaticDOM(cardDatepicker);

    this._initLibDatepicker();

    this._initGeneratedDOM();

    this._initApplyControlListeners();

    cardDatepicker.cardDatepicker = this;
  }

  protected _initStaticDOM(cardDatepicker: CardDatepickerElement) {
    this.dom.self = cardDatepicker;
    this.dom.$self = $(cardDatepicker);
    this.dom.input = cardDatepicker.previousElementSibling as HTMLInputElement;
    this.dom.$altFields = $(this.dom.self.dataset.altFields);
  }
  protected _initGeneratedDOM() {
    this.dom.calendar = this.dom.self.querySelector(".datepicker");

    this.dom.calendar.insertAdjacentHTML("beforeend", this.APPLY_CONTROL);
    this.dom.clearBtn = this.dom.self.querySelector(
      ".apply-control .apply-control__clear-btn-js"
    ) as HTMLButtonElement;
    this.dom.applyBtn = this.dom.self.querySelector(
      ".apply-control .apply-control__apply-btn-js"
    ) as HTMLButtonElement;
  }

  protected _initApplyControlListeners() {
    this.dom.clearBtn.addEventListener("click", (event: MouseEvent) => {
      this.dom.$self.data("datepicker").clear();

      this.dom.clearBtn.classList.add("apply-control__clear-btn-js_isHidden");
    });
    this.dom.applyBtn.addEventListener("click", (event: MouseEvent) => {
      this.dom.input.value = this.dom.$self
        .data("datepicker")
        .selectedDates.map((date) => date.toISOString());
      this.dom.input.dispatchEvent(new Event("change"));
      this.dom.self.dispatchEvent(new CustomEvent("change"));
    });
  }

  private _initLibDatepicker() {
    $(this.dom.self).datepicker({
      prevHtml: `arrow_back`,
      nextHtml: `arrow_forward`,
      dateFormat: this.dom.self.dataset.range && !this.dom.$altFields ? "dd M" : "dd.mm.yyyy",
      altField: this.dom.$altFields,
      altFieldDateFormat: "dd.mm.yyyy",
      minDate: new Date(),
      toggleSelected: false,
      onSelect: (formattedDate, date, inst) => {
        this._lastFormattedDate = formattedDate;
        this._lastDates = date;

        if (this.dom.clearBtn) {
          this.dom.clearBtn.classList.remove("apply-control__clear-btn-js_isHidden");
        }

        this.dom.self.dispatchEvent(new CustomEvent("select"));
      },
    });

    const dates = this.dom.input.value;
    if (dates) {
      this.dom.$self
        .data("datepicker")
        .selectDate(dates.split(",").map((datestring) => new Date(datestring)));
    }
  }
}

$(function () {
  cardDatePickers.forEach(function (cardDatePicker) {
    new CardDatepicker(cardDatePicker);
  });
});
