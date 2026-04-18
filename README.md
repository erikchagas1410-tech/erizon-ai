# ERIZON AI — Sistema Autônomo de Growth

> Geração de campanhas, copies, criativos, análise de performance, inteligência competitiva — tudo com IA.

---

## ESTRUTURA DO PROJETO

```
erizon-ai/
├── backend/          → Node.js + Express + Anthropic
│   ├── src/
│   │   ├── server.js
│   │   ├── config/supabase.js
│   │   ├── services/
│   │   │   ├── ai.service.js        → Cérebro (Claude claude-opus-4-5)
│   │   │   ├── campaign.service.js  → Campanhas, copies, análise
│   │   │   ├── creative.service.js  → Prompts de imagem
│   │   │   └── intelligence.service.js → Concorrentes, insights, dashboard
│   │   └── routes/
│   └── .env.example
├── frontend/         → React + Recharts (dashboard neon)
│   └── src/
│       ├── App.jsx
│       ├── components/
│       │   ├── Sidebar.jsx
│       │   └── UI.jsx
│       └── pages/
│           ├── Dashboard.jsx     → Command center com gráficos
│           ├── NewCampaign.jsx   → Wizard 4 etapas
│           ├── CopyGen.jsx       → Gerador de copies
│           ├── CreativeGen.jsx   → Prompts de imagem
│           ├── Competitor.jsx    → Inteligência competitiva
│           ├── Analyze.jsx       → Análise de métricas
│           └── CampaignList.jsx  → Lista de campanhas
└── supabase/
    └── schema.sql    → Execute no SQL Editor do Supabase
```

---

## CONFIGURAÇÃO (PASSO A PASSO)

### 1. Supabase
1. Crie um projeto em https://supabase.com
2. Vá em **SQL Editor** → cole e execute o conteúdo de `supabase/schema.sql`
3. Copie a **URL** e a **Service Role Key** das configurações do projeto

### 2. Backend
```bash
cd backend
cp .env.example .env
# Edite .env com suas chaves
npm install
npm run dev     # inicia na porta 3001
```

**Variáveis obrigatórias no .env:**
```
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
```

**Variáveis para ativar o Meta Ads:**
```
META_ACCESS_TOKEN=seu_token
META_AD_ACCOUNT_ID=act_XXXXXXXX
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev     # inicia na porta 5173
```

Acesse: http://localhost:5173

---

## FUNCIONALIDADES

| Módulo | O que faz |
|--------|-----------|
| **Nova Campanha** | Gera campanha completa (nome, estratégia, orçamento, públicos, KPIs, projeções) + copies + aprovação + envio ao Meta |
| **Copies** | Gera 2-3 variantes A/B com headline, copy, CTA, hook de vídeo e ângulo |
| **Criativos** | Gera prompts em inglês para Leonardo AI / Midjourney com conceito e composição |
| **Analisar** | Recebe métricas e retorna score, diagnóstico, decisão de orçamento e ações |
| **Inteligência** | Analisa concorrentes e biblioteca de anúncios com recomendações táticas |
| **Dashboard** | Visão geral com ROAS, CPA, CTR, gasto, receita e gráficos temporais |

---

## FLUXO DE APROVAÇÃO / META ADS

```
IA gera campanha
       ↓
Você revisa no dashboard
       ↓
Clica APROVAR
       ↓
(Opcional) Clica SUBIR NO META ADS
       ↓
Campanha sobe com status PAUSADA
       ↓
Você ativa manualmente no Ads Manager
```

> A campanha sempre sobe **PAUSADA** por segurança. Você ativa no Meta Ads Manager.

---

## MEMÓRIA E APRENDIZADO

Tudo é salvo no Supabase:
- Campanhas com estrutura e aprendizados
- Copies com performance (CTR, conversão)
- Métricas históricas por campanha
- Insights gerados pela IA

A cada nova campanha no mesmo nicho, o sistema consulta o histórico e melhora as recomendações automaticamente.

---

## PRÓXIMAS EVOLUÇÕES

- [ ] Webhook para receber métricas do Meta automaticamente
- [ ] Agendamento de análises (cron job diário)
- [ ] Multi-usuário / multi-cliente
- [ ] Geração de imagens automática via API
- [ ] Relatório PDF por campanha
- [ ] Integração Google Ads

---

## SUPORTE

Qualquer dúvida, abra uma issue ou entre em contato com a Erizon.
