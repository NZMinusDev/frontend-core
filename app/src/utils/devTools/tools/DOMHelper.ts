export function has(
  elements: NodeListOf<Element> | HTMLCollection | Array<Element>,
  contained: string | Element
): Element | undefined {
  if (typeof contained === "string") {
    return Array.from(elements).find((element) => element.querySelector(contained));
  } else {
    return Array.from(elements).find((element) => element.contains(contained));
  }
}

export function hasAll(
  elements: NodeListOf<Element> | HTMLCollection | Array<Element>,
  contained: string | Element
): Element[] | undefined {
  let isHas = [];
  if (typeof contained === "string") {
    isHas = Array.from(elements).filter((element) => element.querySelector(contained));
  } else {
    isHas = Array.from(elements).filter((element) => element.contains(contained));
  }

  return isHas.length > 0 ? isHas : undefined;
}
