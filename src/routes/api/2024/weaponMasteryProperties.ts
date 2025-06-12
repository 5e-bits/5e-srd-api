import express from 'express'

import WeaponMasteryPropertyController from '@/controllers/api/2024/weaponMasteryPropertyController'

const router = express.Router()

router.get('/', function (req, res, next) {
  WeaponMasteryPropertyController.index(req, res, next)
})

router.get('/:index', function (req, res, next) {
  WeaponMasteryPropertyController.show(req, res, next)
})

export default router
