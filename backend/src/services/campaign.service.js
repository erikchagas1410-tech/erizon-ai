import { callAI, callAIJSON } from './ai.service.js';
import { supabase } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

export async function generateCampaign(input) {
  const { nicho, produto, objetivo, orcamento, publico_alvo, diferenciais, plataforma = 'Meta Ads' } = input;

  // Busca histórico de campanhas similares pra melhorar decisões
  const { data: historico } = await supabase
    .from('campanhas')
    .select('nome, resultado_resumo, aprendizado')
    .eq('nicho', nicho)
    .order('created_at', { ascending: false })
    .limit(5);

  const historicoTexto = historico?.length
    ? `\n\nHISTÓRICO DE CAMPANHAS ANTERIORES NESTE NICHO:\n${historico.map(h => `- ${h.nome}: ${h.aprendizado || h.resultado_resumo}`).join('\n')}`
    : '';

  const prompt = `
Crie uma campanha de tráfego pago COMPLETA e PROFISSIONAL para:

PRODUTO/SERVIÇO: ${produto}
NICHO: ${nicho}
OBJETIVO: ${objetivo}
ORÇAMENTO TOTAL: R$ ${orcamento}
PLATAFORMA: ${plataforma}
PÚBLICO-ALVO: ${publico_alvo}
DIFERENCIAIS: ${diferenciais}
${historicoTexto}

Retorne um JSON com EXATAMENTE esta estrutura:
{
  "nome_campanha": "string (padrão profissional: NICHO_OBJETIVO_DATA)",
  "estrategia": "string (resumo estratégico em 3-4 linhas)",
  "objetivo_campanha": "string",
  "tipo_campanha": "string (CBO ou ABO e por quê)",
  "distribuicao_orcamento": {
    "total": number,
    "campanha_principal": number,
    "teste_ab": number,
    "retargeting": number,
    "lookalike": number,
    "reserva_escala": number,
    "justificativa": "string"
  },
  "publicos": [
    {
      "nome": "string",
      "tipo": "string (frio/quente/lookalike/retargeting)",
      "descricao": "string",
      "orcamento_diario": number,
      "segmentacao_detalhada": "string"
    }
  ],
  "fase_teste": {
    "duracao_dias": number,
    "orcamento_diario": number,
    "metricas_decisao": ["string"],
    "criterio_escala": "string",
    "criterio_pausa": "string"
  },
  "kpis_alvo": {
    "ctr_minimo": "string",
    "cpc_maximo": "string",
    "cpa_alvo": "string",
    "roas_minimo": "string",
    "frequencia_maxima": "string"
  },
  "recomendacoes_criativo": {
    "formato": "string",
    "estilo_visual": "string",
    "emocao_principal": "string",
    "elemento_gancho": "string"
  },
  "alertas_automaticos": ["string"],
  "projecao_resultados": {
    "cenario_conservador": "string",
    "cenario_realista": "string",
    "cenario_otimista": "string"
  }
}`;

  const data = await callAIJSON(prompt);

  // Salva no Supabase
  const id = uuidv4();
  const { error } = await supabase.from('campanhas').insert({
    id,
    nicho,
    produto,
    objetivo,
    orcamento: Number(orcamento),
    plataforma,
    nome: data.nome_campanha,
    status: 'rascunho',
    aprovado: false,
    estrutura: data,
    created_at: new Date().toISOString()
  });

  if (error) console.error('Supabase insert error:', error);

  return { id, ...data };
}

export async function generateCopy(campanha_id, input) {
  const { produto, nicho, publico, objetivo, tom = 'direto e persuasivo', variantes = 3 } = input;

  // Busca top copies anteriores do nicho
  const { data: topCopies } = await supabase
    .from('copies')
    .select('texto, tipo, ctr, conversao')
    .eq('nicho', nicho)
    .order('ctr', { ascending: false })
    .limit(3);

  const refCopies = topCopies?.length
    ? `\n\nCOPIES QUE MAIS CONVERTERAM NESTE NICHO:\n${topCopies.map(c => `[${c.tipo}] CTR ${c.ctr}%: ${c.texto.substring(0, 100)}...`).join('\n')}`
    : '';

  const prompt = `
Você é o melhor copywriter de resposta direta do Brasil. Crie copies IRRESISTÍVEIS.

PRODUTO: ${produto}
NICHO: ${nicho}
PÚBLICO: ${publico}
OBJETIVO: ${objetivo}
TOM: ${tom}
${refCopies}

Crie ${variantes} variações de copy completa para anúncios. Retorne JSON:
{
  "copies": [
    {
      "variante": "A/B/C",
      "tipo": "string (emocional/racional/urgência/prova social/curiosidade)",
      "headline": "string (até 40 chars - IMPACTA EM 0.3 segundos)",
      "primary_text": "string (copy principal - máx 150 chars mobile-friendly)",
      "description": "string (reforço do benefício - até 30 chars)",
      "cta": "string",
      "hook_video": "string (primeiros 3 segundos se for vídeo)",
      "angulo": "string (qual dor/desejo esse copy ataca)",
      "porque_vai_converter": "string"
    }
  ],
  "recomendacao_teste": "string",
  "angulo_vencedor_estimado": "string"
}`;

  const data = await callAIJSON(prompt);

  // Salva copies no Supabase
  if (campanha_id && data.copies) {
    for (const copy of data.copies) {
      await supabase.from('copies').insert({
        id: uuidv4(),
        campanha_id,
        nicho,
        variante: copy.variante,
        tipo: copy.tipo,
        texto: copy.primary_text,
        headline: copy.headline,
        cta: copy.cta,
        estrutura: copy,
        status: 'ativo',
        created_at: new Date().toISOString()
      });
    }
  }

  return data;
}

