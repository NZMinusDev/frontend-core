import {
  BEMComponent,
  HTMLElementWithComponent,
} from '@utils/devTools/scripts/ComponentCreationHelper';

import navBars from '../nav-bar';

type NavBarNavigationItemElement = HTMLLIElement;

// eslint-disable-next-line @typescript-eslint/ban-types
type NavBarNavigationItemCustomEvents = {};

class NavBarNavigationItem extends BEMComponent<
  NavBarNavigationItemElement,
  NavBarNavigationItemCustomEvents
> {
  // eslint-disable-next-line no-useless-constructor
  constructor(navBarNavigationItemElement: NavBarNavigationItemElement) {
    super(navBarNavigationItemElement);
  }
}

type NavBarNavigationItemElementWithComponent = HTMLElementWithComponent<
  NavBarNavigationItemElement,
  NavBarNavigationItemCustomEvents,
  NavBarNavigationItem
>;

const navBarNavigationItems = navBars
  .map((navBar) =>
    Array.from(
      navBar.element.querySelectorAll<NavBarNavigationItemElement>('.js-nav-bar__navigation-item'),
      (navBarNavigationItemElement) => new NavBarNavigationItem(navBarNavigationItemElement)
    )
  )
  .flat();

export type {
  NavBarNavigationItemCustomEvents,
  NavBarNavigationItem,
  NavBarNavigationItemElementWithComponent,
};

export { navBarNavigationItems as default };
