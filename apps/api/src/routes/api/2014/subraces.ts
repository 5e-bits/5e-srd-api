import * as SubraceController from '@/controllers/api/2014/subraceController'
import { simpleRouter } from '@/routes/simpleRouter'

const router = simpleRouter(SubraceController)

router.get('/:index/traits', function (req, res, next) {
  SubraceController.showTraitsForSubrace(req, res, next)
})
router.get('/:index/proficiencies', function (req, res, next) {
  SubraceController.showProficienciesForSubrace(req, res, next)
})

export default router
