import {
  BEMComponent,
  HTMLElementWithComponent,
} from '@utils/devTools/scripts/ComponentCreationHelper';
import { formatToPeriodDateTime } from '@utils/devTools/scripts/DateHelper';

import '@common.blocks/primitives/apply-control/__clear-btn/_hidden/apply-control__clear-btn_hidden.scss';
import '@common.blocks/primitives/apply-control/__clear-btn/apply-control__clear-btn.scss';
import '@common.blocks/primitives/apply-control/__apply-btn/apply-control__apply-btn.scss';
import '@common.blocks/primitives/apply-control/apply-control.scss';
import '@library.blocks/primitives/datepicker-card/datepicker-card';

import './__apply-control/datepicker-card__apply-control.scss';

type DatepickerCardElement = HTMLDivElement;

type DatepickerCardDOM = {
  $element: JQuery<DatepickerCardElement>;
  input: HTMLInputElement;
  $altFields?: JQuery<HTMLInputElement>;
};
type DatepickerCardGeneratedDOM = {
  $calendar: JQuery<HTMLDivElement>;
  clearBtn: HTMLButtonElement;
  applyBtn: HTMLButtonElement;
};

type DatepickerCardState = {
  dates: Date[];
  formattedDates: string;
};

type DatepickerCardCustomEvents = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  select: {};
  // eslint-disable-next-line @typescript-eslint/ban-types
  change: {};
};

class DatepickerCard extends BEMComponent<DatepickerCardElement, DatepickerCardCustomEvents> {
  protected readonly _DOM: Readonly<DatepickerCardDOM>;
  protected readonly _generatedDOM: Readonly<DatepickerCardGeneratedDOM>;

  protected readonly _state: DatepickerCardState;

  protected _applyControlTemplate = `<div class="datepicker-card__apply-control"><div class="apply-control js-apply-control"><input class="apply-control__clear-btn js-apply-control__clear-btn apply-control__clear-btn_hidden" type="button" value="очистить"><input class="apply-control__apply-btn js-apply-control__apply-btn" type="button" value="применить"></div></div>`;

  constructor(datepickerCardElement: DatepickerCardElement) {
    super(datepickerCardElement);

    this._DOM = this._initDOM();
    this._generatedDOM = this._initLibDatepicker()._initGeneratedDOM();

    this._state = this._initState();

    this._bindApplyControlListeners();

    this._initDisplay();
  }

  getDates() {
    return [...this._state.dates];
  }
  getSplitFormattedDates() {
    return this._state.formattedDates.split(
      this._DOM.$element.data('datepicker').opts.multipleDatesSeparator
    );
  }
  getDateTimes() {
    const isSelfRanged =
      this._DOM.$element.data('datepicker').opts.range && this._DOM.$altFields === undefined;
    const isDatesDefined = this._state.dates.length > 0;

    if (isSelfRanged && isDatesDefined) {
      const [theSmallestDate] = this._state.dates;
      const theLargestDate = this._state.dates[this._state.dates.length - 1];

      return [formatToPeriodDateTime(theSmallestDate.toISOString(), theLargestDate.toISOString())];
    }

    return this._state.dates.map((date) => date.toISOString());
  }
  getFormattedDate() {
    return this._state.formattedDates;
  }
  get$altFields() {
    return this._DOM.$altFields;
  }

