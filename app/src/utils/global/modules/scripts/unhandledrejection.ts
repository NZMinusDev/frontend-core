/* eslint-disable no-alert */
const onUnHandledRejectionHandler = (event) => {
  alert(event.promise);
  alert(event.reason);
};

window.addEventListener('unhandledrejection', onUnHandledRejectionHandler);
