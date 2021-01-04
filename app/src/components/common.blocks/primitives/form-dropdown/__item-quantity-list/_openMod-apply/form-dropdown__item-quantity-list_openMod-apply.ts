import {
  dropdownsWithIQList,
  ToxinIQDropdownElement,
  ToxinIQDropdownDOM,
  ToxinIQDropdown,
  ToxinIQDropdownOpenModModifier,
} from "./../form-dropdown__item-quantity-list";

export type ToxinIQDropdownApplyOpenModDOM = ToxinIQDropdownDOM & {
  clearBtn: HTMLButtonElement;
  applyBtn: HTMLButtonElement;
};

export class ToxinIQDropdownApplyOpenModModifier extends ToxinIQDropdownOpenModModifier {
  constructor(toxinIQDropdown: ToxinIQDropdown) {
    const open = (event: MouseEvent) => {
      if (toxinIQDropdown.dom.openingButton.contains(event.target as Element)) {
        toxinIQDropdown.open();
      }
    };

    (toxinIQDropdown.dom as ToxinIQDropdownApplyOpenModDOM).clearBtn = toxinIQDropdown.dom.menu.querySelector(
      ".apply-control__clear-btn-js"
    );
    (toxinIQDropdown.dom as ToxinIQDropdownApplyOpenModDOM).applyBtn = toxinIQDropdown.dom.menu.querySelector(
      ".apply-control__apply-btn-js"
    );

    const clearHandler = (clickEvent: MouseEvent) => {
      toxinIQDropdown.dom.counters.forEach((counter, index) => {
        for (let i = parseInt(toxinIQDropdown.dom.counters.item(index).textContent); i > 0; i--) {
          toxinIQDropdown.dom.decrementBtns.item(index).dispatchEvent(new Event("click"));
        }
      });
    };

    const clearBtnVisibilityHandler = (clickEvent: MouseEvent) => {
      let totalItems = 0;
      toxinIQDropdown.dom.counters.forEach((counter) => {
        totalItems += parseInt(counter.textContent);
      });

      if (totalItems === 0) {
        (toxinIQDropdown.dom as ToxinIQDropdownApplyOpenModDOM).clearBtn.classList.add(
          "apply-control__clear-btn-js_isHidden"
        );
      } else {
        (toxinIQDropdown.dom as ToxinIQDropdownApplyOpenModDOM).clearBtn.classList.remove(
          "apply-control__clear-btn-js_isHidden"
        );
      }
    };

    const close = (clickEvent: MouseEvent) => {
      toxinIQDropdown.close();
    };

    super(toxinIQDropdown, [
      { currentTarget: toxinIQDropdown.dom.openingButton, eventType: "click", listener: open },
      {
        currentTarget: (toxinIQDropdown.dom as ToxinIQDropdownApplyOpenModDOM).clearBtn,
        eventType: "click",
        listener: clearHandler,
      },
      {
        currentTarget: Array.from(toxinIQDropdown.dom.decrementBtns).concat(
          Array.from(toxinIQDropdown.dom.incrementBtns)
        ),
        eventType: "click",
        listener: clearBtnVisibilityHandler,
      },
      {
        currentTarget: (toxinIQDropdown.dom as ToxinIQDropdownApplyOpenModDOM).applyBtn,
        eventType: "click",
        listener: close,
      },
    ]);

    //init clearBtn visibility
    clearBtnVisibilityHandler(null);
  }
  protected cancel() {
    super.cancel();

    (this.plugin.dom as ToxinIQDropdownApplyOpenModDOM).clearBtn = null;
    (this.plugin.dom as ToxinIQDropdownApplyOpenModDOM).applyBtn = null;
  }
}

dropdownsWithIQList.forEach((dropdown, index) => {
  if (
    (dropdown as ToxinIQDropdownElement).toxinIQDropdown.dom.openingButton.classList.contains(
      "form-dropdown__item-quantity-list_openMod-apply"
    )
  ) {
    new ToxinIQDropdownApplyOpenModModifier(
      (dropdown as ToxinIQDropdownElement).toxinIQDropdown as ToxinIQDropdown
    );
  }
});
