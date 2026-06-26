// routes/dealerRoutes.js
import express from 'express';
import { getDealerBySlug, checkSlugExists } from '../controllers/dealerController.js';


const router = express.Router();

router.get('/check-slug/:slug', checkSlugExists);
router.get('/:slug', getDealerBySlug);

export default router;
