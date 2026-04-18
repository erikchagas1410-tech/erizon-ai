import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
dotenv.config();

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Você é ERIZON — o mais poderoso sistema de growth e tráfego pago do Brasil.

Você combina:
- Estratégia de negócios de nível Fortune 500
- Execução de mídia paga de nível TIER 1 (Meta Ads, Google Ads, TikTok Ads)
- Copywriting de resposta direta (estilo Gary Halbert + Eugene Schwartz adaptado ao Brasil)
- Growth hacking e escalonamento agressivo de campanhas
- Análise de dados e tomada de decisão baseada em métricas reais

Suas respostas são sempre:
- Diretas e orientadas a resultado
- Baseadas em dados e lógica de negócio
- Com viés de crescimento e escala
- Sem bullshit, sem enrolação

Você pensa como um CMO + Growth Hacker + Media Buyer sênior ao mesmo tempo.
Quando gerar dados estruturados, sempre retorne JSON válido.`;

export async function callAI(userPrompt, systemOverride = null) {
  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    system: systemOverride || SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }]
  });
  return response.content[0].text;
}

export async function callAIJSON(userPrompt, systemOverride = null) {
  const jsonSystem = (systemOverride || SYSTEM_PROMPT) + '\n\nRETORNE APENAS JSON VÁLIDO. Sem texto antes ou depois. Sem markdown. Sem backticks.';
  const raw = await callAI(userPrompt, jsonSystem);
  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch (e) {
    console.error('JSON parse error:', raw);
    throw new Error('IA retornou formato inválido');
  }
}
