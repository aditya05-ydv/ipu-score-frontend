import { GRADES, getDivision } from '../utils/gradeUtils';

const DIVISIONS = [
  { range: 'CGPA = 10.00',   label: 'Exemplary Performance', cgpa: 10   },
  { range: 'CGPA ≥ 6.50',    label: 'First Division',        cgpa: 7    },
  { range: 'CGPA 5.00–6.49', label: 'Second Division',       cgpa: 5.5  },
  { range: 'CGPA 4.00–4.99', label: 'Third Division',        cgpa: 4.5  },
  { range: 'CGPA < 4.00',    label: 'Below Minimum',         cgpa: 3    },
];

export default function ReferencePage() {
  return (
    <div className="p-8 max-w-3xl">

      {/* ── Page Header ── */}
      <div className="mb-7">
        <h2 className="text-2xl font-extrabold flex items-center gap-3">
          📋 Grade Reference
        </h2>
        <p className="text-[var(--muted2)] text-sm mt-1.5">
          Official IPU grading scheme — Ordinance 11, Clause 11.5 & 13
        </p>
      </div>

      {/* ── Grade Cards ── */}
      <div className="bg-[var(--s1)] border border-[var(--border)] rounded-2xl p-6 mb-5">

        <div className="flex items-center gap-3 mb-5">
          <span className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--blue)]">
            Grading Scale
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
        </div>

        <div className="grid grid-cols-4 gap-3">
          {GRADES.map((g) => (
            <div
              key={g.g}
              className="rounded-xl p-4 text-center border transition-transform hover:scale-[1.03]"
              style={{
                background: g.color + '11',
                borderColor: g.color + '33',
              }}
            >
              <p
                className="text-2xl font-extrabold mb-1"
                style={{ color: g.color }}
              >
                {g.g}
              </p>
              <p className="text-[10px] font-mono text-[var(--muted2)]">
                {g.min === 0 ? '< 40' : `${g.min}–${g.max}`} marks
              </p>
              <p
                className="text-[12px] font-bold font-mono mt-2"
                style={{ color: g.color }}
              >
                {g.gp} pts
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Division Table ── */}
      <div className="bg-[var(--s1)] border border-[var(--border)] rounded-2xl p-6 mb-5">

        <div className="flex items-center gap-3 mb-5">
          <span className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--blue)]">
            Division Table
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
        </div>

        <div className="flex flex-col gap-2">
          {DIVISIONS.map((d) => {
            const div = getDivision(d.cgpa);
            return (
              <div
                key={d.label}
                className="flex items-center gap-4 px-4 py-3 rounded-xl bg-[var(--s2)] border border-[var(--border)] hover:border-[var(--border2)] transition-colors"
              >
                <span className="font-mono text-[12px] text-[var(--muted2)] min-w-[140px]">
                  {d.range}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-extrabold"
                  style={{ background: div.bg, color: div.color }}
                >
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Formulas ── */}
      <div className="bg-[var(--s1)] border border-[var(--border)] rounded-2xl p-6 mb-5">

        <div className="flex items-center gap-3 mb-5">
          <span className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--blue)]">
            Official Formulas
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
        </div>

        <div className="bg-[var(--s2)] rounded-xl p-5 font-mono text-[13px] leading-[2.4] border border-[var(--border)]">
          <div>
            <span className="text-[var(--blue)] font-bold">SGPA</span>
            <span className="text-[var(--muted2)]"> = Σ(Cᵢ × Gᵢ) / Σ(Cᵢ)</span>
          </div>
          <div>
            <span className="text-[var(--green)] font-bold">CGPA</span>
            <span className="text-[var(--muted2)]"> = ΣΣ(Cₙᵢ × Gₙᵢ) / ΣΣ(Cₙᵢ)</span>
          </div>
          <div>
            <span className="text-[var(--yellow)] font-bold">Percentage</span>
            <span className="text-[var(--muted2)]"> = CGPA × 10</span>
          </div>
          <div className="mt-3 text-[10px] text-[var(--muted)] leading-[1.9] border-t border-[var(--border)] pt-3">
            Cᵢ = credits of ith course<br />
            Gᵢ = grade point of ith course<br />
            Passing grade = P (40–44 marks, 4 grade points)<br />
            Grade F = 0 grade points (marks &lt; 40 or absent)
          </div>
        </div>
      </div>

      {/* ── Key Rules ── */}
      <div className="bg-[var(--s1)] border border-[var(--border)] rounded-2xl p-6">

        <div className="flex items-center gap-3 mb-5">
          <span className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--blue)]">
            Key Rules
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
        </div>

        <div className="flex flex-col gap-2.5">
          {[
            { icon: '📌', text: 'Max marks in any course = 100, regardless of credits' },
            { icon: '✅', text: 'Full credits awarded only after passing; no partial credits' },
            { icon: '📊', text: 'Theory: 25% internal + 75% end-term exam' },
            { icon: '🔬', text: 'Practical/Lab: 40% internal + 60% end-term exam' },
            { icon: '📅', text: 'Min. 75% attendance required to sit for exams' },
            { icon: '🔁', text: 'Promotion needs ≥ 50% of total year credits' },
            { icon: '🏆', text: 'Exemplary Performance: CGPA = 10, all first attempts' },
          ].map((r, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[var(--s2)] border border-[var(--border)]"
            >
              <span className="text-base flex-shrink-0">{r.icon}</span>
              <span className="text-[13px] text-[var(--muted2)] leading-snug">{r.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}