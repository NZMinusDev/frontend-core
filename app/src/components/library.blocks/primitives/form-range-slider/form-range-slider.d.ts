type Formatter = { to: (val: number) => string; from: (val: string) => number };
interface noUiSlider {
  create(
    container: HTMLElement,
    options: {
      start?: string | string[];
      range?: { [key: string]: number };
      snap?: boolean;
      connect?: 'lower' | 'upper' | true | false | boolean[];
      margin?: number;
      limit?: number;
      padding?: number | [number, number];
      step?: number;
      orientation?: 'vertical' | 'horizontal';
      direction?: 'ltr' | 'rtl';
      tooltips?: boolean | Formatter | (boolean | Formatter)[];
      animate?: boolean;
      behaviour?: string;
      format?: Formatter;
      ariaFormat?: Formatter;
      pips?: {
        mode?: 'range' | 'steps' | 'positions' | 'count' | 'values';
        density?: number;
        filter?: (val: number, type: number) => number;
        format?: Formatter;
        values?: number | number[];
        stepped?: boolean;
      };
      keyboardSupport?: boolean;
      keyboardPageMultiplier?: number;
      keyboardDefaultStep?: number;
      documentElement?: HTMLElement | DocumentFragment;
      cssPrefix?: string;
      cssClasses?: string;
    }
  );
  on(
    eventName: string,
    callback: (
      values: string[],
      handle: number,
      unencoded: number[],
      tap: boolean,
      positions: number[],
      // eslint-disable-next-line no-shadow
      noUiSlider: noUiSlider
    ) => void
  );
}

declare const noUiSlider: noUiSlider;

export { noUiSlider as default };
