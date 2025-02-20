import express from 'express';
import deprecatedApiController from '../controllers/apiController.js'
import v2014Handler from './api/2014.js';

const router = express.Router();

router.use('/2014', v2014Handler);
router.get('*', deprecatedApiController);

export default router;
