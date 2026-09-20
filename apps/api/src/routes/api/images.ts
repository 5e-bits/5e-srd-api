import express from 'express'

import ImageController from '@/controllers/api/imageController'

const router = express.Router()

router.get('/*splat', ImageController.show)

export default router
