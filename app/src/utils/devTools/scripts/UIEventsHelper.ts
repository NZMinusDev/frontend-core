/**
 * `mouseenter` / `mouseleave` emulation with bubbling
 */
const addGoodMouseOver = (
  parent: HTMLElement,
  childSelector: string,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  { onmouseoverCallBack = () => {}, onmouseoutCallBack = () => {} } = {}
) => {
  let currentElem: Element | null = null;

  const onMouseOver = (event: MouseEvent) => {
    if (currentElem !== null) {
      return;
    }

    const target = (event.target as HTMLElement).closest(childSelector);

    if (target === null || !(event.currentTarget as HTMLElement).contains(target)) {
      return;
    }

    currentElem = target;

    onmouseoverCallBack();
  };

  const onMouseOut = (event: MouseEvent) => {
    if (currentElem === null) {
      return;
    }

    let { relatedTarget } = event;

    // eslint-disable-next-line no-loops/no-loops
    while (relatedTarget) {
      if (relatedTarget === currentElem) {
        return;
      }

      relatedTarget = (relatedTarget as HTMLElement).parentNode;
    }

    currentElem = null;

    onmouseoutCallBack();
  };

  parent.addEventListener('mouseover', onMouseOver);
  parent.addEventListener('mouseout', onMouseOut);
};

/**
 *
 * @param element - element to make it DragAndDrop
 * @param droppableSelector - selector of the another element where you need have access to place element
 * @param enterDroppable - callback with logic when you enter place of dropping
 * @param leaveDroppable - callback with logic when you leave place of dropping
 * @link https://learn.javascript.ru/mouse-drag-and-drop
 */
const addDragAndDrop = (
  element: HTMLElement,
  {
    droppableSelector = '[data-droppable]',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    enterDroppable = (currentDroppable: Element) => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    leaveDroppable = (currentDroppable: Element) => {},
  } = {}
) => {
  const onMouseDown = (event) => {
    const shiftX = event.clientX - element.getBoundingClientRect().left;
    const shiftY = event.clientY - element.getBoundingClientRect().top;

    // eslint-disable-next-line no-param-reassign
    element.style.position = 'absolute';
    // eslint-disable-next-line no-param-reassign
    element.style.zIndex = '1000';
    document.body.append(element);

    const moveAt = (pageX, pageY) => {
      // eslint-disable-next-line no-param-reassign
      element.style.left = `${pageX - shiftX}px`;
      // eslint-disable-next-line no-param-reassign
      element.style.top = `${pageY - shiftY}px`;
    };

    moveAt(event.pageX, event.pageY);

    // потенциальная цель переноса, над которой мы пролетаем прямо сейчас
    let currentDroppable: Element | null = null;

    // eslint-disable-next-line no-shadow
    const onMouseMove = (event) => {
      moveAt(event.pageX, event.pageY);

      // eslint-disable-next-line no-param-reassign
      element.hidden = true;
      const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
      // eslint-disable-next-line no-param-reassign
      element.hidden = false;

      if (elemBelow === null) {
        return;
      }

      const droppableBelow = elemBelow.closest(droppableSelector);

      if (currentDroppable !== droppableBelow) {
        if (currentDroppable !== null) {
          leaveDroppable(currentDroppable);
        }

        currentDroppable = droppableBelow;

        if (currentDroppable !== null) {
          enterDroppable(currentDroppable);
        }
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseup', onMouseUp);
  };

  element.addEventListener('mousedown', onMouseDown);

  const onDragStart = () => false;

  element.addEventListener('dragstart', onDragStart);

  // eslint-disable-next-line no-param-reassign
  element.style.touchAction = 'none';
};

export { addGoodMouseOver, addDragAndDrop };
