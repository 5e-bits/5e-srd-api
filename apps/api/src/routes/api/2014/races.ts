import * as RaceController from '@/controllers/api/2014/raceController'
import { simpleRouter } from '@/routes/simpleRouter'

const router = simpleRouter(RaceController)

router.get('/:index/subraces', function (req, res, next) {
  RaceController.showSubracesForRace(req, res, next)
})
router.get('/:index/proficiencies', function (req, res, next) {
  RaceController.showProficienciesForRace(req, res, next)
})
router.get('/:index/traits', function (req, res, next) {
  RaceController.showTraitsForRace(req, res, next)
})

export default router
