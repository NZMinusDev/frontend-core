import { BEMModifier } from '@utils/devTools/scripts/ComponentCreationHelper';

import navBarNavigationItems, { NavBarNavigationItem } from '../nav-bar__navigation-item';

type NavBarExpandableNavigationItemModifierDOM = {
  itemExpandCheckbox: HTMLInputElement;
  childList: HTMLUListElement;
  nestedLists: HTMLUListElement[];
};

type NavBarExpandableNavigationItemModifierState = {
  isSmallDesktopMediaMatched: boolean;
};

class NavBarExpandableNavigationItemModifier extends BEMModifier<NavBarNavigationItem> {
  protected readonly _DOM: Readonly<NavBarExpandableNavigationItemModifierDOM>;

  protected readonly _state: NavBarExpandableNavigationItemModifierState;

  constructor(navBarNavigationItem: NavBarNavigationItem) {
    super(navBarNavigationItem, 'iavBarExpandableNavigationItemModifier');

    this._DOM = this._initDOM();

    this._state = this._initState();

    this._bindItemExpandCheckboxListeners()._bindWindowListeners();
  }

  protected _initDOM() {
    const itemExpandCheckbox = this.component.element.querySelector(
      '.js-nav-bar__navigation-item-dropdown-checkbox'
    ) as NavBarExpandableNavigationItemModifierDOM['itemExpandCheckbox'];

    const listSelector = '.js-nav-bar__navigation-list';
    const childList = this.component.element.querySelector(
      listSelector
    ) as NavBarExpandableNavigationItemModifierDOM['childList'];
    const nestedLists = [
      ...this.component.element.querySelectorAll(listSelector),
    ] as NavBarExpandableNavigationItemModifierDOM['nestedLists'];

    return { itemExpandCheckbox, childList, nestedLists };
  }

  // eslint-disable-next-line class-methods-use-this
  protected _initState() {
    const isSmallDesktopMediaMatched = NavBarExpandableNavigationItemModifier._getSmallDesktopMediaMatching();

    return { isSmallDesktopMediaMatched };
  }

  protected _bindItemExpandCheckboxListeners() {
    this._DOM.itemExpandCheckbox.addEventListener(
      'change',
      this._itemExpandCheckboxEventListenerObject.handleItemExpandCheckboxChange
    );

    return this;
  }
  protected _itemExpandCheckboxEventListenerObject = {
    handleItemExpandCheckboxChange: () => {
      if (this._state.isSmallDesktopMediaMatched) {
        this._toggleChildListMaxHeight();
      }
    },
  };

  protected _bindWindowListeners() {
    window.addEventListener('resize', this._windowEventListenerObject.handleWindowResize);
    window.addEventListener('click', this._windowEventListenerObject.handleWindowClick);

    return this;
  }
  protected _windowEventListenerObject = {
    handleWindowResize: () => {
      this._state.isSmallDesktopMediaMatched = NavBarExpandableNavigationItemModifier._getSmallDesktopMediaMatching();

      if (!this._state.isSmallDesktopMediaMatched) {
        this._removeMaxHeightFromChildList();
      } else if (this._DOM.itemExpandCheckbox.checked) {
        this._addMaxHeightToChildList();
      }
    },
    handleWindowClick: (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const navBarExpandableNavigationItem = target.closest(
        '.js-nav-bar__navigation-item_expandable'
      );

      if (navBarExpandableNavigationItem === null) {
        this._uncheckItemExpandCheckbox();
        this._removeMaxHeightFromChildList();
      }
    },
  };

  protected static _getSmallDesktopMediaMatching() {
    return window.matchMedia('(max-width: 992px)').matches;
  }

  protected _addMaxHeightToChildList() {
    const fullScrollHeight = this._DOM.nestedLists.reduce(
      (scrollHeight, nestedList) =>
        scrollHeight + nestedList.scrollHeight - nestedList.clientHeight,
      this._DOM.childList.scrollHeight
    );

    this._DOM.childList.style.maxHeight = `${fullScrollHeight}px`;
  }
  protected _removeMaxHeightFromChildList() {
    this._DOM.childList.style.maxHeight = '';

    return this;
  }
  protected _toggleChildListMaxHeight() {
    if (this._DOM.childList.style.maxHeight !== '') {
      this._removeMaxHeightFromChildList();
    } else {
      this._addMaxHeightToChildList();
    }

    return this;
  }

  protected _uncheckItemExpandCheckbox() {
    this._DOM.itemExpandCheckbox.checked = false;
  }
}

const navBarExpandableNavigationItemModifiers = navBarNavigationItems
  .filter((navBarNavigationItem) =>
    navBarNavigationItem.element.classList.contains('js-nav-bar__navigation-item_expandable')
  )
  .map((navBarNavigationItem) => new NavBarExpandableNavigationItemModifier(navBarNavigationItem));

export { navBarExpandableNavigationItemModifiers as default };
