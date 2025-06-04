import express from 'express'

import { index } from '@/controllers/api/v2024Controller'

import AbilityScoresHandler from './2024/abilityScores'
import SkillsHandler from './2024/skills'

const router = express.Router()

router.get('/', function (req, res, next) {
  index(req, res, next)
})

router.use('/ability-scores', AbilityScoresHandler)
router.use('/skills', SkillsHandler)

export default router
