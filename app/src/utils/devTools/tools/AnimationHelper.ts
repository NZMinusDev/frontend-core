/**
 *
 * @param drawCallBack
 * @param duration
 * @param timing - calculating the current animation state function
 * @example
 * animate(
 * (progress) => { // draw
 *    elem.style.width = progress * 100 + '%';
 *  }
 *  1000, // duration
 *  {timing: (timeFraction) => { // parabolic curve timing function
 *    return Math.pow(timeFraction, 2)
 *  }},
 * );
 *
 * // timing functions(but you can pass your own):
 * function circ(timeFraction) { return 1 - Math.sin(Math.acos(timeFraction)); }
 * function shotFromABow(x, timeFraction) { return Math.pow(timeFraction, 2) * ((x + 1) * timeFraction - x) }
 * function bounce(timeFraction) {
 *   for (let a = 0, b = 1; 1; a += b, b /= 2) {
 *     if (timeFraction >= (7 - 4 * a) / 11) {
 *       return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
 *     }
 *   }
 * }
 * function elastic(x, timeFraction) {
 *   return Math.pow(2, 10 * (timeFraction - 1)) * Math.cos(20 * Math.PI * x / 3 * timeFraction)
 * }
 */
export function animate(
  drawCallBack: (progress: number) => unknown,
  duration: number,
  { timing = (timeFraction: number) => timeFraction } = {}
) {
  let start = performance.now();

  requestAnimationFrame(function animate(time) {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    let progress = timing(timeFraction);

    drawCallBack(progress);

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
  });
}

export function power(timeFraction, {power = 2} = {}) { 
      return Math.pow(timeFraction, power)
    }
export function circ(timeFraction) {
  return 1 - Math.sin(Math.acos(timeFraction));
}
export function shotFromABow(x, timeFraction) {
  return Math.pow(timeFraction, 2) * ((x + 1) * timeFraction - x);
}
export function bounce(timeFraction) {
  for (let a = 0, b = 1; 1; a += b, b /= 2) {
    if (timeFraction >= (7 - 4 * a) / 11) {
      return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2);
    }
  }
}
export function elastic(x, timeFraction) {
  return Math.pow(2, 10 * (timeFraction - 1)) * Math.cos(((20 * Math.PI * x) / 3) * timeFraction);
}

/**
 * Jumping animation of typing text
 */
export function animateTextArea(textArea: HTMLTextAreaElement) {
  let text = textArea.value;
  let to = text.length,
    from = 0;

  animate(
    (progress) => {
      let result = (to - from) * progress + from;
      textArea.value = text.substr(0, Math.ceil(result));
    },
    5000,
    { timing: bounce }
  );

  function bounce(timeFraction: number): number {
    for (let a = 0, b = 1, result; 1; a += b, b /= 2) {
      if (timeFraction >= (7 - 4 * a) / 11) {
        return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2);
      }
    }

    return 0;
  }
}

/**
 *
 * @param timing - easeIn function
 * @returns easeOut function
 * @example
 * function bounce(timeFraction) {
 *   for (let a = 0, b = 1, result; 1; a += b, b /= 2) {
 *     if (timeFraction >= (7 - 4 * a) / 11) {
 *       return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
 *     }
 *   }
 * }
 *
 * let bounceEaseOut = makeEaseOut(bounce);
 */
export function makeEaseOut(timingFunction: (timeFraction: number) => number) {
  return function (timeFraction: number) {
    return 1 - timingFunction(1 - timeFraction);
  };
}
/**
 *
 * @param timing - easeIn function
 * @returns easeInOut function
 * @example
 * function bounce(timeFraction) {
 *   for (let a = 0, b = 1, result; 1; a += b, b /= 2) {
 *     if (timeFraction >= (7 - 4 * a) / 11) {
 *       return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
 *     }
 *   }
 * }
 *
 * let bounceEaseInOut = makeEaseInOut(bounce);
 */
export function makeEaseInOut(timingFunction: (timeFraction: number) => number) {
  return function (timeFraction: number) {
    if (timeFraction < 0.5) return timingFunction(2 * timeFraction) / 2;
    else return (2 - timingFunction(2 * (1 - timeFraction))) / 2;
  };
}
