const images = document.getElementsByTagName('img');
const sources = document.getElementsByTagName('source');

const isVisible = (elem: HTMLElement) => {
  const coords = elem.getBoundingClientRect();
  const windowHeight = document.documentElement.clientHeight;

  const topVisible = coords.top > 0 && coords.top < windowHeight;
  const bottomVisible = coords.bottom < windowHeight && coords.bottom > 0;

  return topVisible || bottomVisible;
};

const showVisible = () => {
  [...images].forEach((img) => {
    const realSrc = img.dataset.src;

    if (realSrc === undefined || realSrc === '') {
      return;
    }

    if (isVisible(img)) {
      // eslint-disable-next-line no-param-reassign
      img.src = realSrc;
      // eslint-disable-next-line no-param-reassign
      img.dataset.src = '';
    }
  });

  [...sources].forEach((source) => {
    const realSrcset = source.dataset.srcset;

    if (realSrcset === undefined || realSrcset === '') {
      return;
    }

    if (isVisible(source)) {
      // eslint-disable-next-line no-param-reassign
      source.srcset = realSrcset;
      // eslint-disable-next-line no-param-reassign
      source.dataset.srcset = '';
    }
  });
};

window.addEventListener('scroll', showVisible);
showVisible();
