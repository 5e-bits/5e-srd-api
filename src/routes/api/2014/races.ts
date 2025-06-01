import * as express from 'express'

import * as RaceController from '@/controllers/api/2014/raceController'

const router = express.Router()

router.get('/', function (req, res, next) {
  RaceController.index(req, res, next)
})

router.get('/:index', function (req, res, next) {
  RaceController.show(req, res, next)
})

router.get('/:index/subraces', RaceController.showSubracesForRace)
router.get('/:index/proficiencies', RaceController.showProficienciesForRace)
router.get('/:index/traits', RaceController.showTraitsForRace)

export default router
