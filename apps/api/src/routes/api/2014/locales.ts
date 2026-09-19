import express from 'express'

import { indexLocales, showLocale } from '@/controllers/api/2014/localeController'

const router = express.Router()

router.get('/', indexLocales)
router.get('/:lang', showLocale)

export default router
