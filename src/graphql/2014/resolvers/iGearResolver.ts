import { resolveGearType } from './common.js';
import { Equipment } from '../../../models/2014/equipment/types.js';

const IGear = {
  __resolveType(gear: Equipment) {
    return resolveGearType(gear);
  },
};
export default IGear;
