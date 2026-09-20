import * as RaceController from '@/controllers/api/2014/raceController'
import { simpleRouter } from '@/routes/simpleRouter'

const router = simpleRouter(RaceController)

router.get('/:index/subraces', RaceController.showSubracesForRace)
router.get('/:index/proficiencies', RaceController.showProficienciesForRace)
router.get('/:index/traits', RaceController.showTraitsForRace)

export default router
