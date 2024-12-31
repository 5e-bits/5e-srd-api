import AbilityScoreController from '../../../controllers/api/2014/abilityScoreController.js';
import express from 'express';

const router = express.Router();

/** 
 * GET /ability-scores
 * @tags AbilityScore
 * @tags ResourceList
 * 
 * @summary Get all ability scores
 * @returns {array<APIReference>} 200 - success response
*/
router.get('/', function (req, res, next) {
  AbilityScoreController.index(req, res, next);
});

/** 
 * GET /ability-scores/{index}
 * @tags AbilityScore
 * 
 * @summary Get a specific ability score
 * @param {string} index.path.required - The index of the ability score - enum:cha,con,dex,wis,int,str
 * @returns {AbilityScore} 200 - success response
*/ 
router.get('/:index', function (req, res, next) {
  AbilityScoreController.show(req, res, next);
});

export default router;
