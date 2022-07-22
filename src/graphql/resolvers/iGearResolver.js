import { resolveGearType } from './common';

const IGear = {
  __resolveType(gear) {
    return resolveGearType(gear);
  },
};
export default IGear;
