// https://github.com/kulshekhar/ts-jest/issues/1035#issuecomment-486442977 and https://github.com/jsdom/jsdom/pull/2666#issuecomment-691216178
if (!global.PointerEvent) {
  class PointerEvent extends MouseEvent {
    public height?: number;

    public isPrimary?: boolean;

    public pointerId?: number;

    public pointerType?: string;

    public pressure?: number;

    public tangentialPressure?: number;

    public tiltX?: number;

    public tiltY?: number;

    public twist?: number;

    public width?: number;

    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      // FIXME: mouse props: hard to say why params aren't set by MouseEvent constructor call
      (this.movementX as any) = params.movementX ?? 0;
      (this.movementY as any) = params.movementY ?? 0;

      // pointer props
      this.pointerId = params.pointerId;
      this.width = params.width;
      this.height = params.height;
      this.pressure = params.pressure;
      this.tangentialPressure = params.tangentialPressure;
      this.tiltX = params.tiltX;
      this.tiltY = params.tiltY;
      this.pointerType = params.pointerType;
      this.isPrimary = params.isPrimary;
    }
  }

  global.PointerEvent = PointerEvent as any;
}
