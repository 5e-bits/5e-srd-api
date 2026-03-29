import * as express from 'express'

import * as SpeciesController from '@/controllers/api/2024/speciesController'

const router = express.Router()

router.get('/', function (req, res, next) {
  SpeciesController.index(req, res, next)
})

router.get('/:index', function (req, res, next) {
  SpeciesController.show(req, res, next)
})

router.get('/:index/subspecies', function (req, res, next) {
  SpeciesController.showSubspeciesForSpecies(req, res, next)
})

router.get('/:index/traits', function (req, res, next) {
  SpeciesController.showTraitsForSpecies(req, res, next)
})

export default router
