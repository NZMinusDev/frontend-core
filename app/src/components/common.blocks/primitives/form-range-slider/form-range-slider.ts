import { WindowHrefHelper } from "@utils/devTools/devTools";

import noUiSlider from "@library.blocks/primitives/form-range-slider/form-range-slider";

export const sliderContainers = document.querySelectorAll(".form-range-slider");

sliderContainers.forEach((sliderContainer: HTMLDivElement) => {
  const slider = sliderContainer.querySelector(".form-range-slider__slider") as HTMLDivElement;
  const result = sliderContainer.querySelector(".form-range-slider__result") as HTMLOutputElement;
  const inputFrom = sliderContainer.querySelector(`[name=${result.name}-from]`) as HTMLInputElement;
  const inputTo = sliderContainer.querySelector(`[name=${result.name}-to]`) as HTMLInputElement;

  noUiSlider.create(slider, {
    start: [parseFloat(inputFrom.value), parseFloat(inputTo.value)],
    range: { min: parseFloat(inputFrom.min), max: parseFloat(inputFrom.max) },
    connect: true, // Display colored bars between handles
    step: parseFloat(inputFrom.step),
  });

  slider.noUiSlider.on("update", (values: Array<string>) => {
    inputFrom.value = values[0];
    inputTo.value = values[values.length - 1];
    result.value =
      parseInt(values[0]).toLocaleString() +
      "₽" +
      " - " +
      parseInt(values[values.length - 1]).toLocaleString() +
      "₽";
  });

  if (sliderContainer.getAttribute("isFilter")) {
    slider.noUiSlider.on("change", (values: Array<string>) => {
      WindowHrefHelper.addValues(
        {
          name: inputFrom.getAttribute("name"),
          value: inputFrom.value,
        },
        {
          name: inputTo.getAttribute("name"),
          value: inputTo.value,
        }
      );
    });
  }
});
