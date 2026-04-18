const BASE = '/api';

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Erro desconhecido');
  return data.data;
}

export const api = {
  // Dashboard
  getDashboard: () => req('/analytics/dashboard'),

  // Campanhas
  createCampaign: (body) => req('/campaign/create', { method: 'POST', body }),
  generateCopy: (body) => req('/campaign/copy', { method: 'POST', body }),
  analyzeCampaign: (body) => req('/campaign/analyze', { method: 'POST', body }),
  approveCampaign: (id) => req(`/campaign/approve/${id}`, { method: 'POST' }),
  sendToMeta: (id) => req(`/campaign/send-meta/${id}`, { method: 'POST' }),
  listCampaigns: (q = '') => req(`/campaign/list${q}`),

  // Criativos
  generateCreativePrompt: (body) => req('/creative/generate-prompt', { method: 'POST', body }),
  saveCreative: (body) => req('/creative/save', { method: 'POST', body }),
  analyzeCreative: (body) => req('/creative/analyze', { method: 'POST', body }),

  // Concorrentes
  analyzeCompetitor: (body) => req('/competitor/analyze', { method: 'POST', body }),
  getLibraryInsights: (body) => req('/competitor/library-insights', { method: 'POST', body }),

  // Insights
  generateInsight: (campanha_id) => req(`/analytics/insight/${campanha_id}`, { method: 'POST' }),
  listInsights: () => req('/insight/list'),
};
