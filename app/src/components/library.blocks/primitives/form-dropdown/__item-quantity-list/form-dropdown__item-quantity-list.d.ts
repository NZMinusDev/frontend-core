interface JQuery {
  iqDropdown?: (options: LibIQDropdownOptions) => JQuery<HTMLElement>;
}
type LibIQDropdownOptions = {
  // max total items
  maxItems?: number;
  // min total items
  minItems?: number;
  // text to show on the dropdown override data-selection-text attribute
  selectionText?: string;
  // text to show for multiple items
  textPlural?: string;
  // optionally can use setSelectionText function to override selectionText
  setSelectionText?: (itemCount: { itemID: number }, totalItems: number) => string;
  // buttons to increment/decrement
  controls?: {
    position: string;
    displayCls: string;
    controlsCls: string;
    counterCls: string;
  };
  // fires when an item quantity changes
  onChange?: (id: string, itemCount: { itemID: number }, totalItems: number) => void;
  // return false to prevent an item decrement
  beforeDecrement?: (id: string, itemCount: { itemID: number }) => boolean;
  // return false to prevent an item increment
  beforeIncrement?: (id: string, itemCount: { itemID: number }) => boolean;
};
