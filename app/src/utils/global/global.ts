import { WindowHrefHelper } from "@utils/devTools/devTools";

document.querySelectorAll("input").forEach((element) => {
  const inputElement = element as HTMLInputElement;
  const hrefValue = WindowHrefHelper.getValue(inputElement.getAttribute("name")) as string;

  if (hrefValue) {
    switch (inputElement.type) {
      case "radio": {
        inputElement.checked = inputElement.value === hrefValue;
        break;
      }
      case "checkbox": {
        inputElement.checked = hrefValue === "on";
        break;
      }
      default: {
        inputElement.value = hrefValue;
      }
    }
  }

  switch (inputElement.type) {
    case "checkbox": {
      inputElement.addEventListener("change", function () {
        this.value = this.checked ? "on" : "off";
      });
    }
  }

  if (inputElement.getAttribute("isFilter")) {
    inputElement.addEventListener("change", (event) => {
      WindowHrefHelper.addValues({
        name: inputElement.getAttribute("name"),
        value: inputElement.value,
      });
    });
  }
});
