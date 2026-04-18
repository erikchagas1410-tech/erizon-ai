import React, { useState } from 'react';

const NAV = [
  { id: 'dashboard', icon: '⬡', label: 'COMMAND CENTER' },
  { id: 'nova-campanha', icon: '⊕', label: 'NOVA CAMPANHA' },
  { id: 'campanhas', icon: '◈', label: 'CAMPANHAS' },
  { id: 'analisar', icon: '◎', label: 'ANALISAR' },
  { id: 'copies', icon: '✦', label: 'COPIES' },
  { id: 'criativos', icon: '◆', label: 'CRIATIVOS' },
  { id: 'concorrentes', icon: '◉', label: 'INTELIGÊNCIA' },
];

export default function Sidebar({ current, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside style={{
      width: collapsed ? 64 : 220,
      minHeight: '100vh',
      background: 'var(--bg-1)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      position: 'sticky',
      top: 0,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 20px 24px', borderBottom: '1px solid var(--border)' }}>
        {!collapsed && (
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 20,
              color: 'var(--red)',
              letterSpacing: 4,
              textShadow: '0 0 20px var(--red-glow)',
              animation: 'flicker 8s infinite'
            }}>ERIZON</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 3, marginTop: 2, fontFamily: 'var(--font-mono)' }}>
              AI GROWTH SYSTEM
            </div>
          </div>
        )}
        {collapsed && (
          <div style={{ color: 'var(--red)', fontSize: 22, textAlign: 'center', textShadow: '0 0 15px var(--red-glow)' }}>E</div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 0' }}>
        {NAV.map(item => {
          const active = current === item.id;
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: collapsed ? '14px 20px' : '12px 20px',
                background: active ? 'var(--red-subtle)' : 'transparent',
                border: 'none',
                borderLeft: active ? '2px solid var(--red)' : '2px solid transparent',
                color: active ? 'var(--red)' : 'var(--text-muted)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: 2,
                fontWeight: active ? 700 : 400,
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <span style={{ fontSize: 16, minWidth: 20, textAlign: 'center',
                textShadow: active ? '0 0 10px var(--red-glow)' : 'none' }}>
                {item.icon}
              </span>
              {!collapsed && item.label}
            </button>
          );
        })}
      </nav>

      {/* Status indicator */}
      {!collapsed && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--green)',
              boxShadow: '0 0 8px rgba(0,255,136,0.8)',
              animation: 'pulse-red 2s infinite'
            }} />
            <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2 }}>
              SISTEMA ONLINE
            </span>
          </div>
        </div>
      )}

      {/* Collapse btn */}
      <button onClick={() => setCollapsed(!collapsed)} style={{
        padding: '12px', background: 'transparent', border: 'none',
        color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14,
        borderTop: '1px solid var(--border)',
      }}>
        {collapsed ? '→' : '←'}
      </button>
    </aside>
  );
}
