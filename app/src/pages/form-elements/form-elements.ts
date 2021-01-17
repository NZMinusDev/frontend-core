// page's resources
import "./form-elements.pug";
import "./form-elements.scss";

//libs
import { DOMHelper } from "@utils/devTools/devTools";

//components
import {
  dropdownsWithIQList,
  ToxinIQDropdownElement,
} from "@common.blocks/primitives/form-dropdown/__item-quantity-list/form-dropdown__item-quantity-list.ts";

// focus components
(document.querySelector("#text-field-hover") as HTMLElement).focus();

(DOMHelper.has(dropdownsWithIQList, "#dropdown-expanded-plural").closest(
  ".form-dropdown"
) as ToxinIQDropdownElement).toxinIQDropdown.open();
(DOMHelper.has(dropdownsWithIQList, "#dropdown-expanded-apply").closest(
  ".form-dropdown"
) as ToxinIQDropdownElement).toxinIQDropdown.open();
(DOMHelper.has(dropdownsWithIQList, "#dropdown-expanded-clear-apply").closest(
  ".form-dropdown"
) as ToxinIQDropdownElement).toxinIQDropdown.open();
