import { useState } from 'react';
import { GRADES, gradeByMarks, getDivision } from '../utils/gradeUtils';

let _id = 1;
const newRow = () => ({ id: _id++, name: '', credits: '', marks: '', gp: '' });

export default function CGPAPage() {
  const [rows, setRows]       = useState([newRow(), newRow(), newRow()]);
  const [result, setResult]   = useState(null);

  const addRow    = () => setRows(p => [...p, newRow()]);
  const removeRow = (id) => setRows(p => p.filter(r => r.id !== id));
  const updateRow = (id, field, val) => {
    setRows(p => p.map(r => {
      if (r.id !== id) return r;
      if (field === 'marks') {
        const g = gradeByMarks(val);
        return { ...r, marks: val, gp: g ? String(g.gp) : '' };
      }
      if (field === 'gp') return { ...r, gp: val, marks: '' };
      return { ...r, [field]: val };
    }));
  };

  const calculate = () => {
    const valid = rows.filter(r => r.credits && (r.marks || r.gp));
    if (!valid.length) return;
    let tc = 0, tp = 0;
    valid.forEach(r => {
      const cr = Number(r.credits);
      const gp = r.marks
        ? (gradeByMarks(r.marks)?.gp ?? 0)
        : Number(r.gp);
      tc += cr;
      tp += cr * gp;
    });
    const sgpa = tp / tc;
    setResult({ sgpa, credits: tc, count: valid.length });
  };

  const reset = () => {
    setRows([newRow(), newRow(), newRow()]);
    setResult(null);
  };

  const div = result ? getDivision(result.sgpa) : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-3xl">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold"
          style={{ color: 'var(--navy)' }}>
          Manual SGPA Calculator
        </h2>
        <p className="text-[13px] mt-1" style={{ color: 'var(--muted)' }}>
          Calculate your SGPA manually by entering credits and total marks
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl mb-5"
        style={{ background: 'var(--blue-lt)', border: '1px solid #bfdbfe' }}>
        <span className="flex-shrink-0">📝</span>
        <p className="text-[12px] leading-relaxed" style={{ color: '#1e40af' }}>
          Works for <strong>any course</strong> — BBA, BA, Law, MCA, MBA and more.
          Enter each subject's <strong>credits</strong> and <strong>total marks out of 100</strong>.
          Subject name is optional. Grade points are calculated automatically.
        </p>
      </div>

      {/* Subjects card */}
      <div className="rounded-2xl p-4 sm:p-6 mb-5"
        style={{ background: 'var(--s1)', border: '1px solid var(--border)' }}>

        {/* Card header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[12px] font-bold uppercase tracking-widest"
            style={{ color: 'var(--navy)' }}>
            Subjects
          </span>
          <span className="text-[11px] font-mono"
            style={{ color: 'var(--muted2)' }}>
            {rows.length} subject{rows.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[1fr_64px_80px_90px_32px] sm:grid-cols-[1fr_80px_90px_100px_36px] gap-2 mb-3 px-0.5">
          {[
            { label: 'Subject Name', sub: 'optional'   },
            { label: 'Credits',      sub: 'e.g. 4'     },
            { label: 'Total Marks',  sub: 'out of 100' },
            { label: 'Grade Pt',     sub: 'or pick'    },
            { label: '',             sub: ''           },
          ].map((h, i) => (
            <div key={i}>
              <p className="text-[9px] font-bold tracking-widest uppercase font-mono leading-tight"
                style={{ color: 'var(--muted)' }}>
                {h.label}
              </p>
              {h.sub && (
                <p className="text-[8px] font-mono leading-tight opacity-60"
                  style={{ color: 'var(--muted)' }}>
                  {h.sub}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Subject rows */}
        {rows.map((r) => {
          const grade = gradeByMarks(r.marks);
          return (
            <div key={r.id}
              className="grid grid-cols-[1fr_64px_80px_90px_32px] sm:grid-cols-[1fr_80px_90px_100px_36px] gap-2 items-center mb-2 animate-fadeIn">

              {/* Name */}
              <input className="input-base" placeholder="Subject name (optional)"
                value={r.name}
                onChange={e => updateRow(r.id, 'name', e.target.value)}/>

              {/* Credits */}
              <input className="input-base text-center" type="number"
                min="1" max="6" placeholder="Cr"
                value={r.credits}
                onChange={e => updateRow(r.id, 'credits', e.target.value)}/>

              {/* Marks */}
              <div className="relative">
                <input className="input-base pr-10" type="number"
                  min="0" max="100" placeholder="Marks"
                  value={r.marks}
                  onChange={e => updateRow(r.id, 'marks', e.target.value)}/>
                {grade && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded pointer-events-none font-mono"
                    style={{ background: grade.color + '22', color: grade.color }}>
                    {grade.g}
                  </span>
                )}
              </div>

              {/* Grade Pt */}
              <select className="input-base text-center"
                value={r.gp}
                onChange={e => updateRow(r.id, 'gp', e.target.value)}>
                <option value="">Grade Pt</option>
                {GRADES.map(g => (
                  <option key={g.g} value={g.gp}>{g.g} — {g.gp}</option>
                ))}
              </select>

              {/* Remove */}
              <button onClick={() => removeRow(r.id)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-base transition-all"
                style={{ color: 'var(--muted2)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#fee2e2';
                  e.currentTarget.style.color = '#dc2626';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--muted2)';
                }}>
                ×
              </button>
            </div>
          );
        })}

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap mt-5">
          <button onClick={addRow}
            className="px-4 py-2 rounded-lg text-[12px] font-semibold transition-all"
            style={{
              background: 'var(--s2)',
              border:     '1px solid var(--border)',
              color:      'var(--muted)',
            }}>
            + Add Subject
          </button>

          <button onClick={calculate}
            className="px-5 py-2 rounded-lg text-white text-[13px] font-semibold transition-all"
            style={{ background: 'var(--navy)' }}>
            Calculate SGPA →
          </button>

          <button onClick={reset}
            className="px-4 py-2 rounded-lg text-[12px] font-semibold transition-all"
            style={{
              background: 'var(--s2)',
              border:     '1px solid var(--border)',
              color:      'var(--muted)',
            }}>
            Reset
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="rounded-2xl overflow-hidden animate-fadeIn"
          style={{ background: 'var(--s1)', border: '1px solid var(--border)' }}>

          {/* Result header */}
          <div className="px-5 py-4"
            style={{ background: 'var(--navy)', borderBottom: '1px solid var(--border)' }}>
            <h3 className="text-[14px] font-bold text-white">Your Result</h3>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-px"
            style={{ background: 'var(--border)' }}>
            {[
              { label: 'SGPA',       value: result.sgpa.toFixed(2),           color: 'var(--navy)'  },
              { label: 'Percentage', value: (result.sgpa * 10).toFixed(1)+'%', color: 'var(--blue)'  },
              { label: 'Credits',    value: result.credits,                    color: 'var(--green)' },
            ].map(stat => (
              <div key={stat.label} className="px-4 py-5 text-center"
                style={{ background: 'var(--s1)' }}>
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-1"
                  style={{ color: 'var(--muted)' }}>
                  {stat.label}
                </p>
                <p className="text-[24px] font-bold font-mono"
                  style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Division */}
          {div && (
            <div className="px-5 py-3 flex items-center gap-3"
              style={{ borderTop: '1px solid var(--border)' }}>
              <span className="text-[12px] font-semibold"
                style={{ color: 'var(--muted)' }}>
                Division:
              </span>
              <span className="px-4 py-1 rounded-full text-[12px] font-bold"
                style={{ background: div.bg, color: div.color }}>
                {div.label}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}