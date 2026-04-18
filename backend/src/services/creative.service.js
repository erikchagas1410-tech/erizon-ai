import { callAI, callAIJSON } from './ai.service.js';
import { supabase } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

export async function generateCreativePrompt(input) {
  const { produto, nicho, publico, emocao, formato, estilo, objetivo_visual } = input;

  const prompt = `
Você é um diretor criativo de nível mundial especialista em criativos que CONVERTEM.
Crie prompts para geração de imagens que transformam visualizações em cliques e cliques em vendas.

PRODUTO: ${produto}
NICHO: ${nicho}
PÚBLICO: ${publico}
EMOÇÃO PRINCIPAL: ${emocao}
FORMATO: ${formato} (ex: feed 1:1, stories 9:16, banner)
ESTILO VISUAL: ${estilo}
OBJETIVO DO VISUAL: ${objetivo_visual}

Retorne JSON:
{
  "prompts": [
    {
      "variante": "A",
      "descricao_conceito": "string (o que o criativo comunica)",
      "prompt_pt": "string (descrição em português do visual)",
      "prompt_en": "string (prompt em inglês para Leonardo AI / Midjourney)",
      "elementos_obrigatorios": ["string"],
      "cores": ["string"],
      "tipografia": "string",
      "composicao": "string",
      "gatilho_psicologico": "string",
      "porque_vai_converter": "string"
    },
    {
      "variante": "B",
      "descricao_conceito": "string",
      "prompt_pt": "string",
      "prompt_en": "string",
      "elementos_obrigatorios": ["string"],
      "cores": ["string"],
      "tipografia": "string",
      "composicao": "string",
      "gatilho_psicologico": "string",
      "porque_vai_converter": "string"
    }
  ],
  "diretrizes_gerais": "string",
  "o_que_evitar": ["string"],
  "recomendacao_vencedor": "string"
}`;

  const data = await callAIJSON(prompt);
  return data;
}

export async function saveCreative(input) {
  const { campanha_id, nicho, variante, prompt_pt, prompt_en, url_imagem, tipo, conceito } = input;

  const id = uuidv4();
  const { error } = await supabase.from('criativos').insert({
    id,
    campanha_id,
    nicho,
    variante,
    prompt_pt,
    prompt_en,
    url_imagem,
    tipo,
    conceito,
    status: 'ativo',
    created_at: new Date().toISOString()
  });

  if (error) throw error;
  return { id, success: true };
}

export async function analyzeCreative(input) {
  const { descricao_visual, metricas_se_houver, nicho, objetivo } = input;

  const prompt = `
Analise este criativo como especialista em performance de anúncios:

DESCRIÇÃO DO VISUAL: ${descricao_visual}
NICHO: ${nicho}
OBJETIVO: ${objetivo}
${metricas_se_houver ? `MÉTRICAS: ${JSON.stringify(metricas_se_houver)}` : ''}

Retorne JSON:
{
  "score_criativo": number (0-100),
  "pontos_fortes": ["string"],
  "pontos_fracos": ["string"],
  "gatilhos_presentes": ["string"],
  "gatilhos_ausentes": ["string"],
  "estimativa_ctr": "string",
  "publico_que_vai_reagir": "string",
  "melhorias_prioritarias": ["string"],
  "veredicto": "string"
}`;

  return await callAIJSON(prompt);
}
