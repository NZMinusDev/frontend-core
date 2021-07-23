const onKeyDown = (event) => {
  const isActive = !event.repeat && document.activeElement !== null;

  if (isActive && event.code === 'Enter') {
    (document.activeElement as HTMLElement).click();
  }
};

document.addEventListener('keydown', onKeyDown);
