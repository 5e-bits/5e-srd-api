import * as express from 'express'

import EquipmentCategoryController from '@/controllers/api/2024/equipmentCategoryController'

const router = express.Router()

router.get('/', function (req, res, next) {
  EquipmentCategoryController.index(req, res, next)
})

router.get('/:index', function (req, res, next) {
  EquipmentCategoryController.show(req, res, next)
})

export default router
