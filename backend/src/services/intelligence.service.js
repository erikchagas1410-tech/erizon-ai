import { callAI, callAIJSON } from './ai.service.js';
import { supabase } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

// ============ COMPETITOR SERVICE ============

export async function analyzeCompetitor(input) {
  const { nome_concorrente, nicho, anuncios_observados, posicionamento_percebido } = input;

  const prompt = `
Você é um especialista em inteligência competitiva para tráfego pago.

CONCORRENTE: ${nome_concorrente}
NICHO: ${nicho}
ANÚNCIOS OBSERVADOS: ${anuncios_observados}
POSICIONAMENTO PERCEBIDO: ${posicionamento_percebido}

Analise e retorne JSON:
{
  "analise_posicionamento": "string",
  "angulos_usados": ["string"],
  "pontos_fracos_concorrente": ["string"],
  "oportunidades_diferenciacao": ["string"],
  "copys_patterns_observados": ["string"],
  "formato_criativo_predominante": "string",
  "publico_alvo_estimado": "string",
  "orcamento_estimado": "string",
  "como_vencer": {
    "angulo_unico": "string",
    "copy_diferenciado": "string",
    "criativo_superior": "string",
    "oferta_melhor": "string"
  },
  "acoes_imediatas": ["string"],
  "score_ameaca": number
}`;

  const data = await callAIJSON(prompt);

  await supabase.from('insights').insert({
    id: uuidv4(),
    tipo: 'analise_concorrente',
    nicho,
    conteudo: `Análise concorrente: ${nome_concorrente}`,
    acoes: data.acoes_imediatas,
    aprendizado: data.como_vencer?.angulo_unico,
    created_at: new Date().toISOString()
  });

  return data;
}

export async function getLibraryInsights(input) {
  const { nicho, objetivo, plataforma = 'Meta' } = input;

  const prompt = `
Com base no seu conhecimento sobre a Biblioteca de Anúncios do ${plataforma} e padrões de mercado:

NICHO: ${nicho}
OBJETIVO: ${objetivo}

Analise o que está performando neste nicho e retorne JSON:
{
  "tendencias_atuais": ["string"],
  "formatos_dominantes": ["string"],
  "angulos_saturados": ["string"],
  "angulos_virgem": ["string"],
  "hooks_que_param_scroll": ["string"],
  "ofertas_que_convertem": ["string"],
  "erros_comuns_do_nicho": ["string"],
  "oportunidade_ouro": "string",
  "copy_frameworks_funcionando": ["string"],
  "recomendacao_para_entrar": "string"
}`;

  return await callAIJSON(prompt);
}

// ============ INSIGHT SERVICE ============

export async function generateGrowthInsight(campanha_id) {
  const { data: campanha } = await supabase
    .from('campanhas')
    .select('*')
    .eq('id', campanha_id)
    .single();

  const { data: metricas } = await supabase
    .from('metricas')
    .select('*')
    .eq('campanha_id', campanha_id)
    .order('created_at', { ascending: false })
    .limit(10);

  const { data: historico_insights } = await supabase
    .from('insights')
    .select('*')
    .eq('campanha_id', campanha_id)
    .limit(5);

  const prompt = `
Analise toda a jornada desta campanha e gere um INSIGHT DE GROWTH:

CAMPANHA: ${JSON.stringify(campanha?.estrutura, null, 2)}
MÉTRICAS (últimas ${metricas?.length}): ${JSON.stringify(metricas, null, 2)}
INSIGHTS ANTERIORES: ${JSON.stringify(historico_insights?.map(i => i.aprendizado), null, 2)}

Retorne JSON:
{
  "insight_principal": "string (o que os dados estão revelando)",
  "padrao_identificado": "string",
  "acao_de_crescimento": "string",
  "previsao_30_dias": "string",
  "risco_identificado": "string",
  "alavanca_principal": "string",
  "proximos_passos": ["string"],
  "aprendizado_para_memoria": "string"
}`;

  const insight = await callAIJSON(prompt);

  await supabase.from('insights').insert({
    id: uuidv4(),
    campanha_id,
    tipo: 'growth_insight',
    conteudo: insight.insight_principal,
    acoes: insight.proximos_passos,
    aprendizado: insight.aprendizado_para_memoria,
    created_at: new Date().toISOString()
  });

  // Atualiza aprendizado na campanha
  await supabase.from('campanhas').update({
    aprendizado: insight.aprendizado_para_memoria,
    resultado_resumo: insight.insight_principal
  }).eq('id', campanha_id);

  return insight;
}

export async function getDashboardStats() {
  const [campanhas, metricas, copies, criativos] = await Promise.all([
    supabase.from('campanhas').select('id, status, nicho, orcamento, created_at'),
    supabase.from('metricas').select('roas, cpa, ctr, gasto, receita, score, created_at').order('created_at', { ascending: false }).limit(100),
    supabase.from('copies').select('id, status').limit(1, { count: 'exact' }),
    supabase.from('criativos').select('id').limit(1, { count: 'exact' })
  ]);

  const m = metricas.data || [];
  const c = campanhas.data || [];

  const avg = (arr, key) => arr.length ? (arr.reduce((s, i) => s + (Number(i[key]) || 0), 0) / arr.length).toFixed(2) : 0;

  return {
    total_campanhas: c.length,
    campanhas_ativas: c.filter(x => ['ativo', 'enviado_meta', 'aprovado'].includes(x.status)).length,
    campanhas_rascunho: c.filter(x => x.status === 'rascunho').length,
    roas_medio: avg(m, 'roas'),
    cpa_medio: avg(m, 'cpa'),
    ctr_medio: avg(m, 'ctr'),
    gasto_total: m.reduce((s, i) => s + (Number(i.gasto) || 0), 0).toFixed(2),
    receita_total: m.reduce((s, i) => s + (Number(i.receita) || 0), 0).toFixed(2),
    score_medio: avg(m, 'score'),
    series_roas: m.slice(0, 30).reverse().map(i => ({ data: i.created_at?.slice(0, 10), valor: Number(i.roas) })),
    series_gasto: m.slice(0, 30).reverse().map(i => ({ data: i.created_at?.slice(0, 10), valor: Number(i.gasto) }))
  };
}
