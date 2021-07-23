import {
  BEMComponent,
  HTMLElementWithComponent,
} from '@utils/devTools/scripts/ComponentCreationHelper';

type NavBarElement = HTMLElement;

// eslint-disable-next-line @typescript-eslint/ban-types
type NavBarCustomEvents = {};

class NavBar extends BEMComponent<NavBarElement, NavBarCustomEvents> {
  // eslint-disable-next-line no-useless-constructor
  constructor(navBarElement: NavBarElement) {
    super(navBarElement);
  }
}

type NavBarElementWithComponent = HTMLElementWithComponent<
  NavBarElement,
  NavBarCustomEvents,
  NavBar
>;

const navBars = Array.from(
  document.querySelectorAll('.js-nav-bar') as NodeListOf<NavBarElement>,
  (navBarElement) => new NavBar(navBarElement)
);

export type { NavBarCustomEvents, NavBar, NavBarElementWithComponent };

export { navBars as default };
