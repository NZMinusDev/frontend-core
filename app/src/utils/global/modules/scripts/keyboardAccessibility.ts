document.addEventListener("keydown", function (event) {
  if (!event.repeat && document.activeElement !== null && event.code === "Enter") {
    (document.activeElement as HTMLElement).click();
  }
});
