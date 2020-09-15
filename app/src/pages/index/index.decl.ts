// import blocks styles from redefinition levels. Note: order is important
import "@common.blocks/containers/menu/menu.decl.ts"
// import bounded to page files
import "./index.ts";
// lazy load import after content was loaded for another pages' resources
window.onload = () => {
  import(
    /* webpackChunkName: "lazy-load~room-details~to-index" */ "./../room-details/room-details.decl"
  ).then(() => {
    /* Code that collaborate with room-details page */
  });
  import(
    /* webpackChunkName: "lazy-load~search-room~to-index" */ "./../search-room/search-room.decl"
  ).then(() => {
    /* Code that collaborate with search-room page */
  });
  import(/* webpackChunkName: "lazy-load~ui-kit~to-index" */ "./../ui-kit/ui-kit.decl").then(() => {
    /* Code that collaborate with ui-kit page */
  });
};
export {}; //uses in declaration of another pages for async import content
