import { Router } from 'express';
import { getCareerMarketData, getCareerLocationDemand } from '../controllers/marketController';

const router = Router();

router.get('/careers/:careerId/locations', getCareerLocationDemand);
router.get('/careers/:careerId', getCareerMarketData);

export default router;
