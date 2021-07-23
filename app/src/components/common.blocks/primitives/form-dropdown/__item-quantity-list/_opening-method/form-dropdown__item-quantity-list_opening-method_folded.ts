import formDropdownItemQuantityLists from '../form-dropdown__item-quantity-list';
import FormDropdownItemQuantityListOpeningMethodModifier, {
  FormDropdownItemQuantityList,
} from './coupling';

class FormDropdownItemQuantityListFoldedOpeningMethodModifier extends FormDropdownItemQuantityListOpeningMethodModifier {
  constructor(formDropdownItemQuantityList: FormDropdownItemQuantityList) {
    super(formDropdownItemQuantityList);

    this._bindWindowListeners()._bindComponentListeners();
  }

  protected _bindWindowListeners() {
    window.addEventListener('click', this._windowEventListenerObject.handleWindowClick);

    return this;
  }
  protected _windowEventListenerObject = {
    handleWindowClick: (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdownElement = this.component.element.closest('.js-form-dropdown') as HTMLElement;

      if (
        !dropdownElement.contains(target) &&
        this.component.element.classList.contains('menu-open')
      ) {
        this.component.close();
      }
    },
  };

  protected _bindComponentListeners() {
    this.component.addCustomEventListener(
      'open',
      this._componentEventListenerObject.handleComponentOpen
    );

    return this;
  }
  protected _componentEventListenerObject = {
    handleComponentOpen: () => {
      this.component.open();
    },
  };
}

const formDropdownItemQuantityListFoldedOpeningMethodModifiers = formDropdownItemQuantityLists
  .filter((formDropdownItemQuantityList) =>
    formDropdownItemQuantityList.element.classList.contains(
      'js-form-dropdown__item-quantity-list_opening-method_folded'
    )
  )
  .map(
    (formDropdownItemQuantityList) =>
      new FormDropdownItemQuantityListFoldedOpeningMethodModifier(formDropdownItemQuantityList)
  );

export { formDropdownItemQuantityListFoldedOpeningMethodModifiers as default };
