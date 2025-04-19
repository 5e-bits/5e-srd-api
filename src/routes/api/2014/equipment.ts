import * as express from 'express'

import EquipmentController from '@/controllers/api/2014/equipmentController'

const router = express.Router()

router.get('/', function (req, res, next) {
  EquipmentController.index(req, res, next)
})

router.get('/:index', function (req, res, next) {
  EquipmentController.show(req, res, next)
})

export default router
