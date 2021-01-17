const dropdownItems = document.querySelectorAll(".nav-bar__navigation-item_isDropdown");
const activeItems: Array<HTMLElement> = [];
const toggledItems: Array<HTMLElement> = [];
let breakPointState = window.matchMedia("(max-width: 992px)").matches;

function toggleListSize(dropdownItem: HTMLElement) {
  const list = dropdownItem.querySelector(".nav-bar__navigation-list") as HTMLUListElement;
  if (list.style.maxHeight) {
    list.style.maxHeight = null;
  } else {
    let accumulator = 0;
    list.querySelectorAll(".nav-bar__navigation-list").forEach((list: HTMLUListElement) => {
      accumulator += list.scrollHeight;
    });

    list.style.maxHeight = list.scrollHeight + accumulator + "px";
  }
}

dropdownItems.forEach((dropdownItem: HTMLElement) => {
  if (dropdownItem.classList.contains("nav-bar__navigation-item_isActive")) {
    activeItems.push(dropdownItem);

    if (breakPointState) {
      toggledItems.push(dropdownItem);
      toggleListSize(dropdownItem);
    }
  }

  dropdownItem.addEventListener("click", function (event) {
    if (
      breakPointState &&
      (event.target === event.currentTarget ||
        event.target ===
          (event.currentTarget as HTMLElement).querySelector(".nav-bar__expand-icon"))
    ) {
      if (!toggledItems.find((dropdownItem) => dropdownItem === this)) {
        toggledItems.push(this);
        this.classList.add("nav-bar__navigation-item_isActive");
      } else {
        toggledItems.splice(toggledItems.indexOf(this), 1);
        this.classList.remove("nav-bar__navigation-item_isActive");
      }

      toggleListSize(this);
    }
  });
});

window.addEventListener("resize", () => {
  if (breakPointState && window.matchMedia("(min-width: 992px)").matches) {
    toggledItems.forEach((toggledItem) => {
      toggledItem.classList.remove("nav-bar__navigation-item_isActive");
      (toggledItem.querySelector(
        ".nav-bar__navigation-list"
      ) as HTMLUListElement).style.maxHeight = null;
    });
    toggledItems.splice(0);

    activeItems.forEach((activeItem) => {
      activeItem.classList.add("nav-bar__navigation-item_isActive");
    });

    breakPointState = false;
  } else if (!breakPointState && !window.matchMedia("(min-width: 992px)").matches) {
    activeItems.forEach((activeItem) => {
      toggledItems.push(activeItem);
      toggleListSize(activeItem);
    });
    breakPointState = true;
  }
});
