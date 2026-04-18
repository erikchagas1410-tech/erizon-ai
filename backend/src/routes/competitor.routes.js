import express from 'express';
import { analyzeCompetitor, getLibraryInsights } from '../services/intelligence.service.js';

const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const result = await analyzeCompetitor(req.body);
    res.json({ success: true, data: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/library-insights', async (req, res) => {
  try {
    const result = await getLibraryInsights(req.body);
    res.json({ success: true, data: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
