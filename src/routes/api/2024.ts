import AbilityScoresHandler from './2024/abilityScores'
import FeatsHandler from './2024/feats'
import SkillsHandler from './2024/skills'

import express from 'express'
import { index } from '@/controllers/api/v2024Controller'

const router = express.Router()

router.get('/', index)

router.use('/ability-scores', AbilityScoresHandler)
router.use('/feats', FeatsHandler)
router.use('/skills', SkillsHandler)

export default router
