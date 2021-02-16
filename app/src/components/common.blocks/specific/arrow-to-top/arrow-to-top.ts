const arrowToTop = document.querySelector(".arrow-to-top");
if (arrowToTop) {
  (arrowToTop as HTMLElement).addEventListener("click", function () {
    window.scrollTo(pageXOffset, 0);
  });

  window.addEventListener("scroll", function () {
    (arrowToTop as HTMLElement).hidden = pageYOffset < document.documentElement.clientHeight;
  });
}
