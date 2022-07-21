const Equipment = require('../../models/equipment');
const MagicItem = require('../../models/magicItem');
const { coalesceSort } = require('./common');

const EquipmentCategory = {
  equipment: async (equipmentCategory, args) => {
    const indexes = equipmentCategory.equipment.map(e => e.index);
    const equipment = await Equipment.find({ index: { $in: indexes } }).lean();
    const magicItems = await MagicItem.find({ index: { $in: indexes } }).lean();
    const equipmentToReturn = equipment.concat(magicItems);

    let sort = {};
    if (args.order) {
      sort = coalesceSort(args.order, value => value.toLowerCase(), 2);
    }

    if (sort.name) {
      equipmentToReturn.sort((a, b) => {
        if (a.name < b.name) {
          return -sort.name;
        } else if (a.name > b.name) {
          return sort.name;
        } else {
          return 0;
        }
      });
    }

    if (sort.weight) {
      equipmentToReturn.sort((a, b) => {
        if (a.weight < b.weight) {
          return -sort.weight;
        } else if (a.weight > b.weight) {
          return sort.weight;
        } else {
          return 0;
        }
      });
    }

    let skip = 0;
    if (args.skip) {
      skip = args.skip;
    }

    return equipmentToReturn.slice(skip, skip + args.limit);
  },
};

module.exports = EquipmentCategory;