import { Router } from 'express';
import {
  getCareerMarketData,
  getCareerLocationDemand,
  getTalentAtlasData,
  searchLiveTalent
} from '../controllers/marketController';

const router = Router();

router.get('/atlas', getTalentAtlasData);
router.get('/search', searchLiveTalent);
router.get('/careers/:careerId/locations', getCareerLocationDemand);
router.get('/careers/:careerId', getCareerMarketData);

export default router;
