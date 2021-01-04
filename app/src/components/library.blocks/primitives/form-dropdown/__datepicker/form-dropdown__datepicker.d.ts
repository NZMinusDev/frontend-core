interface JQuery {
  datepicker(options?: LibAirDatepicker);
}
type LibAirDatepicker = {
  classes?: string;
  prevHtml?: string;
  nextHtml?: string;
  dateFormat?: string;
  altField?: string | JQuery<HTMLElement>;
  altFieldDateFormat?: string;
  minDate?: Date;
  toggleSelected?: boolean;
  onSelect?: (formattedDate: string, date: Array<Date>, inst: object) => void;
};
