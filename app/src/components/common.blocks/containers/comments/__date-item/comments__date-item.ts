// FIXME: предпочтительнее вынести на сервер, чтобы не передавать лишнюю библиотеку
import moment from "moment";

moment.locale("ru");

document
  .querySelectorAll(".comments__date-item time")
  .forEach((dateHTMLItem: HTMLParagraphElement) => {
    dateHTMLItem.textContent = moment(dateHTMLItem.getAttribute("datetime")).fromNow();
  });
