import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

router.get('/list', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('insights')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

export default router;
