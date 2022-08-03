import { resolveGearType } from './common.js';

const IGear = {
  __resolveType(gear) {
    return resolveGearType(gear);
  },
};
export default IGear;
