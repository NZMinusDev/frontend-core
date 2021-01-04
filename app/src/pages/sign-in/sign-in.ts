import "./sign-in.pug";
import "./sign-in.scss";

document.querySelectorAll(".sign-in-layout__card").forEach((cardElement, key, nodeList) => {
  let switchBtn = cardElement.querySelector(
    `.card-${cardElement.getAttribute("name")}__switch-btn`
  );

  switchBtn.addEventListener("click", () => {
    nodeList.forEach((cardElement) => {
      cardElement.classList.toggle("sign-in-layout__card_hidden");
    });
  });
});
