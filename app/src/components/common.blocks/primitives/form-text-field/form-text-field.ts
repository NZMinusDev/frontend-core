import {
  BEMComponent,
  HTMLElementWithComponent,
} from '@utils/devTools/scripts/ComponentCreationHelper';

type FormTextFieldElement = HTMLDivElement;

// eslint-disable-next-line @typescript-eslint/ban-types
type FormTextFieldCustomEvents = {};

class FormTextField extends BEMComponent<FormTextFieldElement, FormTextFieldCustomEvents> {
  // eslint-disable-next-line no-useless-constructor
  constructor(formTextFieldElement: FormTextFieldElement) {
    super(formTextFieldElement);
  }
}

type FormTextFieldElementWithComponent = HTMLElementWithComponent<
  FormTextFieldElement,
  FormTextFieldCustomEvents,
  FormTextField
>;

const formTextFields = Array.from(
  document.querySelectorAll<FormTextFieldElement>('.js-form-text-field'),
  (formTextFieldElement) => new FormTextField(formTextFieldElement)
);

export type { FormTextFieldCustomEvents, FormTextField, FormTextFieldElementWithComponent };

export { formTextFields as default };
