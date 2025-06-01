import express from 'express'

import { index } from '@/controllers/api/v2024Controller'

import AbilityScoresHandler from './2024/abilityScores'
import SkillsHandler from './2024/skills'

const router = express.Router()

router.get('/', index)

router.use('/ability-scores', AbilityScoresHandler)
router.use('/skills', SkillsHandler)

export default router
