import { resolveGearType } from './common';
import { Equipment } from '@/models/2014/equipment';

const IGearResolver = {
  __resolveType(gear: Equipment) {
    return resolveGearType(gear);
  },
};
export default IGearResolver;
