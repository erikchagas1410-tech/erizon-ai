-- ============================================
-- ERIZON AI — SCHEMA DO BANCO (SUPABASE)
-- Execute este SQL no SQL Editor do Supabase
-- ============================================

-- Campanhas
CREATE TABLE IF NOT EXISTS campanhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nicho TEXT,
  produto TEXT,
  objetivo TEXT,
  orcamento NUMERIC,
  plataforma TEXT DEFAULT 'Meta Ads',
  nome TEXT,
  status TEXT DEFAULT 'rascunho',
  aprovado BOOLEAN DEFAULT false,
  aprovado_em TIMESTAMPTZ,
  enviado_em TIMESTAMPTZ,
  meta_campaign_id TEXT,
  estrutura JSONB,
  aprendizado TEXT,
  resultado_resumo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Copies
CREATE TABLE IF NOT EXISTS copies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id UUID REFERENCES campanhas(id) ON DELETE SET NULL,
  nicho TEXT,
  variante TEXT,
  tipo TEXT,
  texto TEXT,
  headline TEXT,
  cta TEXT,
  estrutura JSONB,
  status TEXT DEFAULT 'ativo',
  ctr NUMERIC,
  conversao NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criativos
CREATE TABLE IF NOT EXISTS criativos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id UUID REFERENCES campanhas(id) ON DELETE SET NULL,
  nicho TEXT,
  variante TEXT,
  prompt_pt TEXT,
  prompt_en TEXT,
  url_imagem TEXT,
  tipo TEXT,
  conceito TEXT,
  status TEXT DEFAULT 'ativo',
  ctr NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Métricas
CREATE TABLE IF NOT EXISTS metricas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id UUID REFERENCES campanhas(id) ON DELETE CASCADE,
  ctr NUMERIC,
  cpc NUMERIC,
  cpa NUMERIC,
  roas NUMERIC,
  frequencia NUMERIC,
  impressoes NUMERIC,
  cliques NUMERIC,
  conversoes NUMERIC,
  gasto NUMERIC,
  receita NUMERIC,
  score NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insights
CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id UUID REFERENCES campanhas(id) ON DELETE SET NULL,
  tipo TEXT,
  nicho TEXT,
  conteudo TEXT,
  acoes JSONB,
  aprendizado TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_campanhas_nicho ON campanhas(nicho);
CREATE INDEX IF NOT EXISTS idx_campanhas_status ON campanhas(status);
CREATE INDEX IF NOT EXISTS idx_metricas_campanha ON metricas(campanha_id);
CREATE INDEX IF NOT EXISTS idx_copies_nicho ON copies(nicho);
CREATE INDEX IF NOT EXISTS idx_insights_tipo ON insights(tipo);

-- Row Level Security (RLS) — desative para acesso via service key
ALTER TABLE campanhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE copies ENABLE ROW LEVEL SECURITY;
ALTER TABLE criativos ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricas ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- Policies para service key (backend)
CREATE POLICY "service_key_all" ON campanhas FOR ALL USING (true);
CREATE POLICY "service_key_all" ON copies FOR ALL USING (true);
CREATE POLICY "service_key_all" ON criativos FOR ALL USING (true);
CREATE POLICY "service_key_all" ON metricas FOR ALL USING (true);
CREATE POLICY "service_key_all" ON insights FOR ALL USING (true);
