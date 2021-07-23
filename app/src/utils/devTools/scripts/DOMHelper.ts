const has = (
  elements: NodeListOf<Element> | HTMLCollection | Element[],
  contained: string | Element
): Element | undefined => {
  const copiedElements = [...elements];

  if (typeof contained === 'string') {
    return copiedElements.find((element) => element.querySelector(contained));
  }

  return copiedElements.find((element) => element.contains(contained));
};

const hasAll = (
  elements: NodeListOf<Element> | HTMLCollection | Element[],
  contained: string | Element
): Element[] | undefined => {
  const copiedElements = [...elements];
  let isHas: Element[] = [];

  if (typeof contained === 'string') {
    isHas = copiedElements.filter((element) => element.querySelector(contained));
  } else {
    isHas = copiedElements.filter((element) => element.contains(contained));
  }

  return isHas.length > 0 ? isHas : undefined;
};

/** Cross-browsers document.documentElement.scrollHeight/scrollWidth */
const getDocumentSizes = () => ({
  scrollHeight: Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  ),
  scrollWidth: Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollWidth,
    document.body.offsetHeight,
    document.documentElement.offsetWidth,
    document.body.clientHeight,
    document.documentElement.clientWidth
  ),
});

const getWindowSizes = () => ({
  // window doesn't take into account scrollbar
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
});

const isHidden = (elem: HTMLElement) => !elem.offsetWidth && !elem.offsetHeight;

const setFullHeight = (element: HTMLElement) => {
  // eslint-disable-next-line no-param-reassign
  element.style.height = `${element.scrollHeight}px`;
};

// eslint-disable-next-line no-shadow
enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
}

/**
 * Cross-browsers(be aware of https://bugs.webkit.org/show_bug.cgi?id=5991 and use document.body instead of document.documentElement for old browsers only) extended scrollTo
 */
const scrollTo = (
  element: HTMLElement,
  pageX: number | Direction.Left | Direction.Right,
  pageY: number | Direction.Up | Direction.Down
) => {
  if (typeof pageX === 'number') {
    // eslint-disable-next-line no-param-reassign
    element.scrollLeft = pageX;
  } else {
    switch (pageX) {
      case Direction.Left: {
        // eslint-disable-next-line no-param-reassign
        element.scrollLeft = 0;

        break;
      }
      case Direction.Right: {
        // eslint-disable-next-line no-param-reassign
        element.scrollLeft = Infinity;

        break;
      }

      // no default
    }
  }

  if (typeof pageY === 'number') {
    // eslint-disable-next-line no-param-reassign
    element.scrollTop = pageY;
  } else {
    switch (pageY) {
      case Direction.Up: {
        // eslint-disable-next-line no-param-reassign
        element.scrollTop = 0;

        break;
      }
      case Direction.Down: {
        // eslint-disable-next-line no-param-reassign
        element.scrollTop = Infinity;

        break;
      }

      // no default
    }
  }
};

/**
 * Cross-browsers(be aware of https://bugs.webkit.org/show_bug.cgi?id=5991 and use document.body instead of document.documentElement for old browsers only) scrollBy
 */
const scrollBy = (element: HTMLElement, x: number, y: number) => {
  // eslint-disable-next-line no-param-reassign
  element.scrollLeft += x;
  // eslint-disable-next-line no-param-reassign
  element.scrollTop += y;
};

const freezeScroll = (element: HTMLElement, { shouldFreeze = true } = {}) => {
  if (shouldFreeze) {
    const clientWidthBeforeFreeze = element.clientWidth;
    // eslint-disable-next-line no-param-reassign
    element.style.overflow = 'hidden';

    // vanished scrollbar size
    // eslint-disable-next-line no-param-reassign
    element.style.padding += element.clientWidth - clientWidthBeforeFreeze;
  } else {
    // eslint-disable-next-line no-param-reassign
    element.style.overflow = '';
  }
};

/**
 * @returns proper css coordinates for position:absolute
 *
 */
const getCoordinatesOfAbsoluteElement = (element: HTMLElement) => {
  const DOMRect = element.getBoundingClientRect();

  return {
    top: DOMRect.top + window.pageYOffset,
    right: document.documentElement.clientWidth - DOMRect.right + window.pageYOffset,
    left: DOMRect.left + window.pageXOffset,
    bottom: document.documentElement.clientHeight - DOMRect.bottom + window.pageXOffset,
  };
};

const place = (element: HTMLElement, { position = 'absolute' } = {}) => {
  // eslint-disable-next-line no-param-reassign
  element.style.position = position;

  const coords =
    position === 'absolute'
      ? getCoordinatesOfAbsoluteElement(element)
      : element.getBoundingClientRect();

  // eslint-disable-next-line no-param-reassign
  element.style.left = `${coords.left}px`;
  // eslint-disable-next-line no-param-reassign
  element.style.top = `${coords.bottom}px`;
};

/**
 *
 * @param src
 * @param callback
 * @example
 * // example 1
 * let promise = loadScript("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js");
 *
 * promise.then(
 *  script => alert(`${script.src} loaded!`),
 *  error => alert(`Error: ${error.message}`)
 * );
 *
 * promise.then(script => alert('Another handler...'));
 *
 * // example 2
 * loadScript("/article/promise-chaining/one.js")
 *  .then(script => loadScript("/article/promise-chaining/two.js"))
 *  .then(script => loadScript("/article/promise-chaining/three.js"))
 *  .then(script => {
 *    // the scripts are loaded, we can use the functions declared in them
 *    one();
 *    two();
 *    three();
 * });
 *
 */
const loadScript = (src: URL) =>
  new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.src = src.toString();

    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Script loading error ${src}`));

    document.head.append(script);
  });

export {
  has,
  hasAll,
  getDocumentSizes,
  getWindowSizes,
  isHidden,
  setFullHeight,
  scrollTo,
  scrollBy,
  freezeScroll,
  getCoordinatesOfAbsoluteElement,
  place,
  loadScript,
};
