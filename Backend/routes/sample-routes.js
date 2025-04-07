import express from 'express';
const router = express.Router();

import { getSamples } from '../controller/samplesController.js';

router.post('/', getSamples);

export default router;