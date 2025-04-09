import { resolveGearType } from './common.js';
import { Equipment } from '@/models/2014/equipment/index.js';

const IGearResolver = {
  __resolveType(gear: Equipment) {
    return resolveGearType(gear);
  },
};
export default IGearResolver;