export async function analyzeCampaign(campanha_id, metricas) {
  const { ctr, cpc, cpa, roas, frequencia, impressoes, cliques, conversoes, gasto, receita } = metricas;

  // Busca benchmark do nicho
  const { data: campanha } = await supabase
    .from('campanhas')
    .select('*')
    .eq('id', campanha_id)
    .single();

  const kpis = campanha?.estrutura?.kpis_alvo || {};

  const prompt = `
Analise esta campanha com olhar de Growth Hacker sênior:

MÉTRICAS ATUAIS:
- CTR: ${ctr}%
- CPC: R$ ${cpc}
- CPA: R$ ${cpa}
- ROAS: ${roas}x
- Frequência: ${frequencia}
- Impressões: ${impressoes}
- Cliques: ${cliques}
- Conversões: ${conversoes}
- Gasto: R$ ${gasto}
- Receita: R$ ${receita}

KPIs ALVO:
${JSON.stringify(kpis, null, 2)}

Retorne JSON:
{
  "score_geral": number (0-100),
  "status": "escalando/estável/atenção/pausar",
  "cor_status": "green/yellow/red",
  "diagnostico": "string (análise objetiva em 2-3 linhas)",
  "problemas": ["string"],
  "oportunidades": ["string"],
  "acoes_recomendadas": [
    {
      "acao": "string",
      "prioridade": "alta/media/baixa",
      "impacto_estimado": "string",
      "como_fazer": "string"
    }
  ],
  "decisao_orcamento": {
    "recomendacao": "aumentar/manter/reduzir/pausar",
    "percentual": number,
    "justificativa": "string"
  },
  "saturacao": {
    "nivel": "baixo/medio/alto/critico",
    "acao": "string"
  },
  "proximo_passo": "string"
}`;

  const analise = await callAIJSON(prompt);

  // Salva métricas e insight
  await supabase.from('metricas').insert({
    id: uuidv4(),
    campanha_id,
    ctr: Number(ctr),
    cpc: Number(cpc),
    cpa: Number(cpa),
    roas: Number(roas),
    frequencia: Number(frequencia),
    impressoes: Number(impressoes),
    cliques: Number(cliques),
    conversoes: Number(conversoes),
    gasto: Number(gasto),
    receita: Number(receita),
    score: analise.score_geral,
    created_at: new Date().toISOString()
  });

  await supabase.from('insights').insert({
    id: uuidv4(),
    campanha_id,
    tipo: 'analise_performance',
    conteudo: analise.diagnostico,
    acoes: analise.acoes_recomendadas,
    aprendizado: `Score ${analise.score_geral}/100 - ${analise.status}`,
    created_at: new Date().toISOString()
  });

  return analise;
}

export async function approveCampaign(campanha_id) {
  const { data: campanha, error } = await supabase
    .from('campanhas')
    .update({ aprovado: true, status: 'aprovado', aprovado_em: new Date().toISOString() })
    .eq('id', campanha_id)
    .select()
    .single();

  if (error) throw new Error('Campanha não encontrada');
  return { success: true, campanha };
}

export async function sendToMeta(campanha_id) {
  const { data: campanha } = await supabase
    .from('campanhas')
    .select('*')
    .eq('id', campanha_id)
    .single();

  if (!campanha?.aprovado) throw new Error('Campanha precisa ser aprovada antes de subir');
  if (!process.env.META_ACCESS_TOKEN) throw new Error('Token Meta Ads não configurado');

  // Estrutura para API do Meta
  const campaignPayload = {
    name: campanha.nome,
    objective: mapObjective(campanha.objetivo),
    status: 'PAUSED', // sempre começa pausada por segurança
    special_ad_categories: [],
    buying_type: 'AUCTION'
  };

  const metaResponse = await fetch(
    `https://graph.facebook.com/v19.0/${process.env.META_AD_ACCOUNT_ID}/campaigns`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...campaignPayload,
        access_token: process.env.META_ACCESS_TOKEN
      })
    }
  );

  const result = await metaResponse.json();

  if (result.error) throw new Error(`Meta API: ${result.error.message}`);

  await supabase.from('campanhas').update({
    status: 'enviado_meta',
    meta_campaign_id: result.id,
    enviado_em: new Date().toISOString()
  }).eq('id', campanha_id);

  return { success: true, meta_id: result.id, status: 'PAUSED' };
}

function mapObjective(objetivo) {
  const map = {
    'conversao': 'OUTCOME_SALES',
    'leads': 'OUTCOME_LEADS',
    'trafego': 'OUTCOME_TRAFFIC',
    'reconhecimento': 'OUTCOME_AWARENESS',
    'engajamento': 'OUTCOME_ENGAGEMENT'
  };
  return map[objetivo?.toLowerCase()] || 'OUTCOME_LEADS';
}

export async function listCampaigns(filters = {}) {
  let query = supabase.from('campanhas').select(`
    id, nome, nicho, produto, objetivo, orcamento, plataforma,
    status, aprovado, created_at, enviado_em,
    metricas (ctr, cpa, roas, gasto, score, created_at)
  `).order('created_at', { ascending: false });

  if (filters.status) query = query.eq('status', filters.status);
  if (filters.nicho) query = query.eq('nicho', filters.nicho);

  const { data, error } = await query.limit(50);
  if (error) throw error;
  return data;
}
