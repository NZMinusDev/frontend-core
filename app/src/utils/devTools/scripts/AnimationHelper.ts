/**
 *
 * @param drawCallBack
 * @param duration
 * @param timing - calculating the current animation state function
 * @example
 * animate(
 * (progress) => { // draw
 *    elem.style.width = `${progress * 100}%`;
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
const animate = (
  drawCallBack: (progress: number) => unknown,
  duration: number,
  { timing = (timeFraction: number) => timeFraction } = {}
) => {
  const start = performance.now();

  const newAnimate = (time) => {
    let timeFraction = (time - start) / duration;

    if (timeFraction > 1) {
      timeFraction = 1;
    }

    const progress = timing(timeFraction);

    drawCallBack(progress);

    if (timeFraction < 1) {
      window.requestAnimationFrame(newAnimate);
    }
  };

  window.requestAnimationFrame(newAnimate);
};

const power = (timeFraction: number, { pow = 2 } = {}) => timeFraction ** pow;

const circ = (timeFraction: number) => 1 - Math.sin(Math.acos(timeFraction));

const shotFromABow = (x: number, timeFraction: number) =>
  timeFraction ** 2 * ((x + 1) * timeFraction - x);

const bounce = (timeFraction: number) => {
  // eslint-disable-next-line no-loops/no-loops
  for (let a = 0, b = 1; 1; a += b, b /= 2) {
    if (timeFraction >= (7 - 4 * a) / 11) {
      return -(((11 - 6 * a - 11 * timeFraction) / 4) ** 2) + b ** 2;
    }
  }

  return timeFraction;
};

const elastic = (x, timeFraction) =>
  2 ** (10 * (timeFraction - 1)) * Math.cos(((20 * Math.PI * x) / 3) * timeFraction);

/**
 * Jumping animation of typing text
 */
const animateTextArea = (textArea: HTMLTextAreaElement) => {
  const text = textArea.value;
  const to = text.length;
  const from = 0;

  animate(
    (progress) => {
      const result = (to - from) * progress + from;
      // eslint-disable-next-line no-param-reassign
      textArea.value = text.substr(0, Math.ceil(result));
    },
    5000,
    { timing: bounce }
  );
};

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
const makeEaseOut = (timingFunction: (timeFraction: number) => number) => (timeFraction: number) =>
  1 - timingFunction(1 - timeFraction);

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
const makeEaseInOut = (timingFunction: (timeFraction: number) => number) => (
  timeFraction: number
) => {
  if (timeFraction < 0.5) {
    return timingFunction(2 * timeFraction) / 2;
  }

  return (2 - timingFunction(2 * (1 - timeFraction))) / 2;
};

export {
  animate,
  power,
  circ,
  shotFromABow,
  bounce,
  elastic,
  animateTextArea,
  makeEaseOut,
  makeEaseInOut,
};
