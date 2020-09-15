// import bounded to page files
import "./ui-kit.ts";
// lazy load import after content was loaded for another pages' resources
window.onload = () => {
  import(
    /* webpackChunkName: "lazy-load~room-details~to-ui-kit" */ "./../room-details/room-details.decl"
  ).then(() => {
    /* Code that collaborate with room-details page */
  });
  import(
    /* webpackChunkName: "lazy-load~search-room~to-ui-kit" */ "./../search-room/search-room.decl"
  ).then(() => {
    /* Code that collaborate with search-room page */
  });
  import(/* webpackChunkName: "lazy-load~index~to-ui-kit" */ "./../index/index.decl").then(
    () => {
      /* Code that collaborate with index page */
    }
  );
};
export {}; //uses in declaration of another pages for async import content
