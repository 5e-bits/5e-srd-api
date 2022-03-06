import * as express from 'express';
const router = express.Router();
import EquipmentCategoryController from '../../controllers/api/equipmentCategoryController';

router.get('/', function(req: any, res: any, next: any) {
  EquipmentCategoryController.index(req, res, next);
});

router.get('/:index', function(req: any, res: any, next: any) {
  EquipmentCategoryController.show(req, res, next);
});

export default router;
