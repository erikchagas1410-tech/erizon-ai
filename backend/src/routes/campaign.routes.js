import express from 'express';
import {
  generateCampaign, generateCopy, analyzeCampaign,
  approveCampaign, sendToMeta, listCampaigns
} from '../services/campaign.service.js';

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const result = await generateCampaign(req.body);
    res.json({ success: true, data: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/copy', async (req, res) => {
  try {
    const { campanha_id, ...rest } = req.body;
    const result = await generateCopy(campanha_id, rest);
    res.json({ success: true, data: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/analyze', async (req, res) => {
  try {
    const { campanha_id, ...metricas } = req.body;
    const result = await analyzeCampaign(campanha_id, metricas);
    res.json({ success: true, data: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/approve/:id', async (req, res) => {
  try {
    const result = await approveCampaign(req.params.id);
    res.json({ success: true, data: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/send-meta/:id', async (req, res) => {
  try {
    const result = await sendToMeta(req.params.id);
    res.json({ success: true, data: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.get('/list', async (req, res) => {
  try {
    const result = await listCampaigns(req.query);
    res.json({ success: true, data: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
