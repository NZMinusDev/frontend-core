import { diffDate, MS_IN_DAY } from "@utils/devTools/tools/DateHelper";

document.querySelectorAll(".comments__date-item time").forEach((dateHTMLItem) => {
  dateHTMLItem.textContent = `${Math.abs(
    diffDate(new Date(), new Date(dateHTMLItem.getAttribute("datetime") as string)) / MS_IN_DAY
  ).toFixed(0)} дней назад`;
});
