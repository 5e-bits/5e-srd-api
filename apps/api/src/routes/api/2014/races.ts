import * as express from 'express'

import * as RaceController from '@/controllers/api/2014/raceController'

const router = express.Router()

router.get('/', function (req, res, next) {
  RaceController.index(req, res, next)
})

router.get('/:index', function (req, res, next) {
  RaceController.show(req, res, next)
})

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
