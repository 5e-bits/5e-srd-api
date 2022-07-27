import * as express from 'express';

import EquipmentCategoryController from '../../controllers/api/equipmentCategoryController.js';

const router = express.Router();


router.get('/', function(req: any, res: any, next: any) {
  EquipmentCategoryController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  EquipmentCategoryController.show(req, res, next);
});

export default router;
