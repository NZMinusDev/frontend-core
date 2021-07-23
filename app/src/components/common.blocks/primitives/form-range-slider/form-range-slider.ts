import {
  BEMComponent,
  HTMLElementWithComponent,
} from '@utils/devTools/scripts/ComponentCreationHelper';

import noUiSlider from '@library.blocks/primitives/form-range-slider/form-range-slider';

type FormRangeSliderElement = HTMLDivElement;

interface HTMLDivElementWithSlider extends HTMLDivElement {
  // eslint-disable-next-line no-use-before-define
  noUiSlider: noUiSlider;
}
type FormRangeSliderDOM = {
  slider: HTMLDivElementWithSlider;
  result: HTMLOutputElement;
  inputFrom: HTMLInputElement;
  inputTo: HTMLInputElement;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type FormRangeSliderCustomEvents = { change: {} };

class FormRangeSlider extends BEMComponent<FormRangeSliderElement, FormRangeSliderCustomEvents> {
  protected readonly _DOM: Readonly<FormRangeSliderDOM>;

  constructor(formRangeSliderElement: FormRangeSliderElement) {
    super(formRangeSliderElement);

    this._DOM = this._initDOM();
    this._initLibRangeSlider();

    this._bindSliderListeners();
  }

  protected _initDOM() {
    const slider = this.element.querySelector(
      '.js-form-range-slider__slider'
    ) as FormRangeSliderDOM['slider'];
    const result = this.element.querySelector(
      '.js-form-range-slider__result'
    ) as FormRangeSliderDOM['result'];
    const [inputFrom, inputTo] = this.element.querySelectorAll<
      FormRangeSliderDOM['inputFrom'] | FormRangeSliderDOM['inputTo']
    >('.js-form-range-slider__input');

    return { slider, result, inputFrom, inputTo };
  }
  protected _initLibRangeSlider() {
    noUiSlider.create(this._DOM.slider, {
      start: [this._DOM.inputFrom.value, this._DOM.inputTo.value],
      range: { min: Number(this._DOM.inputFrom.min), max: Number(this._DOM.inputFrom.max) },
      connect: true,
    });

    return this;
  }

  protected _bindSliderListeners() {
    this._DOM.slider.noUiSlider.on('update', this._sliderEventListenerObject.handleSliderUpdate);
    this._DOM.slider.noUiSlider.on('change', this._sliderEventListenerObject.handleSliderChange);

    return this;
  }
  protected _sliderEventListenerObject = {
    handleSliderUpdate: (values: Array<string>) => {
      const [valueFrom, valueTo] = values;

      this._DOM.inputFrom.value = valueFrom;
      this._DOM.inputTo.value = valueTo;
      this._DOM.result.value = `${parseInt(valueFrom, 10).toLocaleString()}₽ - ${parseInt(
        valueTo,
        10
      ).toLocaleString()}₽`;
    },

    handleSliderChange: (values: Array<string>, handle: number) => {
      switch (handle) {
        case 0: {
          this._DOM.inputFrom.dispatchEvent(new Event('change'));
          this.element.dispatchEvent(new CustomEvent('change', { bubbles: true }));

          break;
        }
        case 1: {
          this._DOM.inputTo.dispatchEvent(new Event('change'));
          this.element.dispatchEvent(new CustomEvent('change', { bubbles: true }));

          break;
        }

        // no default
      }
    },
  };
}

type FormRangeSliderElementWithComponent = HTMLElementWithComponent<
  FormRangeSliderElement,
  FormRangeSliderCustomEvents,
  FormRangeSlider
>;

const formRangeSliders = Array.from(
  document.querySelectorAll<FormRangeSliderElement>('.js-form-range-slider'),
  (formRangeSliderElement) => new FormRangeSlider(formRangeSliderElement)
);

export type { FormRangeSliderCustomEvents, FormRangeSlider, FormRangeSliderElementWithComponent };

export { formRangeSliders as default };
