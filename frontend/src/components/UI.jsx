import React from 'react';

export function Card({ children, style = {}, glow = false }) {
  return (
    <div style={{
      background: 'var(--bg-2)',
      border: `1px solid ${glow ? 'var(--border-bright)' : 'var(--border)'}`,
      borderRadius: 2,
      padding: 24,
      boxShadow: glow ? '0 0 30px var(--red-glow)' : 'none',
      ...style
    }}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, unit = '', trend, color = 'var(--red)' }) {
  return (
    <div style={{
      background: 'var(--bg-2)',
      border: '1px solid var(--border)',
      borderRadius: 2,
      padding: '20px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      }} />
      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color, textShadow: `0 0 20px ${color}40`, fontFamily: 'var(--font-display)' }}>
        {value}<span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4 }}>{unit}</span>
      </div>
      {trend && (
        <div style={{ fontSize: 11, color: trend > 0 ? 'var(--green)' : '#FF6B6B', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
          {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}

export function Btn({ children, onClick, variant = 'primary', disabled = false, loading = false, style = {} }) {
  const styles = {
    primary: {
      background: 'var(--red)',
      color: '#fff',
      border: 'none',
      boxShadow: '0 0 20px var(--red-glow)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--red)',
      border: '1px solid var(--red)',
    },
    ghost: {
      background: 'var(--red-subtle)',
      color: 'var(--red)',
      border: '1px solid var(--border)',
    },
    danger: {
      background: 'transparent',
      color: '#FF6B6B',
      border: '1px solid #FF6B6B44',
    },
    success: {
      background: 'transparent',
      color: 'var(--green)',
      border: '1px solid rgba(0,255,136,0.3)',
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...styles[variant],
        padding: '10px 20px',
        borderRadius: 2,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: 2,
        fontWeight: 700,
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s',
        ...style
      }}
    >
      {loading ? 'PROCESSANDO...' : children}
    </button>
  );
}

export function Input({ label, value, onChange, placeholder, type = 'text', style = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2 }}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: 'var(--bg-3)',
          border: '1px solid var(--border)',
          borderRadius: 2,
          padding: '10px 14px',
          color: 'var(--text)',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          outline: 'none',
          transition: 'border-color 0.2s',
          ...style
        }}
        onFocus={e => e.target.style.borderColor = 'var(--red)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  );
}

export function Select({ label, value, onChange, options, style = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2 }}>
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          background: 'var(--bg-3)',
          border: '1px solid var(--border)',
          borderRadius: 2,
          padding: '10px 14px',
          color: 'var(--text)',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          outline: 'none',
          cursor: 'pointer',
          ...style
        }}
        onFocus={e => e.target.style.borderColor = 'var(--red)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} style={{ background: 'var(--bg-3)' }}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export function Textarea({ label, value, onChange, placeholder, rows = 4, style = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 2 }}>
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          background: 'var(--bg-3)',
          border: '1px solid var(--border)',
          borderRadius: 2,
          padding: '10px 14px',
          color: 'var(--text)',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          outline: 'none',
          resize: 'vertical',
          ...style
        }}
        onFocus={e => e.target.style.borderColor = 'var(--red)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  );
}

export function Badge({ children, color = 'red' }) {
  const colors = {
    red: { bg: 'var(--red-subtle)', border: 'var(--border-bright)', text: 'var(--red)' },
    green: { bg: 'rgba(0,255,136,0.08)', border: 'rgba(0,255,136,0.3)', text: 'var(--green)' },
    yellow: { bg: 'rgba(255,184,0,0.08)', border: 'rgba(255,184,0,0.3)', text: 'var(--yellow)' },
    gray: { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)', text: 'var(--text-muted)' },
  };
  const c = colors[color] || colors.gray;
  return (
    <span style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.text,
      padding: '3px 10px',
      borderRadius: 2,
      fontSize: 9,
      fontFamily: 'var(--font-mono)',
      letterSpacing: 2,
      fontWeight: 700,
    }}>
      {children}
    </span>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 26,
          color: 'var(--text)',
          letterSpacing: 2,
          marginBottom: 6,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function LoadingSpinner({ text = 'PROCESSANDO...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 40 }}>
      <div style={{
        width: 40, height: 40,
        border: '2px solid var(--border)',
        borderTopColor: 'var(--red)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: 3 }}>
        {text}
      </span>
    </div>
  );
}

export function JsonBlock({ data, title }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ marginTop: 12 }}>
      <button onClick={() => setOpen(!open)} style={{
        background: 'none', border: 'none', color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)', fontSize: 10, cursor: 'pointer', letterSpacing: 2
      }}>
        {open ? '▼' : '▶'} {title || 'VER DADOS COMPLETOS'}
      </button>
      {open && (
        <pre style={{
          marginTop: 8,
          padding: 16,
          background: 'var(--bg-3)',
          border: '1px solid var(--border)',
          borderRadius: 2,
          fontSize: 11,
          color: 'var(--green)',
          overflow: 'auto',
          maxHeight: 400,
          fontFamily: 'var(--font-mono)',
        }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
