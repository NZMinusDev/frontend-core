import { FormDropdownWithItemQuantityListElementWithComponent } from '@common.blocks/primitives/form-dropdown/form-dropdown';

import './form-elements.pug';
import './form-elements.scss';

const components = {
  dropdownExpandedPlural: (document.querySelector(
    '.js-form-elements-layout__dropdown-expanded-plural'
  )?.firstElementChild as FormDropdownWithItemQuantityListElementWithComponent).component,
  dropdownExpandedApply: (document.querySelector(
    '.js-form-elements-layout__dropdown-expanded-apply'
  )?.firstElementChild as FormDropdownWithItemQuantityListElementWithComponent).component,
  dropdownExpandedClearApply: (document.querySelector(
    '.js-form-elements-layout__dropdown-expanded-clear-apply'
  )?.firstElementChild as FormDropdownWithItemQuantityListElementWithComponent).component,
};

components.dropdownExpandedPlural.getExpandableItemElement().component.open();
components.dropdownExpandedApply.getExpandableItemElement().component.open();
components.dropdownExpandedClearApply.getExpandableItemElement().component.open();
