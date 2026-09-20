import * as SubclassController from '@/controllers/api/2024/subclassController'
import { simpleRouter } from '@/routes/simpleRouter'

const router = simpleRouter(SubclassController)

router.get('/:index/levels/:level/features', function (req, res, next) {
  SubclassController.showFeaturesForSubclassAndLevel(req, res, next)
})
router.get('/:index/levels/:level', function (req, res, next) {
  SubclassController.showLevelForSubclass(req, res, next)
})
router.get('/:index/levels', function (req, res, next) {
  SubclassController.showLevelsForSubclass(req, res, next)
})

export default router
