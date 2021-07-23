import { BEMModifier } from '@utils/devTools/scripts/ComponentCreationHelper';

import type { FormTextFieldInput } from '../form-text-field__input';

abstract class FormTextFieldInputTypeModifier extends BEMModifier<FormTextFieldInput> {
  constructor(formTextFieldInput: FormTextFieldInput) {
    super(formTextFieldInput, 'formTextFieldInputTypeModifier');
  }
}

export type { FormTextFieldInput };

export { FormTextFieldInputTypeModifier as default };
