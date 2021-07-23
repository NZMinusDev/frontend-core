import {
  BEMComponent,
  HTMLElementWithComponent,
} from '@utils/devTools/scripts/ComponentCreationHelper';

import formTextFields from '../form-text-field';

type FormTextFieldInputElement = HTMLInputElement;

type FormTextFieldInputHTMLOptions = { placeholder: string };

// eslint-disable-next-line @typescript-eslint/ban-types
type FormTextFieldInputCustomEvents = {};

class FormTextFieldInput extends BEMComponent<
  FormTextFieldInputElement,
  FormTextFieldInputCustomEvents
> {
  protected readonly _options: FormTextFieldInputHTMLOptions;

  constructor(formTextFieldInputElement: FormTextFieldInputElement) {
    super(formTextFieldInputElement);

    this._options = this._initOptionsFromHTML();
  }

  getOptions() {
    return { ...this._options };
  }

  protected _initOptionsFromHTML() {
    const { placeholder } = this.element;

    return { placeholder };
  }
}

type FormTextFieldInputElementWithComponent = HTMLElementWithComponent<
  FormTextFieldInputElement,
  FormTextFieldInputCustomEvents,
  FormTextFieldInput
>;

const formTextFieldInputs = formTextFields
  .map((formTextField) => {
    const formTextFieldInputElement = formTextField.element.querySelector<
      FormTextFieldInputElement
    >('.js-form-text-field__input');

    if (formTextFieldInputElement !== null) {
      return new FormTextFieldInput(formTextFieldInputElement);
    }

    return null;
  })
  .filter((formTextFieldInput) => formTextFieldInput !== null) as FormTextFieldInput[];

export type {
  FormTextFieldInputCustomEvents,
  FormTextFieldInput,
  FormTextFieldInputElementWithComponent,
};

export { formTextFieldInputs as default };
