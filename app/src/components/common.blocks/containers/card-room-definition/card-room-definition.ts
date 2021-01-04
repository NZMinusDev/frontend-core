import {
  DatepickerDropdownElement,
  AltDatepickerDropdownElement,
} from "@common.blocks/primitives/form-dropdown/__datepicker/form-dropdown__datepicker";

const MS_IN_DAY = 1000 * 60 * 60 * 24;
const CURRENCY = "₽";

$(function () {
  const cards = $(".card-room-definition");
  cards.each(function (index) {
    const dayPaymentValue = parseFloat(
      $(this).find(".card-room-definition__day-payment").attr("data-amount-js")
    );

    const $paymentRates = $(this).find(".card-room-definition__payment-rates");
    const paymentAmounts = $paymentRates.find(".card-room-definition__payment-amount");

    const $totalDayPaymentSentence = $paymentRates.find(
      ".card-room-definition__total-day-payment .card-room-definition__payment-sentence"
    );
    const $totalDayPaymentAmount = $paymentRates.find(
      ".card-room-definition__total-day-payment .card-room-definition__payment-amount"
    );

    const $totalPaymentAmount = $(this).find(".card-room-definition__total-payment-amount");

    const arrivalDropdown = this.querySelector(
      ".card-room-definition__arrival-date-dropdown"
    ) as DatepickerDropdownElement;
    const departureDropdown = this.querySelector(
      ".card-room-definition__departure-date-dropdown"
    ) as AltDatepickerDropdownElement;

    const updatePaymentDisplay = () => {
      const days =
        Math.floor(
          Math.abs(
            Date.parse(departureDropdown.altDatepickerDropdown.dom.input.value) -
              Date.parse(arrivalDropdown.datepickerDropdown.dom.cardDatepickerDOM.input.value)
          ) / MS_IN_DAY
        ) + 1;

      $totalDayPaymentSentence.text(
        `${dayPaymentValue.toLocaleString()}${CURRENCY} x ${days.toLocaleString()} суток`
      );
      $totalDayPaymentAmount.text(`${(dayPaymentValue * days).toLocaleString()}${CURRENCY}`);
      $totalDayPaymentAmount.attr("data-amount-js", dayPaymentValue * days);

      let accumulator = 0;
      paymentAmounts.each(function () {
        accumulator += parseFloat($(this).attr("data-amount-js"));
      });
      $totalPaymentAmount.text(`${accumulator.toLocaleString()}${CURRENCY}`);
      $totalPaymentAmount.attr("data-amount-js", accumulator);
    };
    updatePaymentDisplay();

    arrivalDropdown.addEventListener("change", (event) => {
      updatePaymentDisplay();
    });
    departureDropdown.addEventListener("change", (event) => {
      updatePaymentDisplay();
    });
  });
});
