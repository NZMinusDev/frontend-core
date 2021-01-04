document.querySelectorAll(".form-like-button__button").forEach((btn) => {
  btn.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;

    target.dataset.counter = target.checked
      ? parseInt(target.dataset.counter) + 1 + ""
      : parseInt(target.dataset.counter) - 1 + "";
  });
});
