import { BEMModifier } from '@utils/devTools/scripts/ComponentCreationHelper';

import type { FormDropdownItemQuantityList } from '../form-dropdown__item-quantity-list';

abstract class FormDropdownItemQuantityListOpeningMethodModifier extends BEMModifier<
  FormDropdownItemQuantityList
> {
  constructor(formDropdownItemQuantityList: FormDropdownItemQuantityList) {
    super(formDropdownItemQuantityList, 'formDropdownItemQuantityListOpeningMethodModifier');
  }
}

export type { FormDropdownItemQuantityList };

export { FormDropdownItemQuantityListOpeningMethodModifier as default };
