import EquipmentModel from '../../models/equipment/index.js';
import { gearFieldResolvers } from './common.js';
import { Equipment } from '../../models/equipment/types';

const Pack = {
  ...gearFieldResolvers,
  contents: async (pack: Equipment) => {
    const contents = pack.contents;
    const equipment = await EquipmentModel.find({
      index: { $in: contents?.map(c => c.item.index) },
    }).lean();

    return contents?.map(c => ({
      ...c,
      item: equipment.find(e => e.index === c.item.index),
    }));
  },
};

export default Pack;
