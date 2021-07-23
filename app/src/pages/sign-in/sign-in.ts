import './sign-in.pug';
import './sign-in.scss';

const cardContainerElements = [
  ...document.querySelectorAll('.js-sign-in-layout__card'),
] as HTMLDivElement[];

const handleCardSwitchBtnClick = (event: MouseEvent) => {
  const target = event.target as HTMLButtonElement;

  const isSwitchBtn = target.value === 'Создать' || target.value === 'Войти';

  if (target.type !== 'submit' && isSwitchBtn) {
    cardContainerElements.forEach((currentCardElement) => {
      currentCardElement.classList.toggle('sign-in-layout__card_hidden');
    });
  }
};

cardContainerElements.forEach((cardContainerElement) => {
  cardContainerElement.addEventListener('click', handleCardSwitchBtnClick);
});
