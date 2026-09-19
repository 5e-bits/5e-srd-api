import express from 'express'

import WeaponPropertyController from '@/controllers/api/2024/weaponPropertyController'

const router = express.Router()

router.get('/', function (req, res, next) {
  WeaponPropertyController.index(req, res, next)
})

router.get('/:index', function (req, res, next) {
  WeaponPropertyController.show(req, res, next)
})

export default router
