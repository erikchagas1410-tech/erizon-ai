import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { StatCard, Card, Btn, Badge, LoadingSpinner, PageHeader } from '../components/UI.jsx';
import { api } from '../utils/api.js';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-3)', border: '1px solid var(--border)',
      padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 11
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    loadStats();
    return () => clearInterval(tick);
  }, []);

  async function loadStats() {
    try {
      const data = await api.getDashboard();
      setStats(data);
    } catch (e) {
      // Mostra mock se backend não estiver online
      setStats({
        total_campanhas: 0, campanhas_ativas: 0, campanhas_rascunho: 0,
        roas_medio: '0.00', cpa_medio: '0.00', ctr_medio: '0.00',
        gasto_total: '0.00', receita_total: '0.00', score_medio: '0.00',
        series_roas: [], series_gasto: []
      });
    } finally {
      setLoading(false);
    }
  }

  const roasNum = parseFloat(stats?.roas_medio || 0);
  const roasColor = roasNum >= 3 ? 'var(--green)' : roasNum >= 1.5 ? 'var(--yellow)' : 'var(--red)';

  return (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 3, marginBottom: 6 }}>
            COMMAND CENTER
          </div>
          <h1 style={{ fontWeight: 800, fontSize: 28, letterSpacing: 2, color: 'var(--text)' }}>
            ERIZON <span style={{ color: 'var(--red)', textShadow: '0 0 20px var(--red-glow)' }}>AI</span>
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: 'var(--red)', letterSpacing: 2, textShadow: '0 0 15px var(--red-glow)' }}>
            {time.toLocaleTimeString('pt-BR')}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: 2 }}>
            {time.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' }).toUpperCase()}
          </div>
        </div>
      </div>

      {loading ? <LoadingSpinner text="CARREGANDO SISTEMA..." /> : (
        <>
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
            <StatCard label="ROAS MÉDIO" value={stats.roas_medio} unit="x" color={roasColor} />
            <StatCard label="CPA MÉDIO" value={`R$${stats.cpa_medio}`} color="var(--yellow)" />
            <StatCard label="CTR MÉDIO" value={stats.ctr_medio} unit="%" color="var(--red)" />
            <StatCard label="GASTO TOTAL" value={`R$${parseFloat(stats.gasto_total).toLocaleString('pt-BR')}`} color="var(--text-dim)" />
            <StatCard label="RECEITA TOTAL" value={`R$${parseFloat(stats.receita_total).toLocaleString('pt-BR')}`} color="var(--green)" />
            <StatCard label="SCORE MÉDIO" value={stats.score_medio} unit="/100" color="var(--red)" />
          </div>

          {/* Campanhas overview */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <Card>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 16 }}>
                STATUS DAS CAMPANHAS
              </div>
              <div style={{ display: 'flex', gap: 24 }}>
                {[
                  { label: 'TOTAL', value: stats.total_campanhas, color: 'var(--text)' },
                  { label: 'ATIVAS', value: stats.campanhas_ativas, color: 'var(--green)' },
                  { label: 'RASCUNHO', value: stats.campanhas_rascunho, color: 'var(--yellow)' },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
                <Btn onClick={() => onNavigate('nova-campanha')} style={{ flex: 1 }}>⊕ CRIAR CAMPANHA</Btn>
                <Btn onClick={() => onNavigate('campanhas')} variant="outline" style={{ flex: 1 }}>VER TODAS</Btn>
              </div>
            </Card>

            {/* Quick actions */}
            <Card>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 16 }}>
                AÇÕES RÁPIDAS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: '✦ GERAR COPY', page: 'copies' },
                  { label: '◆ CRIATIVO', page: 'criativos' },
                  { label: '◎ ANALISAR', page: 'analisar' },
                  { label: '◉ CONCORRENTE', page: 'concorrentes' },
                ].map(a => (
                  <Btn key={a.page} onClick={() => onNavigate(a.page)} variant="ghost" style={{ fontSize: 10 }}>
                    {a.label}
                  </Btn>
                ))}
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Card>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 20 }}>
                EVOLUÇÃO DO ROAS
              </div>
              {stats.series_roas?.length > 1 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={stats.series_roas}>
                    <defs>
                      <linearGradient id="roasGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF1A1A" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#FF1A1A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="data" tick={{ fill: 'var(--text-muted)', fontSize: 9, fontFamily: 'var(--font-mono)' }} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 9, fontFamily: 'var(--font-mono)' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="valor" name="ROAS" stroke="#FF1A1A" fill="url(#roasGrad)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                  AGUARDANDO DADOS DE MÉTRICAS
                </div>
              )}
            </Card>

            <Card>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 20 }}>
                GASTO DIÁRIO (R$)
              </div>
              {stats.series_gasto?.length > 1 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={stats.series_gasto}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="data" tick={{ fill: 'var(--text-muted)', fontSize: 9, fontFamily: 'var(--font-mono)' }} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 9, fontFamily: 'var(--font-mono)' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="valor" name="Gasto" stroke="var(--yellow)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                  AGUARDANDO DADOS DE GASTO
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
