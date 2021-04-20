export const EVENTS = [
  "fullscreenchange",
  "fullscreenerror",
  "abort",
  "animationcancel",
  "animationend",
  "animationiteration",
  "animationstart",
  "auxclick",
  "beforeinput",
  "blur",
  "cancel",
  "canplay",
  "canplaythrough",
  "change",
  "click",
  "close",
  "compositionend",
  "compositionstart",
  "compositionupdate",
  "contextmenu",
  "cuechange",
  "dblclick",
  "drag",
  "dragend",
  "dragenter",
  "dragexit",
  "dragleave",
  "dragover",
  "dragstart",
  "drop",
  "durationchange",
  "emptied",
  "ended",
  "error",
  "focus",
  "focusin",
  "focusout",
  "gotpointercapture",
  "input",
  "invalid",
  "keydown",
  "keypress",
  "keyup",
  "load",
  "loadeddata",
  "loadedmetadata",
  "loadstart",
  "lostpointercapture",
  "mousedown",
  "mouseenter",
  "mouseleave",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "pause",
  "play",
  "playing",
  "pointercancel",
  "pointerdown",
  "pointerenter",
  "pointerleave",
  "pointermove",
  "pointerout",
  "pointerover",
  "pointerup",
  "progress",
  "ratechange",
  "reset",
  "resize",
  "scroll",
  "securitypolicyviolation",
  "seeked",
  "seeking",
  "select",
  "selectionchange",
  "selectstart",
  "stalled",
  "submit",
  "suspend",
  "timeupdate",
  "toggle",
  "touchcancel",
  "touchend",
  "touchmove",
  "touchstart",
  "transitioncancel",
  "transitionend",
  "transitionrun",
  "transitionstart",
  "volumechange",
  "waiting",
  "wheel",
  "copy",
  "cut",
  "paste",
];

/**
 * `mouseenter` / `mouseleave` emulation with bubbling
 */
export function addGoodMouseOver(
  parent: HTMLElement,
  childSelector: string,
  { onmouseoverCallBack = () => {}, onmouseoutCallBack = () => {} } = {}
) {
  let currentElem: Element | null = null;

  parent.onmouseover = function (event: MouseEvent) {
    if (currentElem) return;

    const target = (event.target as HTMLElement).closest(childSelector);

    if (!target) return;

    if (!(event.currentTarget as HTMLElement).contains(target)) return;

    currentElem = target;

    onmouseoverCallBack();
  };

  parent.onmouseout = function (event: MouseEvent) {
    if (!currentElem) return;

    let relatedTarget = event.relatedTarget;

    while (relatedTarget) {
      if (relatedTarget == currentElem) return;

      relatedTarget = (relatedTarget as HTMLElement).parentNode;
    }

    currentElem = null;

    onmouseoutCallBack();
  };
}

/**
 *
 * @param element - element to make it DragAndDrop
 * @param droppableSelector - selector of the another element where you need have access to place element
 * @param enterDroppable - callback with logic when you enter place of dropping
 * @param leaveDroppable - callback with logic when you leave place of dropping
 * @link https://learn.javascript.ru/mouse-drag-and-drop
 */
export function addDragAndDrop(
  element: HTMLElement,
  {
    droppableSelector = "[data-droppable]",
    enterDroppable = (currentDroppable: HTMLElement) => {},
    leaveDroppable = (currentDroppable: HTMLElement) => {},
  } = {}
) {
  element.onmousedown = function (event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = "absolute";
    element.style.zIndex = "1000";
    document.body.append(element);

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
      element.style.left = pageX - shiftX + "px";
      element.style.top = pageY - shiftY + "px";
    }

    // потенциальная цель переноса, над которой мы пролетаем прямо сейчас
    let currentDroppable: HTMLElement | null = null;

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);

      element.hidden = true;
      let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
      element.hidden = false;

      if (!elemBelow) return;

      let droppableBelow = elemBelow.closest(droppableSelector);

      if (currentDroppable != droppableBelow) {
        if (currentDroppable) {
          leaveDroppable(currentDroppable);
        }
        currentDroppable = droppableBelow as HTMLElement;
        if (currentDroppable) {
          enterDroppable(currentDroppable);
        }
      }
    }

    document.addEventListener("mousemove", onMouseMove);

    element.onmouseup = function () {
      document.removeEventListener("mousemove", onMouseMove);
      element.onmouseup = null;
    };
  };

  element.ondragstart = function () {
    return false;
  };
  element.style.touchAction = "none";
}
