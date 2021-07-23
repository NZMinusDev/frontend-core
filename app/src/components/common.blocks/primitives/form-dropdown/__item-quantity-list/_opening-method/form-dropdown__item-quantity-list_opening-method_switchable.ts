import formDropdownItemQuantityLists from '../form-dropdown__item-quantity-list';
import FormDropdownItemQuantityListOpeningMethodModifier, {
  FormDropdownItemQuantityList,
} from './coupling';

class FormDropdownItemQuantityListSwitchableOpeningMethodModifier extends FormDropdownItemQuantityListOpeningMethodModifier {
  constructor(formDropdownItemQuantityList: FormDropdownItemQuantityList) {
    super(formDropdownItemQuantityList);

    this._bindComponentListeners();
  }

  protected _bindComponentListeners() {
    this.component.addCustomEventListener(
      'open',
      this._componentEventListenerObject.handleComponentOpen
    );

    return this;
  }
  protected _componentEventListenerObject = {
    handleComponentOpen: () => {
      this.component.toggle();
    },
  };
}

const formDropdownItemQuantityListSwitchableOpeningMethodModifiers = formDropdownItemQuantityLists
  .filter((formDropdownItemQuantityList) =>
    formDropdownItemQuantityList.element.classList.contains(
      'js-form-dropdown__item-quantity-list_opening-method_switchable'
    )
  )
  .map(
    (formDropdownItemQuantityList) =>
      new FormDropdownItemQuantityListSwitchableOpeningMethodModifier(formDropdownItemQuantityList)
  );

export { formDropdownItemQuantityListSwitchableOpeningMethodModifiers as default };
