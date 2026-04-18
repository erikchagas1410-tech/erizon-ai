import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import campaignRoutes from './routes/campaign.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import creativeRoutes from './routes/creative.routes.js';
import competitorRoutes from './routes/competitor.routes.js';
import insightRoutes from './routes/insight.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ERIZON AI ONLINE', version: '1.0.0', timestamp: new Date().toISOString() });
});

// Rotas
app.use('/api/campaign', campaignRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/creative', creativeRoutes);
app.use('/api/competitor', competitorRoutes);
app.use('/api/insight', insightRoutes);

app.listen(PORT, () => {
  console.log(`🚀 ERIZON AI rodando na porta ${PORT}`);
});
