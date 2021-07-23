import {
  BEMComponent,
  HTMLElementWithComponent,
} from '@utils/devTools/scripts/ComponentCreationHelper';
import '@utils/devTools/styles/preload-stop-transition.scss';

import slideshows from '../slideshow';

type SlideshowPictureElement = HTMLDivElement;

// eslint-disable-next-line @typescript-eslint/ban-types
type SlideshowPictureCustomEvents = {};

class SlideshowPicture extends BEMComponent<SlideshowPictureElement, SlideshowPictureCustomEvents> {
  constructor(slideshowPictureElement: SlideshowPictureElement) {
    super(slideshowPictureElement);

    this._initDisplay();
  }

  protected _initDisplay() {
    this._addPreloadStopTransition();

    return this;
  }

  protected _addPreloadStopTransition() {
    const transitionDuration = 2000;

    this.element.classList.add('preload-stop-transition');
    setTimeout(() => {
      this.element.classList.remove('preload-stop-transition');
    }, transitionDuration);
  }
}

type SlideshowPictureElementWithComponent = HTMLElementWithComponent<
  SlideshowPictureElement,
  SlideshowPictureCustomEvents,
  SlideshowPicture
>;

const slideshowPictures = slideshows
  .map((slideshow) =>
    Array.from(
      slideshow.element.querySelectorAll<SlideshowPictureElement>('.js-slideshow__picture'),
      (slideshowPictureElement) => new SlideshowPicture(slideshowPictureElement)
    )
  )
  .flat();

export type {
  SlideshowPictureCustomEvents,
  SlideshowPicture,
  SlideshowPictureElementWithComponent,
};

export { slideshowPictures as default };
