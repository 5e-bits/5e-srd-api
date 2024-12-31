import * as express from 'express';

import AlignmentController from '../../../controllers/api/2014/alignmentController.js';

const router = express.Router();


/**
 * GET /alignments
 * @tags Alignment
 * @tags ResourceList
 * 
 * @summary Get all alignments
 * @returns {array<APIReference>} 200 - success response
 */
router.get('/', function (req, res, next) {
  AlignmentController.index(req, res, next);
});

/**
 * GET /alignments/{index}
 * @tags Alignment
 * 
 * @summary Get an alignment by index
 * @param {string} index.path.required - The index of the alignment - enum:lawful-good,neutral-good,chaotic-good,lawful-neutral,true-neutral,chaotic-neutral,lawful-evil,neutral-evil,chaotic-evil
 * @returns {Alignment} 200 - success response
 */ 
router.get('/:index', function (req, res, next) {
  AlignmentController.show(req, res, next);
});

export default router;
