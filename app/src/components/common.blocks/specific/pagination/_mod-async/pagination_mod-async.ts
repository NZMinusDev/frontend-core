import { paginations } from "../pagination";

const createPaginationItem = (
  linkText: string,
  linkClickListener: (this: HTMLAnchorElement, ev: MouseEvent) => any,
  listItemClasses: Array<string>
): HTMLLIElement => {
  const listItem = document.createElement("li");
  const link = document.createElement("a");
  link.textContent = linkText;
  listItem.classList.add(...listItemClasses);
  listItem.insertAdjacentElement("afterbegin", link);
  listItem.addEventListener("click", linkClickListener);
  return listItem;
};

function createPagination(
  paginationElement: HTMLElement,
  activePage: number,
  displayed: number,
  total: number,
  text: string
) {
  const usedList = paginationElement.querySelector(".pagination__list") as HTMLElement;
  const counterElement = paginationElement.querySelector(
    ".pagination__counter"
  ) as HTMLParagraphElement;

  const pages = Math.ceil(total / displayed);

  //- Determine how many pages to show after the current page index
  let pageCutLow = activePage - 1;
  //- Determine how many pages to show before the current page index
  let pageCutHigh = activePage + 1;

  if (activePage === 1) {
    pageCutLow += 1;
    pageCutHigh += 1;
  }
  if (activePage >= pages) {
    pageCutLow -= 1;
    pageCutHigh = pages;
  }

  const counterFrom = (activePage - 1) * displayed + 1;
  const counterTo = activePage * displayed > total ? total : activePage * displayed;
  const counterToString = counterTo + "";
  const counterTotalString = total + "";
  const counterTotal =
    counterTotalString.length > counterToString.length
      ? Math.floor(total / Math.pow(10, counterToString.length)) *
          Math.pow(10, counterToString.length) +
        "+ "
      : total + " ";

  const counterText = counterFrom + " - " + counterTo + " из " + counterTotal + text;

  const list = document.createElement("ul");
  list.classList.add("pagination__list");

  let active;

  // Show the Previous button only if you are on a page other than the first
  if (activePage > 1) {
    list.insertAdjacentElement(
      "beforeend",
      createPaginationItem(
        "arrow_back",
        () => createPagination(paginationElement, activePage - 1, displayed, total, text),
        ["pagination__item", "pagination__item_previous"]
      )
    );
  }
  // Show all the pagination elements if there are less than 6 pages total
  if (pages < 6) {
    for (let p = 1; p <= pages; p++) {
      active = activePage == p ? "pagination__item_active" : null;
      list.insertAdjacentElement(
        "beforeend",
        createPaginationItem(
          p + "",
          () => createPagination(paginationElement, p, displayed, total, text),
          ["pagination__item", active].filter((element) => element !== null)
        )
      );
    }
  }
  // Use "..." to collapse pages outside of a certain range
  else {
    // Show the very first page followed by a "..." at the beginning of the
    // pagination section (after the Previous button)
    if (activePage > 2) {
      list.insertAdjacentElement(
        "beforeend",
        createPaginationItem(
          "1",
          () => createPagination(paginationElement, 1, displayed, total, text),
          ["pagination__item"]
        )
      );
      if (activePage > 3) {
        list.insertAdjacentElement(
          "beforeend",
          createPaginationItem(
            "...",
            () => createPagination(paginationElement, 2, displayed, total, text),
            ["pagination__item", "pagination__item_out-of-range"]
          )
        );
      }
    }
    // Output the indexes for pages that fall inside the range of pageCutLow
    // and pageCutHigh
    for (let p = pageCutLow; p <= pageCutHigh; p++) {
      active = activePage == p ? "pagination__item_active" : null;
      list.insertAdjacentElement(
        "beforeend",
        createPaginationItem(
          p + "",
          () => createPagination(paginationElement, p, displayed, total, text),
          ["pagination__item", active].filter((element) => element !== null)
        )
      );
    }
    // Show the very last page preceded by a "..." at the end of the pagination
    // section (before the Next button)
    if (activePage < pages - 1) {
      if (activePage < pages - 2) {
        list.insertAdjacentElement(
          "beforeend",
          createPaginationItem(
            "...",
            () => createPagination(paginationElement, activePage + 2, displayed, total, text),
            ["pagination__item", "pagination__item_out-of-range"]
          )
        );
      }
      list.insertAdjacentElement(
        "beforeend",
        createPaginationItem(
          pages + "",
          () => createPagination(paginationElement, pages, displayed, total, text),
          ["pagination__item"]
        )
      );
    }
  }
  // Show the Next button only if you are on a page other than the last
  if (activePage < pages) {
    list.insertAdjacentElement(
      "beforeend",
      createPaginationItem(
        "arrow_forward",
        () => createPagination(paginationElement, activePage + 1, displayed, total, text),
        ["pagination__item", "pagination__item_next"]
      )
    );
  }

  // update pagination after item click
  usedList.replaceWith(list);

  //update counter
  counterElement.textContent = counterText;

  return list;
}

//  init and export our paginations
export const asyncPaginations = Array.from(paginations).filter((pagination) => {
  if (pagination.classList.contains("pagination_async")) {
    createPagination(
      pagination,
      parseInt(pagination.dataset.page),
      parseInt(pagination.dataset.displayed),
      parseInt(pagination.dataset.total),
      pagination.dataset.text
    );
    return true;
  }
  return false;
});
