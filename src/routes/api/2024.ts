import express from 'express'
import { index } from '@/controllers/api/v2024Controller'

const router = express.Router()

router.get('/', index)

export default router
