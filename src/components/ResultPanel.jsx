import { gradeByMarks, gradeByGP, gradeByLetter } from '../utils/gradeUtils';

function GradeBadge({ g }) {
  const info = gradeByLetter(g);
  if (!info) return null;
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-[11px] font-bold font-mono"
      style={{ background: info.color + '22', color: info.color }}
    >
      {g}
    </span>
  );
}

export default function ResultPanel({ result, semName }) {
  return (
    <div className="mt-5 rounded-xl border animate-fadeIn overflow-hidden"
      style={{ background: 'var(--s1)', border: '1px solid var(--border)' }}>

      {/* Header */}
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <h3 className="text-[15px] font-bold" style={{ color: 'var(--navy)' }}>
          {semName} Results
        </h3>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-px" style={{ background: 'var(--border)' }}>
        {[
          { label: 'SGPA',       value: result.sgpa.toFixed(2),           sub: 'out of 10.00',  color: 'var(--navy)'  },
          { label: 'Percentage', value: (result.sgpa * 10).toFixed(1)+'%', sub: 'SGPA × 10',    color: 'var(--blue)'  },
          { label: 'Credits',    value: result.credits,                    sub: 'this semester', color: 'var(--green)' },
        ].map(stat => (
          <div key={stat.label} className="px-4 py-4 text-center"
            style={{ background: 'var(--s1)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1"
              style={{ color: 'var(--muted)' }}>
              {stat.label}
            </p>
            <p className="text-[22px] font-bold font-mono"
              style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--muted2)' }}>
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Subject Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr style={{ background: 'var(--table-hd)' }}>
              {['Subject', 'Cr', 'Marks', 'Grade', 'GP', 'Cr×GP'].map((h) => (
                <th key={h}
                  className="text-left font-semibold text-[11px] text-white px-4 py-3 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.subjects.map((s, i) => {
              const gi = s.marks ? gradeByMarks(s.marks) : gradeByGP(s.gp);
              return (
                <tr key={i}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--s2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className="px-4 py-3" style={{ color: 'var(--text)' }}>
                    {s.name || `Subject ${i + 1}`}
                  </td>
                  <td className="px-4 py-3 font-mono" style={{ color: 'var(--muted)' }}>
                    {s.credits}
                  </td>
                  <td className="px-4 py-3 font-mono" style={{ color: 'var(--muted)' }}>
                    {s.marks || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <GradeBadge g={gi?.g} />
                  </td>
                  <td className="px-4 py-3 font-mono" style={{ color: 'var(--muted)' }}>
                    {s.gp}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold" style={{ color: 'var(--blue)' }}>
                    {(Number(s.credits) * Number(s.gp)).toFixed(0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}