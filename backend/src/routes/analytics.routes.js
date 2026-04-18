import express from 'express';
import { getDashboardStats, generateGrowthInsight } from '../services/intelligence.service.js';

const router = express.Router();

router.get('/dashboard', async (req, res) => {
  try {
    const result = await getDashboardStats();
    res.json({ success: true, data: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/insight/:campanha_id', async (req, res) => {
  try {
    const result = await generateGrowthInsight(req.params.campanha_id);
    res.json({ success: true, data: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
