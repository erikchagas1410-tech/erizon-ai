import express from 'express';
import { generateCreativePrompt, saveCreative, analyzeCreative } from '../services/creative.service.js';

const router = express.Router();

router.post('/generate-prompt', async (req, res) => {
  try {
    const result = await generateCreativePrompt(req.body);
    res.json({ success: true, data: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/save', async (req, res) => {
  try {
    const result = await saveCreative(req.body);
    res.json({ success: true, data: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/analyze', async (req, res) => {
  try {
    const result = await analyzeCreative(req.body);
    res.json({ success: true, data: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
