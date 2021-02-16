const images = document.getElementsByTagName("img");
const sources = document.getElementsByTagName("source");

window.addEventListener("scroll", showVisible);
showVisible();
function isVisible(elem) {
  let coords = elem.getBoundingClientRect();
  let windowHeight = document.documentElement.clientHeight;

  let topVisible = coords.top > 0 && coords.top < windowHeight;
  let bottomVisible = coords.bottom < windowHeight && coords.bottom > 0;

  return topVisible || bottomVisible;
}
function showVisible() {
  for (let img of images) {
    let realSrc = img.dataset.src;
    if (!realSrc) continue;

    if (isVisible(img)) {
      img.src = realSrc;
      img.dataset.src = "";
    }
  }
  for (let source of sources) {
    let realSrcset = source.dataset.srcset;
    if (!realSrcset) continue;

    if (isVisible(source)) {
      source.srcset = realSrcset;
      source.dataset.srcset = "";
    }
  }
}
