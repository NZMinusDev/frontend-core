import {
  BEMComponent,
  HTMLElementWithComponent,
} from '@utils/devTools/scripts/ComponentCreationHelper';

type SlideshowElement = HTMLDivElement;

// eslint-disable-next-line @typescript-eslint/ban-types
type SlideshowCustomEvents = {};

class Slideshow extends BEMComponent<SlideshowElement, SlideshowCustomEvents> {
  // eslint-disable-next-line no-useless-constructor
  constructor(slideshowElement: SlideshowElement) {
    super(slideshowElement);
  }
}

type SlideshowElementWithComponent = HTMLElementWithComponent<
  SlideshowElement,
  SlideshowCustomEvents,
  Slideshow
>;

const slideshows = Array.from(
  document.querySelectorAll<SlideshowElement>('.js-slideshow'),
  (slideshowElement) => new Slideshow(slideshowElement)
);

export type { SlideshowCustomEvents, Slideshow, SlideshowElementWithComponent };

export { slideshows as default };
