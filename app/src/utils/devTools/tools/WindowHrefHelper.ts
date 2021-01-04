export interface ParsedURLData {
  href: string;
  params: URLSearchParams;
}

export function parseLocationURL(): ParsedURLData {
  return {
    href: window.location.href.split("?")[0],
    params: new URLSearchParams(window.location.search),
  };
}
export function addValues(...added: Array<{ name: string; value: string }>): void {
  const parsedURLData = parseLocationURL();

  added.forEach((added) => {
    parsedURLData.params.set(added.name, added.value);
  });

  window.location.href = parsedURLData.href + "?" + parsedURLData.params.toString();
}
export function getValue(name: string): string | null {
  const parsedURLData = parseLocationURL();

  return parsedURLData.params.get(name) || (parsedURLData.params.has(name) ? "" : null);
}
