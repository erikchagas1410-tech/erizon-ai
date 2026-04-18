import React, { useState } from 'react';
import { Card, Btn, Input, Select, Textarea, PageHeader, LoadingSpinner, Badge, JsonBlock } from '../components/UI.jsx';
import { api } from '../utils/api.js';

const OBJETIVOS = [
  { value: 'leads', label: 'Geração de Leads' },
  { value: 'conversao', label: 'Conversão / Vendas' },
  { value: 'trafego', label: 'Tráfego para Site' },
  { value: 'reconhecimento', label: 'Reconhecimento de Marca' },
  { value: 'engajamento', label: 'Engajamento' },
];

const PLATAFORMAS = [
  { value: 'Meta Ads', label: 'Meta Ads (Facebook + Instagram)' },
  { value: 'Google Ads', label: 'Google Ads' },
  { value: 'TikTok Ads', label: 'TikTok Ads' },
  { value: 'Multi-plataforma', label: 'Multi-plataforma' },
];

const STEPS = ['BRIEFING', 'ESTRUTURA', 'COPIES', 'CONFIRMAR'];

export default function NewCampaign({ onNavigate }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nicho: '', produto: '', objetivo: 'leads', orcamento: '',
    publico_alvo: '', diferenciais: '', plataforma: 'Meta Ads'
  });
  const [campaign, setCampaign] = useState(null);
  const [copies, setCopies] = useState(null);
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const [sendingMeta, setSendingMeta] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleGenerate() {
    if (!form.nicho || !form.produto || !form.orcamento) return alert('Preencha todos os campos obrigatórios');
    setLoading(true);
    try {
      const data = await api.createCampaign(form);
      setCampaign(data);
      setStep(1);
    } catch (e) {
      alert('Erro: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    setLoading(true);
    try {
      const data = await api.generateCopy({
        campanha_id: campaign.id,
        produto: form.produto,
        nicho: form.nicho,
        publico: form.publico_alvo,
        objetivo: form.objetivo,
        variantes: 3
      });
      setCopies(data);
      setStep(2);
    } catch (e) {
      alert('Erro: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove() {
    setApproving(true);
    try {
      await api.approveCampaign(campaign.id);
      setApproved(true);
      setStep(3);
    } catch (e) {
      alert('Erro ao aprovar: ' + e.message);
    } finally {
      setApproving(false);
    }
  }

  async function handleSendMeta() {
    setSendingMeta(true);
    try {
      const res = await api.sendToMeta(campaign.id);
      alert(`✅ Campanha enviada ao Meta! ID: ${res.meta_id}\nStatus: PAUSADA (ative manualmente no Ads Manager)`);
    } catch (e) {
      alert('Erro Meta Ads: ' + e.message + '\n\nVerifique se o token META_ACCESS_TOKEN está configurado no .env');
    } finally {
      setSendingMeta(false);
    }
  }

  const dist = campaign?.distribuicao_orcamento;

  return (
    <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: 900 }}>
      <PageHeader title="NOVA CAMPANHA" subtitle="Deixa o sistema criar tudo — você só aprova" />

      {/* Steps */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 32 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <div style={{
              padding: '8px 20px',
              background: i <= step ? 'var(--red)' : 'var(--bg-2)',
              border: '1px solid',
              borderColor: i <= step ? 'var(--red)' : 'var(--border)',
              color: i <= step ? '#fff' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: 2,
              boxShadow: i === step ? '0 0 20px var(--red-glow)' : 'none',
            }}>
              {i + 1}. {s}
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 20, height: 1, background: i < step ? 'var(--red)' : 'var(--border)' }} />
            )}
          </div>
        ))}
      </div>

      {/* STEP 0: BRIEFING */}
      {step === 0 && (
        <Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input label="NICHO *" value={form.nicho} onChange={v => set('nicho', v)} placeholder="ex: arquitetura, imóveis, fitness..." />
            <Input label="PRODUTO / SERVIÇO *" value={form.produto} onChange={v => set('produto', v)} placeholder="ex: Consultoria de projetos residenciais" />
            <Select label="OBJETIVO *" value={form.objetivo} onChange={v => set('objetivo', v)} options={OBJETIVOS} />
            <Select label="PLATAFORMA" value={form.plataforma} onChange={v => set('plataforma', v)} options={PLATAFORMAS} />
            <Input label="ORÇAMENTO TOTAL (R$) *" value={form.orcamento} onChange={v => set('orcamento', v)} placeholder="ex: 3000" type="number" />
            <Textarea label="PÚBLICO-ALVO" value={form.publico_alvo} onChange={v => set('publico_alvo', v)} placeholder="ex: Mulheres 30-50 anos, classe A/B, interessadas em decoração..." rows={2} />
            <Textarea label="DIFERENCIAIS DO NEGÓCIO" value={form.diferenciais} onChange={v => set('diferenciais', v)} placeholder="O que torna esse negócio único?" rows={2} style={{ gridColumn: '1 / -1' }} />
          </div>
          <div style={{ marginTop: 24 }}>
            <Btn onClick={handleGenerate} loading={loading} style={{ minWidth: 200 }}>
              ⊕ GERAR CAMPANHA COMPLETA
            </Btn>
          </div>
          {loading && <LoadingSpinner text="ERIZON PENSANDO..." />}
        </Card>
      )}

      {/* STEP 1: ESTRUTURA */}
      {step === 1 && campaign && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card glow>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 4 }}>NOME DA CAMPANHA</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>{campaign.nome_campanha}</div>
              </div>
              <Badge color="yellow">{campaign.tipo_campanha?.split(' ')[0]}</Badge>
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: 13, lineHeight: 1.6 }}>{campaign.estrategia}</p>
          </Card>

          {/* Distribuição de orçamento */}
          {dist && (
            <Card>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 16 }}>
                DISTRIBUIÇÃO DE ORÇAMENTO — R$ {dist.total?.toLocaleString('pt-BR')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8, marginBottom: 12 }}>
                {[
                  ['PRINCIPAL', dist.campanha_principal, 'var(--red)'],
                  ['TESTE A/B', dist.teste_ab, 'var(--yellow)'],
                  ['RETARGETING', dist.retargeting, 'var(--green)'],
                  ['LOOKALIKE', dist.lookalike, '#8B5CF6'],
                  ['RESERVA', dist.reserva_escala, 'var(--text-muted)'],
                ].map(([lbl, val, color]) => val > 0 ? (
                  <div key={lbl} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', padding: '12px 14px', borderRadius: 2 }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2 }}>{lbl}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: 'var(--font-display)', marginTop: 4 }}>
                      R${val?.toLocaleString('pt-BR')}
                    </div>
                  </div>
                ) : null)}
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>
                {dist.justificativa}
              </p>
            </Card>
          )}

          {/* KPIs */}
          {campaign.kpis_alvo && (
            <Card>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 16 }}>KPIs ALVO</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {Object.entries(campaign.kpis_alvo).map(([k, v]) => (
                  <div key={k} style={{ padding: '8px 14px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 2 }}>
                    <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2 }}>{k.replace(/_/g,' ').toUpperCase()} </span>
                    <span style={{ fontSize: 12, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>{v}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <JsonBlock data={campaign} title="VER ESTRUTURA COMPLETA" />

          <div style={{ display: 'flex', gap: 12 }}>
            <Btn onClick={handleCopy} loading={loading} style={{ minWidth: 200 }}>
              ✦ GERAR COPIES AGORA
            </Btn>
            <Btn onClick={() => setStep(0)} variant="ghost">← VOLTAR</Btn>
          </div>
          {loading && <LoadingSpinner text="CRIANDO COPIES IRRESISTÍVEIS..." />}
        </div>
      )}

      {/* STEP 2: COPIES */}
      {step === 2 && copies && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 4 }}>
              ÂNGULO VENCEDOR ESTIMADO
            </div>
            <p style={{ color: 'var(--yellow)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
              {copies.angulo_vencedor_estimado}
            </p>
          </Card>

          {copies.copies?.map((copy, i) => (
            <Card key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <Badge color={['red','yellow','green'][i] || 'gray'}>VARIANTE {copy.variante}</Badge>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{copy.tipo?.toUpperCase()}</span>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 4 }}>HEADLINE</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', lineHeight: 1.3 }}>{copy.headline}</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 4 }}>COPY PRINCIPAL</div>
                <p style={{ color: 'var(--text-dim)', fontSize: 13, lineHeight: 1.6 }}>{copy.primary_text}</p>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {copy.cta && (
                  <div>
                    <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2 }}>CTA: </span>
                    <span style={{ fontSize: 11, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>{copy.cta}</span>
                  </div>
                )}
                {copy.hook_video && (
                  <div>
                    <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2 }}>HOOK: </span>
                    <span style={{ fontSize: 11, color: 'var(--yellow)', fontFamily: 'var(--font-mono)' }}>{copy.hook_video}</span>
                  </div>
                )}
              </div>
              {copy.porque_vai_converter && (
                <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--red-subtle)', border: '1px solid var(--border)', borderRadius: 2 }}>
                  <span style={{ fontSize: 10, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>▶ {copy.porque_vai_converter}</span>
                </div>
              )}
            </Card>
          ))}

          <div style={{ display: 'flex', gap: 12 }}>
            <Btn onClick={handleApprove} loading={approving} variant="success" style={{ minWidth: 200 }}>
              ✓ APROVAR E FINALIZAR
            </Btn>
            <Btn onClick={() => setStep(1)} variant="ghost">← VOLTAR</Btn>
          </div>
        </div>
      )}

      {/* STEP 3: CONFIRMAR */}
      {step === 3 && (
        <Card glow>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--green)', marginBottom: 8, textShadow: '0 0 20px rgba(0,255,136,0.5)' }}>
              CAMPANHA APROVADA
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
              {campaign?.nome_campanha}
            </div>
            <p style={{ color: 'var(--text-dim)', marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
              Campanha salva e aprovada. Clique abaixo para subir ao Meta Ads (ficará pausada para revisão final no Ads Manager).
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Btn onClick={handleSendMeta} loading={sendingMeta} style={{ minWidth: 200 }}>
                ↑ SUBIR NO META ADS
              </Btn>
              <Btn onClick={() => onNavigate('campanhas')} variant="outline">VER CAMPANHAS</Btn>
              <Btn onClick={() => { setStep(0); setCampaign(null); setCopies(null); setApproved(false); setForm({ nicho: '', produto: '', objetivo: 'leads', orcamento: '', publico_alvo: '', diferenciais: '', plataforma: 'Meta Ads' }); }} variant="ghost">
                NOVA CAMPANHA
              </Btn>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
