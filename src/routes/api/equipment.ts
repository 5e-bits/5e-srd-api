import * as express from 'express';

import EquipmentController from '../../controllers/api/equipmentController.js';

const router = express.Router();


router.get('/', function(req: any, res: any, next: any) {
  EquipmentController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  EquipmentController.show(req, res, next);
});

export default router;
