import {
  BEMComponent,
  HTMLElementWithComponent,
} from '@utils/devTools/scripts/ComponentCreationHelper';

import type {
  DatepickerCardCustomEvents,
  DatepickerCard,
  DatepickerCardElementWithComponent,
} from '@common.blocks/primitives/datepicker-card/datepicker-card';
import '@common.blocks/primitives/datepicker-card/datepicker-card';

import formDropdowns, { ExpandableItemCustomEvents } from '../form-dropdown';

type FormDropdownDatepickerElement = HTMLDivElement;

type FormDropdownDatepickerDOM = {
  selection: HTMLParagraphElement;
  input: HTMLInputElement;
  datepickerCard?: DatepickerCardElementWithComponent;
};

type FormDropdownDatepickerSubComponents = {
  datepickerCard?: DatepickerCard;
};

type FormDropdownDatepickerState = {
  dates?: string[];
};

type FormDropdownDatepickerHTMLOptions = { placeholder: string };

type FormDropdownDatepickerCustomEvents = DatepickerCardCustomEvents & ExpandableItemCustomEvents;

class FormDropdownDatepicker extends BEMComponent<
  FormDropdownDatepickerElement,
  FormDropdownDatepickerCustomEvents
> {
  protected readonly _DOM: Readonly<FormDropdownDatepickerDOM>;

  protected readonly _subComponents: Readonly<FormDropdownDatepickerSubComponents>;

  protected readonly _options: FormDropdownDatepickerHTMLOptions;
  protected readonly _state: FormDropdownDatepickerState;

  constructor(formFormDropdownDatepickerElement: FormDropdownDatepickerElement) {
    super(formFormDropdownDatepickerElement);

    this._DOM = this._initDOM();

    this._subComponents = this._initSubComponents();

    this._options = this._initOptionsFromHTML();
    this._state = this._initState();

    this._bindListeners()._bindAltFieldsListeners();

    this._initDisplay();
  }

  get() {
    return this._state.dates === undefined ? [] : [...this._state.dates];
  }
  show() {
    this.element.classList.remove('form-dropdown__datepicker_hidden');

    return this;
  }
  hide() {
    this.element.classList.add('form-dropdown__datepicker_hidden');

    return this;
  }

  protected _initDOM(): FormDropdownDatepickerDOM {
    const selection = this.element.nextElementSibling as FormDropdownDatepickerDOM['selection'];
    const input = this.element.querySelector(
      '.js-form-dropdown__datepicker-input'
    ) as FormDropdownDatepickerDOM['input'];
    const datepickerCard =
      this.element.querySelector('.js-datepicker-card') === null
        ? undefined
        : (this.element.querySelector(
            '.js-datepicker-card'
          ) as FormDropdownDatepickerDOM['datepickerCard']);

    return {
      selection,
      input,
      datepickerCard,
    };
  }

  protected _initSubComponents() {
    const datepickerCard = this._DOM.datepickerCard?.component;

    return { datepickerCard };
  }

  protected _initOptionsFromHTML() {
    const placeholder = this._DOM.selection.dataset.placeholder || '';

    return {
      placeholder,
    };
  }
  protected _initState() {
    const dates = this._getDatesFromDatepickerCard();

    return { dates };
  }

  protected _bindListeners() {
    this.element.addEventListener('open', this.onOpen);
    this.element.addEventListener('change', this.onChange);

    return this;
  }
  protected onOpen = () => {
    this.show();
  };
  protected onChange = () => {
    this._changeValue();

    this.hide();
  };

  protected _bindAltFieldsListeners() {
    const $altFields = this._subComponents.datepickerCard?.get$altFields();

    if ($altFields !== undefined) {
      $altFields.each((index, input) => {
        const altDropdown = input.closest('.js-form-dropdown') as HTMLDivElement;

        altDropdown.addEventListener('open', this._altFieldEventListenerObject.handleAltFieldOpen);
      });
    }

    return this;
  }
  protected _altFieldEventListenerObject = {
    handleAltFieldOpen: this.onOpen,
  };

  protected _initDisplay() {
    this._changeValue();

    return this;
  }

  protected _getDatesFromDatepickerCard() {
    return this._subComponents.datepickerCard?.getDates().map((date) => date.toISOString());
  }
  protected _changeValue() {
    if (this._subComponents.datepickerCard !== undefined) {
      const $altFields = this._subComponents.datepickerCard.get$altFields();

      this._state.dates = this._getDatesFromDatepickerCard();
      const dateTimes = this._subComponents.datepickerCard.getDateTimes();

      if ($altFields !== undefined) {
        const formattedDates = this._subComponents.datepickerCard.getSplitFormattedDates();
        const [theFirstDate] = this._state.dates as string[];
        const [theFirstDatetime] = dateTimes;
        const [theFirstFormattedDate] = formattedDates;

        this._DOM.input.value = theFirstDate ?? '';
        this._DOM.selection.innerHTML =
          theFirstDatetime !== undefined
            ? `<time datetime="${theFirstDatetime}">${
                theFirstFormattedDate ?? this._options.placeholder
              }</time>`
            : this._options.placeholder;

        this._changeAltFieldsValues(dateTimes, formattedDates);
      } else {
        const formattedDate = this._subComponents.datepickerCard.getFormattedDate();

        this._changeRangedValue(dateTimes, formattedDate);
      }
    }

    return this;
  }
  protected _changeRangedValue(dateTimes: string[], formattedDate: string) {
    this._DOM.input.value = this._state.dates ? this._state.dates.toString() : '';
    this._DOM.selection.innerHTML =
      dateTimes.toString() !== ''
        ? `<time datetime="${dateTimes.toString()}">${
            formattedDate || this._options.placeholder
          }</time>`
        : this._options.placeholder;
  }
  protected _changeAltFieldsValues(dateTimes: string[], formattedDates: string[]) {
    const $altFields = this._subComponents.datepickerCard?.get$altFields();

    $altFields?.each((index, inputElement) => {
      const dateIndex = index + 1;
      const dateTime = dateTimes[dateIndex];
      const selection = inputElement
        .closest('.js-form-dropdown')
        ?.querySelector(
          '.js-form-dropdown__selection-text'
        ) as FormDropdownDatepickerDOM['selection'];
      const placeholder = selection.dataset.placeholder || '';

      // eslint-disable-next-line no-param-reassign
      inputElement.value = dateTime || '';
      // eslint-disable-next-line no-param-reassign
      selection.innerHTML =
        dateTime !== ''
          ? `<time datetime="${dateTime}">${formattedDates[dateIndex] || placeholder}</time>`
          : placeholder;
    });

    return this;
  }
}

type FormDropdownDatepickerElementWithComponent = HTMLElementWithComponent<
  FormDropdownDatepickerElement,
  FormDropdownDatepickerCustomEvents,
  FormDropdownDatepicker
>;

const formFormDropdownDatepickers = formDropdowns
  .map((formDropdown) =>
    Array.from(
      formDropdown.element.querySelectorAll<FormDropdownDatepickerElement>(
        '.js-form-dropdown__datepicker'
      ),
      (formDropdownDatepickerElement) => new FormDropdownDatepicker(formDropdownDatepickerElement)
    )
  )
  .flat();

export type {
  FormDropdownDatepickerCustomEvents,
  FormDropdownDatepicker,
  FormDropdownDatepickerElementWithComponent,
};

export { formFormDropdownDatepickers as default };