  protected _initDOM(): DatepickerCardDOM {
    const $element = $(this.element);
    const input = this.element.previousElementSibling as DatepickerCardDOM['input'];
    const $altFields =
      this.element.dataset.altFields !== undefined
        ? $<HTMLInputElement>(this.element.dataset.altFields)
        : undefined;

    return {
      $element,
      input,
      $altFields,
    };
  }
  private _initLibDatepicker() {
    this._DOM.$element.datepicker({
      prevHtml: `arrow_back`,
      nextHtml: `arrow_forward`,
      dateFormat:
        Boolean(this.element.dataset.range) && this._DOM.$altFields === undefined
          ? 'dd M'
          : 'dd.mm.yyyy',
      minDate: new Date(),
      toggleSelected: false,
      onSelect: (formattedDate: string, date: Date | Array<Date> | '') => {
        this._generatedDOM.clearBtn.classList.remove('apply-control__clear-btn_hidden');

        if (date !== '') {
          this._state.dates = Array.isArray(date) ? date : [date];
        } else {
          this._state.dates = [];
        }

        this._state.formattedDates = formattedDate;

        this.element.dispatchEvent(new CustomEvent('select', { bubbles: true }));
      },
    });

    return this;
  }
  protected _initGeneratedDOM(): DatepickerCardGeneratedDOM {
    const $calendar = this._DOM.$element.find(
      '.datepicker'
    ) as DatepickerCardGeneratedDOM['$calendar'];

    $calendar.get(0).insertAdjacentHTML('beforeend', this._applyControlTemplate);

    const applyControl = this.element.querySelector('.js-apply-control') as HTMLDivElement;
    const clearBtn = applyControl.querySelector(
      '.js-apply-control__clear-btn'
    ) as DatepickerCardGeneratedDOM['clearBtn'];
    const applyBtn = applyControl.querySelector(
      '.js-apply-control__apply-btn'
    ) as DatepickerCardGeneratedDOM['applyBtn'];

    return {
      $calendar,
      clearBtn,
      applyBtn,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  protected _initState() {
    const dates = [] as DatepickerCardState['dates'];
    const formattedDates = '' as DatepickerCardState['formattedDates'];

    return { dates, formattedDates };
  }

  protected _bindApplyControlListeners() {
    this._generatedDOM.clearBtn.addEventListener(
      'click',
      this._applyControlEventListenerObject.handleClearBtnClick
    );

    this._generatedDOM.applyBtn.addEventListener(
      'click',
      this._applyControlEventListenerObject.handleApplyBtnClick
    );

    return this;
  }
  protected _applyControlEventListenerObject = {
    handleClearBtnClick: () => {
      this._DOM.$element.data('datepicker').clear();

      this._generatedDOM.clearBtn.classList.add('apply-control__clear-btn_hidden');
    },
    handleApplyBtnClick: () => {
      if (this._isApplyingAllowed()) {
        const { selectedDates } = this._DOM.$element.data('datepicker');
        const ISOSelectedDates: string[] = selectedDates.map((selectedDate: Date) =>
          selectedDate.toISOString()
        );

        this._changeInputValue(ISOSelectedDates);
      }
    },
  };

  protected _initDisplay() {
    if (this._DOM.input.value !== '') {
      const ISODates = this._DOM.input.value.split(',');

      this._DOM.$element
        .data('datepicker')
        .selectDate(ISODates.map((ISODate) => new Date(ISODate)));
    }

    return this;
  }

  protected _changeInputValue(ISODates: string[]) {
    this._DOM.input.value = ISODates.toString();
    this._DOM.$altFields?.each((index, altField) => {
      // eslint-disable-next-line no-param-reassign
      altField.value = ISODates[index + 1];
    });

    this._DOM.input.dispatchEvent(new Event('change'));
    this.element.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
      })
    );

    return this;
  }

  protected _isApplyingAllowed() {
    const { selectedDates, opts } = this._DOM.$element.data('datepicker');
    let maxSelected = selectedDates.length;

    if (this._DOM.$altFields !== undefined) {
      maxSelected = this._DOM.$altFields.length + 1;
    } else if (opts.range) {
      maxSelected = 2;
    }

    return selectedDates.length === maxSelected || selectedDates.length === 0;
  }
}

type DatepickerCardElementWithComponent = HTMLElementWithComponent<
  DatepickerCardElement,
  DatepickerCardCustomEvents,
  DatepickerCard
>;

const datepickerCards = Array.from(
  document.querySelectorAll('.js-datepicker-card') as NodeListOf<DatepickerCardElement>,
  (datepickerCardElement) => new DatepickerCard(datepickerCardElement)
);

export type { DatepickerCardCustomEvents, DatepickerCard, DatepickerCardElementWithComponent };

export { datepickerCards as default };
