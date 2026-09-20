import * as ClassController from '@/controllers/api/2024/classController'
import { simpleRouter } from '@/routes/simpleRouter'

const router = simpleRouter(ClassController)

router.get('/:index/spells', ClassController.showSpellsForClass)

router.get('/:index/levels/:level/features', ClassController.showFeaturesForClassAndLevel)
router.get('/:index/levels/:level/spells', ClassController.showSpellsForClassAndLevel)
router.get('/:index/levels/:level', ClassController.showLevelForClass)
router.get('/:index/levels', ClassController.showLevelsForClass)

export default router
