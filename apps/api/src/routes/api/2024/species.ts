import * as SpeciesController from '@/controllers/api/2024/speciesController'
import { simpleRouter } from '@/routes/simpleRouter'

const router = simpleRouter(SpeciesController)

router.get('/:index/subspecies', function (req, res, next) {
  SpeciesController.showSubspeciesForSpecies(req, res, next)
})

router.get('/:index/traits', function (req, res, next) {
  SpeciesController.showTraitsForSpecies(req, res, next)
})

export default router
