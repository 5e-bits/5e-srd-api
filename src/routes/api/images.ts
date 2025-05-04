import * as express from 'express'

import ImageController from '@/controllers/imageController'

const router = express.Router()

router.get('/*', function (req, res, next) {
  ImageController.show(req, res, next)
})

export default router
