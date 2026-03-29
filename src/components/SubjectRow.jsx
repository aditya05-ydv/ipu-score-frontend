import { gradeByMarks, GRADES } from '../utils/gradeUtils';

export default function SubjectRow({ s, onChange, onRemove }) {
  const grade = gradeByMarks(s.marks);

  const handleMarks = (v) => {
    const g = gradeByMarks(v);
    onChange({ ...s, marks: v, gp: g ? String(g.gp) : '' });
  };

  const handleGP = (v) => {
    onChange({ ...s, gp: v, marks: '' });
  };

  return (
    <div className="grid grid-cols-[1fr_64px_80px_90px_32px] sm:grid-cols-[1fr_80px_90px_100px_36px] gap-2 items-center mb-2 animate-fadeIn">

      {/* Subject Name */}
      <input
        className="input-base"
        placeholder="Subject name (optional)"
        value={s.name}
        onChange={(e) => onChange({ ...s, name: e.target.value })}
      />

      {/* Credits */}
      <input
        className="input-base text-center"
        type="number"
        min="1"
        max="6"
        placeholder="Cr"
        value={s.credits}
        onChange={(e) => onChange({ ...s, credits: e.target.value })}
      />

      {/* Marks — auto computes grade */}
      <div className="relative">
        <input
          className="input-base pr-10"
          type="number"
          min="0"
          max="100"
          placeholder="Marks"
          value={s.marks}
          onChange={(e) => handleMarks(e.target.value)}
        />
        {grade && (
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded pointer-events-none font-mono"
            style={{ background: grade.color + '22', color: grade.color }}
          >
            {grade.g}
          </span>
        )}
      </div>

      {/* Grade Point dropdown */}
      <select
        className="input-base text-center"
        value={s.gp}
        onChange={(e) => handleGP(e.target.value)}
      >
        <option value="">Grade Pt</option>
        {GRADES.map((g) => (
          <option key={g.g} value={g.gp}>
            {g.g} — {g.gp}
          </option>
        ))}
      </select>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-transparent flex items-center justify-center text-base transition-all"
        style={{ color: 'var(--muted2)' }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#fee2e2';
          e.currentTarget.style.color = '#dc2626';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--muted2)';
        }}
      >
        ×
      </button>
    </div>
  );
}