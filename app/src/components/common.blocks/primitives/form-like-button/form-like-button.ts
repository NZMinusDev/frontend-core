import {
  BEMComponent,
  HTMLElementWithComponent,
} from '@utils/devTools/scripts/ComponentCreationHelper';

type FormLikeButtonElement = HTMLDivElement;

type FormLikeButtonDOM = { button: HTMLInputElement; counter: HTMLSpanElement };

type FormLikeButtonState = {
  likes: number;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type FormLikeButtonCustomEvents = {};

class FormLikeButton extends BEMComponent<FormLikeButtonElement, FormLikeButtonCustomEvents> {
  protected readonly _DOM: Readonly<FormLikeButtonDOM>;

  protected readonly _state: FormLikeButtonState;

  constructor(formLikeButtonElement: FormLikeButtonElement) {
    super(formLikeButtonElement);

    this._DOM = this._initDOM();

    this._state = this._initState();

    this._bindButtonListeners();
  }

  protected _initDOM() {
    const button = this.element.querySelector(
      '.js-form-like-button__button'
    ) as FormLikeButtonDOM['button'];
    const counter = this.element.querySelector(
      '.js-form-like-button__counter'
    ) as FormLikeButtonDOM['counter'];

    return { button, counter };
  }

  protected _initState() {
    const likes = Number(this._DOM.counter.textContent);

    return {
      likes,
    };
  }

  protected _bindButtonListeners() {
    this._DOM.button.addEventListener('change', this._buttonEventListenerObject.handleButtonChange);
  }
  protected _buttonEventListenerObject = {
    handleButtonChange: () => {
      if (this._DOM.button.checked) {
        this._state.likes += 1;
      } else {
        this._state.likes -= 1;
      }

      this._DOM.counter.textContent = `${this._state.likes}`;
    },
  };
}

type FormLikeButtonElementWithComponent = HTMLElementWithComponent<
  FormLikeButtonElement,
  FormLikeButtonCustomEvents,
  FormLikeButton
>;

const formLikeButtons = Array.from(
  document.querySelectorAll<FormLikeButtonElement>('.js-form-like-button'),
  (formLikeButtonElement) => new FormLikeButton(formLikeButtonElement)
);

export type { FormLikeButtonCustomEvents, FormLikeButton, FormLikeButtonElementWithComponent };

export { formLikeButtons as default };
