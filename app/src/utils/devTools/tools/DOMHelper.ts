export function has(
  elements: NodeListOf<Element> | HTMLCollection | Element[],
  contained: string | Element
): Element | undefined {
  if (typeof contained === "string") {
    return Array.from(elements).find((element) => element.querySelector(contained));
  } else {
    return Array.from(elements).find((element) => element.contains(contained));
  }
}
export function hasAll(
  elements: NodeListOf<Element> | HTMLCollection | Element[],
  contained: string | Element
): Element[] | undefined {
  let isHas: Element[] = [];
  if (typeof contained === "string") {
    isHas = Array.from(elements).filter((element) => element.querySelector(contained));
  } else {
    isHas = Array.from(elements).filter((element) => element.contains(contained));
  }

  return isHas.length > 0 ? isHas : undefined;
}

/** Cross-browsers document.documentElement.scrollHeight/scrollWidth */
export function getDocumentSizes() {
  return {
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
  };
}
export function getWindowSizes() {
  return {
    width: document.documentElement.clientWidth, // window doesn't take into account scrollbar
    height: document.documentElement.clientHeight,
  };
}
export function isHidden(elem: HTMLElement) {
  return !elem.offsetWidth && !elem.offsetHeight;
}
/** @see module:PluginCreation/eventMixin */
export function setFullHeight(element: HTMLElement) {
  element.style.height = `${element.scrollHeight}px`;
}
enum Direction {
  Up = "Up",
  Down = "Down",
  Left = "Left",
  Right = "Right",
}
/**
 * Cross-browsers(be aware of https://bugs.webkit.org/show_bug.cgi?id=5991 and use document.body instead of document.documentElement for old browsers only) extended scrollTo
 * @see module:PluginCreation/eventMixin
 */
export function scrollTo(
  element: HTMLElement,
  pageX: number | Direction.Left | Direction.Right,
  pageY: number | Direction.Up | Direction.Down
) {
  if (typeof pageX === "number") {
    element.scrollLeft = pageX;
  } else {
    switch (pageX) {
      case Direction.Left: {
        element.scrollLeft = 0;
        break;
      }
      case Direction.Right: {
        element.scrollLeft = Infinity;
        break;
      }
    }
  }
  if (typeof pageY === "number") {
    element.scrollTop = pageY;
  } else {
    switch (pageY) {
      case Direction.Up: {
        element.scrollTop = 0;
        break;
      }
      case Direction.Down: {
        element.scrollTop = Infinity;
        break;
      }
    }
  }
}
/**
 * Cross-browsers(be aware of https://bugs.webkit.org/show_bug.cgi?id=5991 and use document.body instead of document.documentElement for old browsers only) scrollBy
 * @see module:PluginCreation/eventMixin
 */
export function scrollBy(element: HTMLElement, x: number, y: number) {
  element.scrollLeft += x;
  element.scrollTop += y;
}
/** @see module:PluginCreation/eventMixin */
export function freezeScroll(element: HTMLElement, { freeze = true } = {}) {
  if (freeze === true) {
    const clientWidthBeforeFreeze = element.clientWidth;
    element.style.overflow = "hidden";
    element.style.padding += element.clientWidth - clientWidthBeforeFreeze; // vanished scrollbar size
  } else {
    element.style.overflow = "";
  }
}
/**
 * @returns proper css coordinates for position:absolute
 * @see module:PluginCreation/eventMixin
 * */
export function getCoordinatesOfAbsoluteElement(element: HTMLElement) {
  const DOMRect = element.getBoundingClientRect();

  return {
    top: DOMRect.top + pageYOffset,
    right: document.documentElement.clientWidth - DOMRect.right + pageYOffset,
    left: DOMRect.left + pageXOffset,
    bottom: document.documentElement.clientHeight - DOMRect.bottom + pageXOffset,
  };
}
/** @see module:PluginCreation/eventMixin */
export function place(element: HTMLElement, { position = "absolute" } = {}) {
  element.style.position = position;

  let coords =
    position === "absolute"
      ? getCoordinatesOfAbsoluteElement(element)
      : element.getBoundingClientRect(); // fixed

  element.style.left = coords.left + "px";
  element.style.top = coords.bottom + "px";
}

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
export function loadScript(src: URL) {
  return new Promise(function (resolve, reject) {
    let script = document.createElement("script");
    script.src = src.toString();

    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Script loading error ${src}`));

    document.head.append(script);
  });
}
