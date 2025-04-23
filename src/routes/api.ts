import express from 'express'
import deprecatedApiController from '@/controllers/apiController'
import v2014Handler from './api/2014'
import v2024Handler from './api/2024'
const router = express.Router()

router.use('/2014', v2014Handler)
router.use('/2024', v2024Handler)
router.get('*', deprecatedApiController)

export default router
