import React, { useState } from 'react';
import { Card, Btn, Input, Select, Textarea, PageHeader, LoadingSpinner, Badge } from '../components/UI.jsx';
import { api } from '../utils/api.js';

// ====================== COPY GEN ======================
export function CopyGen() {
  const [form, setForm] = useState({ produto: '', nicho: '', publico: '', objetivo: 'leads', tom: 'direto e persuasivo', variantes: '3' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function run() {
    setLoading(true);
    try {
      const data = await api.generateCopy({ ...form, variantes: Number(form.variantes) });
      setResult(data);
    } catch (e) { alert(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: 900 }}>
      <PageHeader title="GERADOR DE COPIES" subtitle="Copies que convertem, geradas por IA" />
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="PRODUTO/SERVIÇO" value={form.produto} onChange={v => set('produto', v)} placeholder="ex: Mentoria de emagrecimento" />
            <Input label="NICHO" value={form.nicho} onChange={v => set('nicho', v)} placeholder="ex: saúde e fitness" />
            <Textarea label="PÚBLICO-ALVO" value={form.publico} onChange={v => set('publico', v)} placeholder="Quem você quer atingir?" rows={3} />
            <Select label="OBJETIVO" value={form.objetivo} onChange={v => set('objetivo', v)} options={[
              { value: 'leads', label: 'Capturar leads' },
              { value: 'conversao', label: 'Vender direto' },
              { value: 'engajamento', label: 'Engajar' },
              { value: 'trafego', label: 'Gerar tráfego' },
            ]} />
            <Input label="TOM DE VOZ" value={form.tom} onChange={v => set('tom', v)} placeholder="ex: urgente, emocional..." />
            <Select label="QTD VARIANTES" value={form.variantes} onChange={v => set('variantes', v)} options={[
              { value: '2', label: '2 variantes (A/B)' },
              { value: '3', label: '3 variantes (A/B/C)' },
            ]} />
            <Btn onClick={run} loading={loading}>✦ GERAR COPIES</Btn>
          </div>
        </Card>
        <div>
          {loading && <LoadingSpinner text="ESCREVENDO COPIES..." />}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {result.angulo_vencedor_estimado && (
                <Card>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 6 }}>ÂNGULO ESTIMADO VENCEDOR</div>
                  <p style={{ color: 'var(--yellow)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{result.angulo_vencedor_estimado}</p>
                </Card>
              )}
              {result.copies?.map((c, i) => (
                <Card key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <Badge color={['red','yellow','green'][i] || 'gray'}>VARIANTE {c.variante}</Badge>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{c.tipo?.toUpperCase()}</span>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 3 }}>HEADLINE</div>
                    <div style={{ fontSize: 17, fontWeight: 800 }}>{c.headline}</div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 3 }}>COPY</div>
                    <p style={{ color: 'var(--text-dim)', lineHeight: 1.6, fontSize: 13 }}>{c.primary_text}</p>
                  </div>
                  {c.cta && <div style={{ fontSize: 11, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>CTA: {c.cta}</div>}
                  {c.hook_video && <div style={{ fontSize: 11, color: 'var(--yellow)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>HOOK: {c.hook_video}</div>}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ====================== CREATIVE GEN ======================
export function CreativeGen() {
  const [form, setForm] = useState({ produto: '', nicho: '', publico: '', emocao: 'desejo', formato: 'Feed 1:1', estilo: '', objetivo_visual: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function run() {
    setLoading(true);
    try {
      const data = await api.generateCreativePrompt(form);
      setResult(data);
    } catch (e) { alert(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: 900 }}>
      <PageHeader title="GERADOR DE CRIATIVOS" subtitle="Prompts de imagem que convertem — use no Leonardo AI ou Midjourney" />
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="PRODUTO/SERVIÇO" value={form.produto} onChange={v => set('produto', v)} placeholder="ex: clínica estética" />
            <Input label="NICHO" value={form.nicho} onChange={v => set('nicho', v)} placeholder="ex: beleza e estética" />
            <Input label="PÚBLICO" value={form.publico} onChange={v => set('publico', v)} placeholder="ex: mulheres 25-45 anos" />
            <Select label="EMOÇÃO PRINCIPAL" value={form.emocao} onChange={v => set('emocao', v)} options={[
              { value: 'desejo', label: 'Desejo / Aspiração' },
              { value: 'medo', label: 'Medo / Dor' },
              { value: 'confianca', label: 'Confiança / Autoridade' },
              { value: 'curiosidade', label: 'Curiosidade' },
              { value: 'urgencia', label: 'Urgência / Escassez' },
            ]} />
            <Select label="FORMATO" value={form.formato} onChange={v => set('formato', v)} options={[
              { value: 'Feed 1:1', label: 'Feed 1:1 (quadrado)' },
              { value: 'Stories 9:16', label: 'Stories / Reels 9:16' },
              { value: 'Banner 16:9', label: 'Banner / YouTube' },
            ]} />
            <Input label="ESTILO VISUAL" value={form.estilo} onChange={v => set('estilo', v)} placeholder="ex: minimalista, luxo, vibrante..." />
            <Textarea label="OBJETIVO DO VISUAL" value={form.objetivo_visual} onChange={v => set('objetivo_visual', v)} placeholder="O que essa imagem precisa comunicar?" rows={2} />
            <Btn onClick={run} loading={loading}>◆ GERAR PROMPTS</Btn>
          </div>
        </Card>
        <div>
          {loading && <LoadingSpinner text="CRIANDO CONCEITOS VISUAIS..." />}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {result.diretrizes_gerais && (
                <Card>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 6 }}>DIRETRIZES GERAIS</div>
                  <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>{result.diretrizes_gerais}</p>
                  {result.o_que_evitar?.length > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 9, color: '#FF6B6B', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 4 }}>EVITAR</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {result.o_que_evitar.map((e, i) => <Badge key={i} color="gray">{e}</Badge>)}
                      </div>
                    </div>
                  )}
                </Card>
              )}
              {result.prompts?.map((p, i) => (
                <Card key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <Badge color={i === 0 ? 'red' : 'yellow'}>VARIANTE {p.variante}</Badge>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{p.gatilho_psicologico}</span>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 4 }}>CONCEITO</div>
                    <p style={{ color: 'var(--text)', fontSize: 13 }}>{p.descricao_conceito}</p>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 9, color: 'var(--yellow)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 6 }}>PROMPT INGLÊS (Leonardo AI / Midjourney)</div>
                    <pre style={{
                      background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 2,
                      padding: 12, fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)',
                      whiteSpace: 'pre-wrap', wordBreak: 'break-word'
                    }}>{p.prompt_en}</pre>
                    <Btn onClick={() => navigator.clipboard.writeText(p.prompt_en)} variant="ghost" style={{ marginTop: 6, fontSize: 9 }}>
                      COPIAR PROMPT
                    </Btn>
                  </div>
                  {p.porque_vai_converter && (
                    <div style={{ padding: '8px 12px', background: 'var(--red-subtle)', border: '1px solid var(--border)', borderRadius: 2 }}>
                      <span style={{ fontSize: 10, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>▶ {p.porque_vai_converter}</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ====================== COMPETITOR ======================
export function Competitor() {
  const [tab, setTab] = useState('concorrente');
  const [form1, setForm1] = useState({ nome_concorrente: '', nicho: '', anuncios_observados: '', posicionamento_percebido: '' });
  const [form2, setForm2] = useState({ nicho: '', objetivo: 'leads', plataforma: 'Meta' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runCompetitor() {
    setLoading(true);
    try { setResult(await api.analyzeCompetitor(form1)); }
    catch (e) { alert(e.message); }
    finally { setLoading(false); }
  }

  async function runLibrary() {
    setLoading(true);
    try { setResult(await api.getLibraryInsights(form2)); }
    catch (e) { alert(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: 900 }}>
      <PageHeader title="INTELIGÊNCIA COMPETITIVA" subtitle="Analise concorrentes e descubra o que está performando" />

      <div style={{ display: 'flex', gap: 0, marginBottom: 24 }}>
        {['concorrente', 'biblioteca'].map(t => (
          <button key={t} onClick={() => { setTab(t); setResult(null); }} style={{
            padding: '10px 24px', border: '1px solid',
            borderColor: tab === t ? 'var(--red)' : 'var(--border)',
            background: tab === t ? 'var(--red-subtle)' : 'transparent',
            color: tab === t ? 'var(--red)' : 'var(--text-muted)',
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, cursor: 'pointer',
          }}>
            {t === 'concorrente' ? 'ANALISAR CONCORRENTE' : 'BIBLIOTECA DE ANÚNCIOS'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>
        <Card>
          {tab === 'concorrente' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Input label="NOME DO CONCORRENTE" value={form1.nome_concorrente} onChange={v => setForm1(f => ({ ...f, nome_concorrente: v }))} placeholder="ex: Studio Silva Arquitetura" />
              <Input label="NICHO" value={form1.nicho} onChange={v => setForm1(f => ({ ...f, nicho: v }))} placeholder="ex: arquitetura" />
              <Textarea label="ANÚNCIOS OBSERVADOS" value={form1.anuncios_observados} onChange={v => setForm1(f => ({ ...f, anuncios_observados: v }))} placeholder="Descreva o que você viu nos anúncios deles..." rows={4} />
              <Textarea label="POSICIONAMENTO PERCEBIDO" value={form1.posicionamento_percebido} onChange={v => setForm1(f => ({ ...f, posicionamento_percebido: v }))} placeholder="Como eles se posicionam?" rows={3} />
              <Btn onClick={runCompetitor} loading={loading}>◉ ANALISAR</Btn>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Input label="NICHO" value={form2.nicho} onChange={v => setForm2(f => ({ ...f, nicho: v }))} placeholder="ex: imóveis de luxo" />
              <Select label="OBJETIVO" value={form2.objetivo} onChange={v => setForm2(f => ({ ...f, objetivo: v }))} options={[
                { value: 'leads', label: 'Leads' },
                { value: 'conversao', label: 'Conversão' },
                { value: 'reconhecimento', label: 'Reconhecimento' },
              ]} />
              <Select label="PLATAFORMA" value={form2.plataforma} onChange={v => setForm2(f => ({ ...f, plataforma: v }))} options={[
                { value: 'Meta', label: 'Meta Ads' },
                { value: 'Google', label: 'Google Ads' },
                { value: 'TikTok', label: 'TikTok Ads' },
              ]} />
              <Btn onClick={runLibrary} loading={loading}>◉ ANALISAR MERCADO</Btn>
            </div>
          )}
        </Card>

        <div>
          {loading && <LoadingSpinner text="ANALISANDO MERCADO..." />}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.entries(result).map(([key, val]) => {
                if (!val || (Array.isArray(val) && val.length === 0)) return null;
                const isObj = typeof val === 'object' && !Array.isArray(val);
                return (
                  <Card key={key}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 10 }}>
                      {key.replace(/_/g, ' ').toUpperCase()}
                    </div>
                    {Array.isArray(val) ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {val.map((item, i) => (
                          <div key={i} style={{ padding: '8px 12px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 2, fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                            {typeof item === 'string' ? item : JSON.stringify(item)}
                          </div>
                        ))}
                      </div>
                    ) : isObj ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {Object.entries(val).map(([k2, v2]) => (
                          <div key={k2} style={{ padding: '8px 12px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 2 }}>
                            <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2 }}>{k2.replace(/_/g,' ').toUpperCase()}: </span>
                            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{String(v2)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: key.includes('oportunidade') || key.includes('gold') ? 'var(--yellow)' : 'var(--text-dim)', fontSize: 13, lineHeight: 1.6 }}>
                        {String(val)}
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ====================== ANALYZE ======================
export function Analyze() {
  const [form, setForm] = useState({ campanha_id: '', ctr: '', cpc: '', cpa: '', roas: '', frequencia: '', impressoes: '', cliques: '', conversoes: '', gasto: '', receita: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function run() {
    setLoading(true);
    try { setResult(await api.analyzeCampaign(form)); }
    catch (e) { alert(e.message); }
    finally { setLoading(false); }
  }

  const statusColor = {
    escalando: 'var(--green)', estável: 'var(--yellow)',
    atenção: 'var(--yellow)', pausar: '#FF6B6B'
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: 900 }}>
      <PageHeader title="ANALISAR CAMPANHA" subtitle="Cole as métricas e receba diagnóstico + recomendações" />
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input label="ID DA CAMPANHA (opcional)" value={form.campanha_id} onChange={v => set('campanha_id', v)} placeholder="UUID salvo no sistema" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Input label="CTR (%)" value={form.ctr} onChange={v => set('ctr', v)} placeholder="ex: 1.8" type="number" />
              <Input label="CPC (R$)" value={form.cpc} onChange={v => set('cpc', v)} placeholder="ex: 0.85" type="number" />
              <Input label="CPA (R$)" value={form.cpa} onChange={v => set('cpa', v)} placeholder="ex: 42" type="number" />
              <Input label="ROAS (x)" value={form.roas} onChange={v => set('roas', v)} placeholder="ex: 3.2" type="number" />
              <Input label="FREQUÊNCIA" value={form.frequencia} onChange={v => set('frequencia', v)} placeholder="ex: 2.1" type="number" />
              <Input label="IMPRESSÕES" value={form.impressoes} onChange={v => set('impressoes', v)} placeholder="ex: 45000" type="number" />
              <Input label="CLIQUES" value={form.cliques} onChange={v => set('cliques', v)} placeholder="ex: 810" type="number" />
              <Input label="CONVERSÕES" value={form.conversoes} onChange={v => set('conversoes', v)} placeholder="ex: 19" type="number" />
              <Input label="GASTO (R$)" value={form.gasto} onChange={v => set('gasto', v)} placeholder="ex: 800" type="number" />
              <Input label="RECEITA (R$)" value={form.receita} onChange={v => set('receita', v)} placeholder="ex: 2560" type="number" />
            </div>
            <Btn onClick={run} loading={loading}>◎ ANALISAR AGORA</Btn>
          </div>
        </Card>
        <div>
          {loading && <LoadingSpinner text="ANALISANDO DADOS..." />}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Score + Status */}
              <Card glow>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 52, fontWeight: 800, color: result.score_geral >= 70 ? 'var(--green)' : result.score_geral >= 40 ? 'var(--yellow)' : '#FF6B6B', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                      {result.score_geral}
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2 }}>SCORE</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: statusColor[result.status] || 'var(--text)', marginBottom: 6, fontFamily: 'var(--font-display)', letterSpacing: 2 }}>
                      {result.status?.toUpperCase()}
                    </div>
                    <p style={{ color: 'var(--text-dim)', fontSize: 13, lineHeight: 1.5 }}>{result.diagnostico}</p>
                  </div>
                </div>
              </Card>

              {/* Decisão orçamento */}
              {result.decisao_orcamento && (
                <Card>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 10 }}>DECISÃO DE ORÇAMENTO</div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <Badge color={result.decisao_orcamento.recomendacao === 'aumentar' ? 'green' : result.decisao_orcamento.recomendacao === 'pausar' ? 'red' : 'yellow'}>
                      {result.decisao_orcamento.recomendacao?.toUpperCase()}
                    </Badge>
                    {result.decisao_orcamento.percentual !== 0 && (
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)', fontSize: 14 }}>
                        {result.decisao_orcamento.percentual > 0 ? '+' : ''}{result.decisao_orcamento.percentual}%
                      </span>
                    )}
                    <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>{result.decisao_orcamento.justificativa}</span>
                  </div>
                </Card>
              )}

              {/* Ações */}
              {result.acoes_recomendadas?.length > 0 && (
                <Card>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 12 }}>AÇÕES RECOMENDADAS</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {result.acoes_recomendadas.map((a, i) => (
                      <div key={i} style={{ padding: '12px 14px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 2, borderLeft: `3px solid ${a.prioridade === 'alta' ? 'var(--red)' : a.prioridade === 'media' ? 'var(--yellow)' : 'var(--border)'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, fontSize: 13 }}>{a.acao}</span>
                          <Badge color={a.prioridade === 'alta' ? 'red' : a.prioridade === 'media' ? 'yellow' : 'gray'}>{a.prioridade?.toUpperCase()}</Badge>
                        </div>
                        <p style={{ color: 'var(--text-dim)', fontSize: 12, marginBottom: 4 }}>{a.como_fazer}</p>
                        <span style={{ fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>↑ {a.impacto_estimado}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {result.proximo_passo && (
                <Card>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 6 }}>PRÓXIMO PASSO</div>
                  <p style={{ color: 'var(--yellow)', fontSize: 13, fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>▶ {result.proximo_passo}</p>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ====================== CAMPAIGN LIST ======================
export function CampaignList({ onNavigate }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    api.listCampaigns().then(d => { setCampaigns(d || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const statusBadge = (s) => {
    if (s === 'aprovado' || s === 'enviado_meta') return 'green';
    if (s === 'rascunho') return 'yellow';
    return 'gray';
  };

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <PageHeader
        title="CAMPANHAS"
        subtitle={`${campaigns.length} campanhas no sistema`}
        action={<Btn onClick={() => onNavigate('nova-campanha')}>⊕ NOVA CAMPANHA</Btn>}
      />
      {loading ? <LoadingSpinner /> : campaigns.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            NENHUMA CAMPANHA AINDA — CRIE A PRIMEIRA
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {campaigns.map(c => {
            const lastMetric = c.metricas?.[0];
            return (
              <Card key={c.id} style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{c.nome}</div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <Badge color="gray">{c.nicho}</Badge>
                      <Badge color="gray">{c.plataforma}</Badge>
                      <Badge color="gray">{c.objetivo}</Badge>
                      <Badge color={statusBadge(c.status)}>{c.status?.toUpperCase()}</Badge>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--red)', fontFamily: 'var(--font-display)' }}>
                      R${c.orcamento?.toLocaleString('pt-BR')}
                    </div>
                    {lastMetric && (
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        ROAS {lastMetric.roas} | CTR {lastMetric.ctr}%
                      </div>
                    )}
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                      {new Date(c.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
