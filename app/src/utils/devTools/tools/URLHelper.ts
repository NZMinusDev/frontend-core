export function addURLValues(...added: { name: string; value: string }[]): void {
  const locationURL = new URL(window.location.href);

  added.forEach((added) => {
    locationURL.searchParams.set(added.name, added.value);
  });

  window.location.href = locationURL.toString();
}
export function getURLValue(name: string): string | null {
  const locationURL = new URL(window.location.href);

  return locationURL.searchParams.get(name) || (locationURL.searchParams.has(name) ? "" : null);
}
