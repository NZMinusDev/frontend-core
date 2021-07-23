import inputMask from 'inputmask';

import formTextFieldInputs, { FormTextFieldInput } from '../form-text-field__input';
import FormTextFieldInputTypeModifier from './coupling';

class FormTextFieldInputWithEmailTypeModifier extends FormTextFieldInputTypeModifier {
  constructor(formTextFieldInput: FormTextFieldInput) {
    super(formTextFieldInput);

    this._initInputMask();
  }

  protected _initInputMask() {
    inputMask('email', { autoUnmask: true, showMaskOnHover: false }).mask(this.component.element);

    return this;
  }
}

const formTextFieldInputWithEmailTypeModifiers = formTextFieldInputs
  .filter((formTextFieldInput) =>
    formTextFieldInput.element.classList.contains('js-form-text-field__input_type_with-email')
  )
  .map((formTextFieldInput) => new FormTextFieldInputWithEmailTypeModifier(formTextFieldInput));

export { formTextFieldInputWithEmailTypeModifiers as default };
