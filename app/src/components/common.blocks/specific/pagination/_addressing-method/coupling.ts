import { BEMModifier } from '@utils/devTools/scripts/ComponentCreationHelper';

import type { Pagination } from '../pagination';

abstract class PaginationAddressingMethodModifier extends BEMModifier<Pagination> {
  constructor(pagination: Pagination) {
    super(pagination, 'paginationAddressingMethodModifier');
  }
}

export type { Pagination };

export { PaginationAddressingMethodModifier as default };
