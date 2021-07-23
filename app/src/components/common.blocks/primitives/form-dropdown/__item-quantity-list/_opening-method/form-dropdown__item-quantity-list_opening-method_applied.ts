import formDropdownItemQuantityLists from '../form-dropdown__item-quantity-list';
import FormDropdownItemQuantityListOpeningTypeModifier, {
  FormDropdownItemQuantityList,
} from './coupling';

type FormDropdownItemQuantityListAppliedOpeningTypeModifierDOM = {
  clearBtn: HTMLButtonElement;
  applyBtn: HTMLButtonElement;
};

class FormDropdownItemQuantityListAppliedOpeningTypeModifier extends FormDropdownItemQuantityListOpeningTypeModifier {
  protected readonly _DOM: Readonly<FormDropdownItemQuantityListAppliedOpeningTypeModifierDOM>;

  constructor(formDropdownItemQuantityList: FormDropdownItemQuantityList) {
    super(formDropdownItemQuantityList);

    this._DOM = this._initDOM();

    this._bindClearBtnListeners()._bindApplyBtnListeners()._bindComponentListeners();

    this._initDisplay();
  }

  protected _initDOM() {
    const applyControl = this.component.element.querySelector(
      '.js-apply-control'
    ) as HTMLDivElement;
    const clearBtn = applyControl.querySelector(
      '.js-apply-control__clear-btn'
    ) as FormDropdownItemQuantityListAppliedOpeningTypeModifierDOM['clearBtn'];
    const applyBtn = applyControl.querySelector(
      '.js-apply-control__apply-btn'
    ) as FormDropdownItemQuantityListAppliedOpeningTypeModifierDOM['applyBtn'];

    return {
      clearBtn,
      applyBtn,
    };
  }

  protected _bindClearBtnListeners() {
    this._DOM.clearBtn.addEventListener(
      'click',
      this._clearBtnEventListenerObject.handleClearBtnClick
    );

    return this;
  }
  protected _clearBtnEventListenerObject = {
    handleClearBtnClick: () => {
      this.component.reset();
      this._updateClearBtnDisplay();
    },
  };

  protected _bindApplyBtnListeners() {
    this._DOM.applyBtn.addEventListener(
      'click',
      this._applyBtnEventListenerObject.handleApplyBtnClick
    );

    return this;
  }
  protected _applyBtnEventListenerObject = {
    handleApplyBtnClick: () => {
      this.component.close();
    },
  };

  protected _bindComponentListeners() {
    this.component.addCustomEventListener(
      'open',
      this._componentEventListenerObject.handleComponentOpen
    );
    this.component.addCustomEventListener(
      'select',
      this._componentEventListenerObject.handleComponentSelect
    );

    return this;
  }
  protected _componentEventListenerObject = {
    handleComponentOpen: () => {
      this.component.open();
    },
    handleComponentSelect: () => {
      this._updateClearBtnDisplay();
    },
  };

  protected _initDisplay() {
    this._updateClearBtnDisplay();

    return this;
  }

  protected _updateClearBtnDisplay() {
    const total = this.component.getTotalItems();

    if (total === 0) {
      this._DOM.clearBtn.classList.add('apply-control__clear-btn_hidden');
    } else {
      this._DOM.clearBtn.classList.remove('apply-control__clear-btn_hidden');
    }

    return this;
  }
}

const formDropdownItemQuantityListAppliedOpeningTypeModifiers = formDropdownItemQuantityLists
  .filter((formDropdownItemQuantityList) =>
    formDropdownItemQuantityList.element.classList.contains(
      'js-form-dropdown__item-quantity-list_opening-method_applied'
    )
  )
  .map(
    (formDropdownItemQuantityList) =>
      new FormDropdownItemQuantityListAppliedOpeningTypeModifier(formDropdownItemQuantityList)
  );

export { formDropdownItemQuantityListAppliedOpeningTypeModifiers as default };
