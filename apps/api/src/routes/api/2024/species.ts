import * as SpeciesController from '@/controllers/api/2024/speciesController'
import { simpleRouter } from '@/routes/simpleRouter'

const router = simpleRouter(SpeciesController)

router.get('/:index/subspecies', SpeciesController.showSubspeciesForSpecies)

router.get('/:index/traits', SpeciesController.showTraitsForSpecies)

export default router
