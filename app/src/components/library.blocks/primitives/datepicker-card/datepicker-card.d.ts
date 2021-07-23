type LibAirDatepicker = {
  classes?: string;
  prevHtml?: string;
  nextHtml?: string;
  dateFormat?: string;
  // eslint-disable-next-line no-use-before-define
  altField?: string | JQuery<HTMLElement>;
  altFieldDateFormat?: string;
  minDate?: Date;
  toggleSelected?: boolean;
  onSelect?: (formattedDate: string, date: Date | Array<Date> | '', inst) => void;
};

interface JQuery {
  datepicker(options?: LibAirDatepicker);
}
