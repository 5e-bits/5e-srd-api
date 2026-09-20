import * as SubraceController from '@/controllers/api/2014/subraceController'
import { simpleRouter } from '@/routes/simpleRouter'

const router = simpleRouter(SubraceController)

router.get('/:index/traits', SubraceController.showTraitsForSubrace)
router.get('/:index/proficiencies', SubraceController.showProficienciesForSubrace)

export default router
