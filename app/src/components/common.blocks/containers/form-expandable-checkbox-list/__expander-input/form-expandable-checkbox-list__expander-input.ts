import {
  BEMComponent,
  HTMLElementWithComponent,
} from '@utils/devTools/scripts/ComponentCreationHelper';

import formExpandableCheckboxLists from '../form-expandable-checkbox-list';

type FormExpandableCheckboxListExpanderInputElement = HTMLInputElement;

type FormExpandableCheckboxListExpanderInputDOM = {
  expandableList: HTMLDivElement;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type FormExpandableCheckboxListExpanderInputCustomEvents = {};

class FormExpandableCheckboxListExpanderInput extends BEMComponent<
  FormExpandableCheckboxListExpanderInputElement,
  FormExpandableCheckboxListExpanderInputCustomEvents
> {
  protected readonly _DOM: Readonly<FormExpandableCheckboxListExpanderInputDOM>;

  constructor(
    formExpandableCheckboxListExpanderInputElement: FormExpandableCheckboxListExpanderInputElement
  ) {
    super(formExpandableCheckboxListExpanderInputElement);

    this._DOM = this._initDOM();

    this._bindListeners();

    this._initDisplay();
  }

  openList() {
    this._DOM.expandableList.style.maxHeight = `${this._DOM.expandableList.scrollHeight}px`;
  }
  closeList() {
    this._DOM.expandableList.style.maxHeight = '';
  }
  toggleList() {
    if (this.element.checked) {
      this.openList();
    } else {
      this.closeList();
    }
  }

  protected _initDOM() {
    const expandableList = this.element
      .nextElementSibling as FormExpandableCheckboxListExpanderInputDOM['expandableList'];

    return { expandableList };
  }

  protected _bindListeners() {
    this.element.addEventListener('change', this.onChange);

    return this;
  }
  protected onChange = () => {
    this.toggleList();
  };

  protected _initDisplay() {
    if (this.element.checked) {
      this.openList();
    }

    return this;
  }
}

type FormExpandableCheckboxListExpanderInputElementWithComponent = HTMLElementWithComponent<
  FormExpandableCheckboxListExpanderInputElement,
  FormExpandableCheckboxListExpanderInputCustomEvents,
  FormExpandableCheckboxListExpanderInput
>;

const formExpandableCheckboxListExpanderInputs = formExpandableCheckboxLists
  .map((parentBlockInstance) => {
    const formExpandableCheckboxListExpanderInputElement = parentBlockInstance.element.querySelector(
      '.js-form-expandable-checkbox-list__expander-input'
    );

    if (formExpandableCheckboxListExpanderInputElement !== null) {
      return new FormExpandableCheckboxListExpanderInput(
        formExpandableCheckboxListExpanderInputElement as FormExpandableCheckboxListExpanderInputElement
      );
    }

    return null;
  })
  .filter(
    (formExpandableCheckboxListExpanderInput) => formExpandableCheckboxListExpanderInput !== null
  );

export type {
  FormExpandableCheckboxListExpanderInputCustomEvents,
  FormExpandableCheckboxListExpanderInput,
  FormExpandableCheckboxListExpanderInputElementWithComponent,
};

export { formExpandableCheckboxListExpanderInputs as default };
