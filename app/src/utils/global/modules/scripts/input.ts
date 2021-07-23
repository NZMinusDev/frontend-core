import { getURLValue, addURLValues } from '@utils/devTools/scripts/URLHelper';

document.querySelectorAll('input').forEach((element) => {
  const inputElement = element as HTMLInputElement;
  const hrefValue = getURLValue(inputElement.name);

  if (hrefValue !== undefined) {
    switch (inputElement.type) {
      case 'radio': {
        inputElement.checked = inputElement.value === hrefValue;

        break;
      }
      case 'checkbox': {
        inputElement.checked = hrefValue === 'on';

        break;
      }

      default: {
        inputElement.value = hrefValue;
      }
    }
  }

  if (inputElement.type === 'checkbox') {
    const onChange = (e: Event) => {
      const checkbox = e.currentTarget as HTMLInputElement;

      if (checkbox.name !== '') {
        checkbox.value = checkbox.checked ? 'on' : 'off';
      }

      if (!checkbox.checked) {
        checkbox.removeAttribute('checked');
      }
    };

    inputElement.addEventListener('change', onChange);
  }

  if (inputElement.dataset.isFilter !== undefined) {
    const onChange = () => {
      addURLValues({
        name: inputElement.name,
        value: inputElement.value,
      });
    };

    inputElement.addEventListener('change', onChange);
  }
});
