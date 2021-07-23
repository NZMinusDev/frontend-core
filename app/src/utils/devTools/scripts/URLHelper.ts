const addURLValues = (...added: { name: string; value: string }[]): void => {
  const locationURL = new URL(window.location.href);

  added.forEach((toAdd) => {
    locationURL.searchParams.set(toAdd.name, toAdd.value);
  });

  window.location.href = locationURL.toString();
};

const getURLValue = (name: string): string | undefined => {
  const locationURL = new URL(window.location.href);

  return (
    locationURL.searchParams.get(name) || (locationURL.searchParams.has(name) ? '' : undefined)
  );
};

export { addURLValues, getURLValue };
