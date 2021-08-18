const { resolveGearType } = require('./common');

const IGear = {
  __resolveType(gear) {
    return resolveGearType(gear);
  },
};
module.exports = IGear;
