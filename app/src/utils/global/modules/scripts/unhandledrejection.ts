window.addEventListener("unhandledrejection", function (event) {
  alert(event.promise);
  alert(event.reason);
});
