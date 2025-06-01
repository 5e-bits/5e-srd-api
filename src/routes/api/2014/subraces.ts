import * as express from 'express'

import * as SubraceController from '@/controllers/api/2014/subraceController'

const router = express.Router()

router.get('/', function (req, res, next) {
  SubraceController.index(req, res, next)
})

router.get('/:index', function (req, res, next) {
  SubraceController.show(req, res, next)
})

router.get('/:index/traits', SubraceController.showTraitsForSubrace)
router.get('/:index/proficiencies', SubraceController.showProficienciesForSubrace)

export default router
