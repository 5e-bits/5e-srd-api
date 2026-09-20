import * as SubclassController from '@/controllers/api/2014/subclassController'
import { simpleRouter } from '@/routes/simpleRouter'

const router = simpleRouter(SubclassController)

router.get('/:index/features', SubclassController.showFeaturesForSubclass)

router.get('/:index/levels/:level/features', SubclassController.showFeaturesForSubclassAndLevel)
router.get('/:index/levels/:level', SubclassController.showLevelForSubclass)
router.get('/:index/levels', SubclassController.showLevelsForSubclass)

export default router
