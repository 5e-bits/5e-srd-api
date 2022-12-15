import { resolveGearType } from './common.js';
import { Equipment } from '../../models/equipment/types';

const IGear = {
  __resolveType(gear: Equipment) {
    return resolveGearType(gear);
  },
};
export default IGear;
