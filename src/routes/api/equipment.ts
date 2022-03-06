import express from 'express';
const router = express.Router();
import EquipmentController from '../../controllers/api/equipmentController';

router.get('/', function(req: any, res: any, next: any) {
  EquipmentController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  EquipmentController.show(req, res, next);
});

export default router;
