import {
  ToxinIQDropdown,
  ToxinIQDropdownElement,
  ToxinIQDropdownOpenModModifier,
  dropdownsWithIQList,
} from "./../form-dropdown__item-quantity-list";

export class ToxinIQDropdownToggleOpenModModifier extends ToxinIQDropdownOpenModModifier {
  constructor(toxinIQDropdown: ToxinIQDropdown) {
    const toggleMenuHandler = (event) => {
      toxinIQDropdown.toggle();
    };

    super(toxinIQDropdown, [
      {
        currentTarget: toxinIQDropdown.dom.openingButton,
        eventType: "click",
        listener: toggleMenuHandler,
      },
    ]);
  }
}

dropdownsWithIQList.forEach((dropdown, index) => {
  if (
    (dropdown as ToxinIQDropdownElement).toxinIQDropdown.dom.openingButton.classList.contains(
      "form-dropdown__item-quantity-list_openMod-toggle"
    )
  ) {
    new ToxinIQDropdownToggleOpenModModifier(
      (dropdown as ToxinIQDropdownElement).toxinIQDropdown as ToxinIQDropdown
    );
  }
});
