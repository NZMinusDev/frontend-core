// import bounded to page files
import "./room-details.ts";
// lazy load import after content was loaded for another pages' resources
window.onload = () => {
  import(
    /* webpackChunkName: "lazy-load~index~to-room-details" */ "./../index/index.decl"
  ).then(() => {
    /* Code that collaborate with index page */
  });
  import(
    /* webpackChunkName: "lazy-load~search-room~to-room-details" */ "./../search-room/search-room.decl"
  ).then(() => {
    /* Code that collaborate with search-room page */
  });
  import(/* webpackChunkName: "lazy-load~ui-kit~to-room-details" */ "./../ui-kit/ui-kit.decl").then(
    () => {
      /* Code that collaborate with ui-kit page */
    }
  );
};
export {}; //uses in declaration of another pages for async import content
