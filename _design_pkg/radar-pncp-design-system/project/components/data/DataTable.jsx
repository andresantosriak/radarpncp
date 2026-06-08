import React from 'react';

const CSS = `
.rp-table-wrap{width:100%;overflow:auto;border:1px solid var(--border);border-radius:var(--radius-lg);background:var(--surface);}
.rp-table{width:100%;border-collapse:collapse;font-family:var(--font-sans);font-size:var(--text-sm);}
.rp-table thead th{position:sticky;top:0;background:var(--bg-subtle);text-align:left;
  font-size:var(--text-xs);font-weight:var(--fw-semibold);letter-spacing:var(--tracking-wide);
  text-transform:uppercase;color:var(--text-muted);padding:11px 16px;white-space:nowrap;
  border-bottom:1px solid var(--border);}
.rp-table tbody td{padding:13px 16px;border-bottom:1px solid var(--border-subtle);color:var(--text-body);vertical-align:middle;}
.rp-table tbody tr:last-child td{border-bottom:0;}
.rp-table tbody tr{transition:background var(--dur-fast) var(--ease-out);}
.rp-table--hover tbody tr:hover{background:var(--bg-subtle);cursor:pointer;}
.rp-table .num{font-family:var(--font-mono);font-variant-numeric:tabular-nums;}
.rp-table .ta-right{text-align:right;}
.rp-table .ta-center{text-align:center;}
.rp-table .strong{color:var(--text-strong);font-weight:var(--fw-semibold);}
`;
if (typeof document !== 'undefined' && !document.getElementById('rp-table-css')) {
  const s = document.createElement('style'); s.id = 'rp-table-css'; s.textContent = CSS;
  document.head.appendChild(s);
}

export function DataTable({ columns = [], rows = [], onRowClick, getRowKey, className = '' }) {
  return (
    <div className={`rp-table-wrap ${className}`}>
      <table className={['rp-table', onRowClick && 'rp-table--hover'].filter(Boolean).join(' ')}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={c.align === 'right' ? 'ta-right' : c.align === 'center' ? 'ta-center' : ''}
                style={c.width ? { width: c.width } : undefined}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={getRowKey ? getRowKey(row, i) : i} onClick={onRowClick ? () => onRowClick(row, i) : undefined}>
              {columns.map((c) => {
                const cls = [
                  c.mono && 'num',
                  c.align === 'right' ? 'ta-right' : c.align === 'center' ? 'ta-center' : '',
                  c.strong && 'strong',
                ].filter(Boolean).join(' ');
                return <td key={c.key} className={cls}>{c.render ? c.render(row[c.key], row, i) : row[c.key]}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
