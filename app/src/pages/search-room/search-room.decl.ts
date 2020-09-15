// import bounded to page files
import "./search-room.ts";
// lazy load import after content was loaded for another pages' resources
window.onload = () => {
  import(
    /* webpackChunkName: "lazy-load~room-details~to-search-room" */ "./../room-details/room-details.decl"
  ).then(() => {
    /* Code that collaborate with room-details page */
  });
  import(
    /* webpackChunkName: "lazy-load~index~to-search-room" */ "./../index/index.decl"
  ).then(() => {
    /* Code that collaborate with index page */
  });
  import(/* webpackChunkName: "lazy-load~ui-kit~to-search-room" */ "./../ui-kit/ui-kit.decl").then(
    () => {
      /* Code that collaborate with ui-kit page */
    }
  );
};
export {}; //uses in declaration of another pages for async import content
