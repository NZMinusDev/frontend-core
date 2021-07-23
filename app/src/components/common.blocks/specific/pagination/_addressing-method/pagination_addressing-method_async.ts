import '../__item/pagination__item.scss';
import '../__item/_active/pagination__item_active.scss';
import '../__item/_previous/pagination__item_previous.scss';
import '../__item/_next/pagination__item_next.scss';
import paginations from '../pagination';
import PaginationAddressingMethodModifier, { Pagination } from './coupling';

interface AsyncPaginationItemElement extends HTMLLIElement {
  pageNumber: number;
}

type PaginationAsyncAddressingMethodModifierHTMLOptions = {
  page: number;
  displayed: number;
  total: number;
  pages: number;
  text: string;
};
type PaginationAsyncAddressingMethodModifierState = {
  activePage: number;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type PaginationAsyncAddressingMethodModifierCustomEvents = { change: {} };

class PaginationAsyncAddressingMethodModifier extends PaginationAddressingMethodModifier {
  protected readonly _options: PaginationAsyncAddressingMethodModifierHTMLOptions;
  protected readonly _state: PaginationAsyncAddressingMethodModifierState;

  constructor(pagination: Pagination) {
    super(pagination);

    this._options = this._initOptionsFromHTML();
    this._state = this._initState();

    this._renderPaginationItems();
  }

  getActivePage() {
    return this._state.activePage;
  }

  protected _initOptionsFromHTML() {
    const page = parseInt(this.component.element.dataset.page as string, 10);
    const displayed = parseInt(this.component.element.dataset.displayed as string, 10);
    const total = parseInt(this.component.element.dataset.total as string, 10);
    const pages = Math.ceil(total / displayed);
    const text = this.component.element.dataset.text as string;

    return { page, displayed, total, pages, text };
  }
  protected _initState() {
    const activePage = this._options.page;

    return { activePage };
  }

  protected _paginationItemEventListenerObject = {
    handlePaginationItemClick: (event: MouseEvent) => {
      const paginationItem = event.currentTarget as AsyncPaginationItemElement;

      this._state.activePage = paginationItem.pageNumber;
      this._renderPaginationItems()._renderPaginationCounter();
      this.component.element.dispatchEvent(new CustomEvent('change', { bubbles: true }));
    },
  };

  protected _renderPaginationItems() {
    const newList = document.createDocumentFragment();

    // Show the Previous button only if you are on a page other than the first
    if (this._state.activePage > 1) {
      this._insertPreviousButtonPaginationItem(newList);
    }

    // Show all the pagination elements if there are less than 6 pages total
    if (this._options.pages < 6) {
      this._insertAllPaginationItems(newList);
    }

    // Use "..." to collapse pages outside of a certain range
    else {
      /*
       * Show the very first page followed by a "..." at the beginning of the
       * pagination section (after the Previous button)
       */
      if (this._state.activePage > 2) {
        this._insertTheFirstPagePaginationItem(newList);

        if (this._state.activePage > 3) {
          this._insertSeparatorPaginationItem(newList, 2);
        }
      }

      /*
       * Output the indexes for pages that fall inside the range of pageCutLow
       * and pageCutHigh
       */
      this._insertPaginationItemsBeforeTheLastSeparator(newList);

      /*
       * Show the very last page preceded by a "..." at the end of the pagination
       * section (before the Next button)
       */
      if (this._state.activePage < this._options.pages - 1) {
        if (this._state.activePage < this._options.pages - 2) {
          this._insertSeparatorPaginationItem(newList, this._options.pages - 1);
        }

        this._insertTheLastPagePaginationItem(newList);
      }
    }

    // Show the Next button only if you are on a page other than the last
    if (this._state.activePage < this._options.pages) {
      this._insertNextButtonPaginationItem(newList);
    }

    // eslint-disable-next-line dot-notation
    this.component['_DOM'].list.innerHTML = '';
    // eslint-disable-next-line dot-notation
    this.component['_DOM'].list.append(newList);

    return this;
  }
  protected static _createPaginationItem(
    pageNumber: number,
    innerText: string,
    linkClickListener: (event: MouseEvent) => void,
    classes: Array<string>,
    attributes: { [attribute: string]: string } = {}
  ) {
    const item = document.createElement('li') as AsyncPaginationItemElement;
    item.pageNumber = pageNumber;
    item.textContent = innerText;
    item.classList.add(...classes);
    item.addEventListener('click', linkClickListener);

    Object.entries(attributes).forEach(([qualifiedName, value]) => {
      item[qualifiedName] = value;
    });

    return item;
  }
  protected _insertPreviousButtonPaginationItem(list: DocumentFragment) {
    list.append(
      PaginationAsyncAddressingMethodModifier._createPaginationItem(
        this._state.activePage - 1,
        'arrow_back',
        this._paginationItemEventListenerObject.handlePaginationItemClick,
        ['pagination__item', 'pagination__item_previous'],
        { title: 'на предыдущую страницу' }
      )
    );

    return this;
  }
  protected _insertAllPaginationItems(list: DocumentFragment) {
    // eslint-disable-next-line no-loops/no-loops
    for (let page = 1; page <= this._options.pages; page += 1) {
      const itemActiveClass = this._state.activePage === page ? 'pagination__item_active' : '';
      const title = this._state.activePage === page ? 'текущая страница' : `на страницу ${page}`;

      list.append(
        PaginationAsyncAddressingMethodModifier._createPaginationItem(
          page,
          `${page}`,
          this._paginationItemEventListenerObject.handlePaginationItemClick,
          ['pagination__item', itemActiveClass].filter((element) => element !== ''),
          { title }
        )
      );
    }

    return this;
  }
  protected _insertTheFirstPagePaginationItem(list: DocumentFragment) {
    list.append(
      PaginationAsyncAddressingMethodModifier._createPaginationItem(
        1,
        '1',
        this._paginationItemEventListenerObject.handlePaginationItemClick,
        ['pagination__item'],
        { title: 'на страницу 1' }
      )
    );

    return this;
  }
  protected _insertSeparatorPaginationItem(list: DocumentFragment, pageNumber: number) {
    const title = `на страницу ${pageNumber}`;

    list.append(
      PaginationAsyncAddressingMethodModifier._createPaginationItem(
        pageNumber,
        '...',
        this._paginationItemEventListenerObject.handlePaginationItemClick,
        ['pagination__item', 'pagination__item_out-of-range'],
        { title }
      )
    );

    return this;
  }
  protected _insertPaginationItemsBeforeTheLastSeparator(list: DocumentFragment) {
    // - Determine how many pages to show after the current page index
    let pageCutLow = this._state.activePage - 1;

    // - Determine how many pages to show before the current page index
    let pageCutHigh = this._state.activePage + 1;

    if (this._state.activePage === 1) {
      pageCutLow += 1;
      pageCutHigh += 1;
    }

    if (this._state.activePage >= this._options.pages) {
      pageCutLow -= 1;
      pageCutHigh = this._options.pages;
    }

    // eslint-disable-next-line no-loops/no-loops
    for (let page = pageCutLow; page <= pageCutHigh; page += 1) {
      const itemActiveClass = this._state.activePage === page ? 'pagination__item_active' : '';
      const title = this._state.activePage === page ? 'текущая страница' : `на страницу ${page}`;

      list.append(
        PaginationAsyncAddressingMethodModifier._createPaginationItem(
          page,
          `${page}`,
          this._paginationItemEventListenerObject.handlePaginationItemClick,
          ['pagination__item', itemActiveClass].filter((element) => element !== ''),
          { title }
        )
      );
    }

    return this;
  }
  protected _insertTheLastPagePaginationItem(list: DocumentFragment) {
    list.append(
      PaginationAsyncAddressingMethodModifier._createPaginationItem(
        this._options.pages,
        `${this._options.pages}`,
        this._paginationItemEventListenerObject.handlePaginationItemClick,
        ['pagination__item'],
        { title: `на страницу ${this._options.pages}` }
      )
    );

    return this;
  }
  protected _insertNextButtonPaginationItem(list: DocumentFragment) {
    list.append(
      PaginationAsyncAddressingMethodModifier._createPaginationItem(
        this._state.activePage + 1,
        'arrow_forward',
        this._paginationItemEventListenerObject.handlePaginationItemClick,
        ['pagination__item', 'pagination__item_next'],
        { title: 'на следующую страницу' }
      )
    );

    return this;
  }

  protected _renderPaginationCounter() {
    const counterFrom = (this._state.activePage - 1) * this._options.displayed + 1;
    const counterTo =
      this._state.activePage * this._options.displayed > this._options.total
        ? this._options.total
        : this._state.activePage * this._options.displayed;

    const counterToDigits = `${counterTo}`.length;
    const counterTotalDigits = `${this._options.total}`.length;

    const counterTotalText =
      counterTotalDigits > counterToDigits
        ? `${Math.floor(this._options.total / 10 ** counterToDigits) * 10 ** counterToDigits}+ `
        : `${this._options.total} `;
    const counterText = `${counterFrom} - ${counterTo} из ${counterTotalText}${this._options.text}`;

    // eslint-disable-next-line dot-notation
    this.component['_DOM'].counter.textContent = counterText;

    return this;
  }
}

const paginationAsyncAddressingMethodModifiers = paginations
  .filter((pagination) =>
    pagination.element.classList.contains('js-pagination_addressing-method_async')
  )
  .map((pagination) => new PaginationAsyncAddressingMethodModifier(pagination));

export type { PaginationAsyncAddressingMethodModifierCustomEvents };

export { paginationAsyncAddressingMethodModifiers as default };
