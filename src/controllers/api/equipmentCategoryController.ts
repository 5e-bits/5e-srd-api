import EquipmentCategory from '../../models/equipmentCategory/index.js';
import Equipment from '../../models/equipment/index.js';
import SimpleController from '../simpleController.js';
import { Request, Response, NextFunction } from 'express';
import { APIReference } from '../../models/common/types.js';

export const index = async (req: Request, res: Response, next: NextFunction) => {
  const instantiatedSimpleController = new SimpleController(EquipmentCategory);
  const indexResult = instantiatedSimpleController.index(req, res, next);
  return indexResult;
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestedEquipmentCategory = await EquipmentCategory.findOne({
      index: req.params.index,
    });
    if (!requestedEquipmentCategory) return next();
    if (req.query.property !== undefined) {
      const weaponData = await Equipment.find({
        'equipment_category.index': req.params.index,
      })
        .where('properties')
        .elemMatch({ index: req.query.property });

      const filteredEquipmentArray = requestedEquipmentCategory.equipment.filter(
        weaponApiReference => {
          return weaponData.some(weaponPropertyApiReference => {
            return weaponApiReference.index === weaponPropertyApiReference.index;
          });
        }
      );
      requestedEquipmentCategory.equipment = filteredEquipmentArray as APIReference[];
      return res.status(200).json(requestedEquipmentCategory);
    } else {
      return res.status(200).json(requestedEquipmentCategory);
    }
  } catch (err) {
    next(err);
  }
};
