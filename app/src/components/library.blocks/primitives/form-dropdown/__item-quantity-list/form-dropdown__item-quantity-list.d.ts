type LibItemQuantityListOptions = {
  // eslint-disable-next-line lines-around-comment
  // max total items
  maxItems?: number;

  // min total items
  minItems?: number;

  // text to show on the dropdown override data-selection-text attribute
  selectionText?: string;

  // text to show for multiple items
  textPlural?: string;

  // optionally can use setSelectionText function to override selectionText
  setSelectionText?: (itemCount: { [itemID: string]: number }, totalItems: number) => string;

  // buttons to increment/decrement
  controls?: {
    position: string;
    displayCls: string;
    controlsCls: string;
    counterCls: string;
  };

  // fires when an item quantity changes
  onChange?: (id: string, itemCount: { [itemID: string]: number }, totalItems: number) => void;

  // return false to prevent an item decrement
  beforeDecrement?: (id: string, itemCount: { [itemID: string]: number }) => boolean;

  // return false to prevent an item increment
  beforeIncrement?: (id: string, itemCount: { [itemID: string]: number }) => boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface JQuery {
  iqDropdown: (options: LibItemQuantityListOptions) => JQuery<HTMLElement>;
}
