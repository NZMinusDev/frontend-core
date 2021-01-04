import {
  ToxinIQDropdown,
  ToxinIQDropdownElement,
  ToxinIQDropdownOpenModModifier,
  dropdownsWithIQList,
} from "./../form-dropdown__item-quantity-list";

export class ToxinIQDropdownFoldOpenModModifier extends ToxinIQDropdownOpenModModifier {
  constructor(toxinIQDropdown: ToxinIQDropdown) {
    const foldMenuHandler = (event: MouseEvent) => {
      if (toxinIQDropdown.dom.openingButton.contains(event.target as Element)) {
        toxinIQDropdown.open();
      } else {
        toxinIQDropdown.close();
      }
    };

    super(toxinIQDropdown, [
      {
        currentTarget: (document as unknown) as HTMLElement,
        eventType: "mouseup",
        listener: foldMenuHandler,
      },
    ]);
  }
}

dropdownsWithIQList.forEach((dropdown, index) => {
  if (
    (dropdown as ToxinIQDropdownElement).toxinIQDropdown.dom.openingButton.classList.contains(
      "form-dropdown__item-quantity-list_openMod-fold"
    )
  ) {
    new ToxinIQDropdownFoldOpenModModifier(
      (dropdown as ToxinIQDropdownElement).toxinIQDropdown as ToxinIQDropdown
    );
  }
});
