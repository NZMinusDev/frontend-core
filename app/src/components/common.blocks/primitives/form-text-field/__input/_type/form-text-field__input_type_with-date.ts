import inputMask from 'inputmask';

import formTextFieldInputs, { FormTextFieldInput } from '../form-text-field__input';
import FormTextFieldInputTypeModifier from './coupling';

class FormTextFieldInputWithDateTypeModifier extends FormTextFieldInputTypeModifier {
  constructor(formTextFieldInput: FormTextFieldInput) {
    super(formTextFieldInput);

    this._initInputMask();
  }

  protected _initInputMask() {
    inputMask('datetime', {
      inputFormat: 'dd.mm.yyyy',
      placeholder: this.component.getOptions().placeholder,
      autoUnmask: true,
      showMaskOnHover: false,
    }).mask(this.component.element);

    return this;
  }
}

const formTextFieldInputWithDateTypeModifiers = formTextFieldInputs
  .filter((formTextFieldInput) =>
    formTextFieldInput.element.classList.contains('js-form-text-field__input_type_with-date')
  )
  .map((formTextFieldInput) => new FormTextFieldInputWithDateTypeModifier(formTextFieldInput));

export { formTextFieldInputWithDateTypeModifiers as default };
