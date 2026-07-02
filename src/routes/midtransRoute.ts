import express from 'express';
import { midtransCallback } from '../controllers/midtransController';

const router = express.Router();

router.post('/callback', midtransCallback);

export default router;