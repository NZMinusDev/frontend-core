import {
  BEMComponent,
  HTMLElementWithComponent,
} from '@utils/devTools/scripts/ComponentCreationHelper';

type FormExpandableCheckboxListElement = HTMLDivElement;

// eslint-disable-next-line @typescript-eslint/ban-types
type FormExpandableCheckboxListCustomEvents = {};

class FormExpandableCheckboxList extends BEMComponent<
  FormExpandableCheckboxListElement,
  FormExpandableCheckboxListCustomEvents
> {
  // eslint-disable-next-line no-useless-constructor
  constructor(formExpandableCheckboxListElement: FormExpandableCheckboxListElement) {
    super(formExpandableCheckboxListElement);
  }
}

type FormExpandableCheckboxListElementWithComponent = HTMLElementWithComponent<
  FormExpandableCheckboxListElement,
  FormExpandableCheckboxListCustomEvents,
  FormExpandableCheckboxList
>;

const formExpandableCheckboxLists = Array.from(
  document.querySelectorAll<FormExpandableCheckboxListElement>('.js-form-expandable-checkbox-list'),
  (formExpandableCheckboxListElement) =>
    new FormExpandableCheckboxList(formExpandableCheckboxListElement)
);

export type {
  FormExpandableCheckboxListCustomEvents,
  FormExpandableCheckboxList,
  FormExpandableCheckboxListElementWithComponent,
};

export { formExpandableCheckboxLists as default };
