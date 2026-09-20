import * as SubspeciesController from '@/controllers/api/2024/subspeciesController'
import { simpleRouter } from '@/routes/simpleRouter'

const router = simpleRouter(SubspeciesController)

router.get('/:index/traits', function (req, res, next) {
  SubspeciesController.showTraitsForSubspecies(req, res, next)
})

export default router
