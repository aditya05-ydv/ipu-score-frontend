import SubjectRow from '../components/SubjectRow';
import ResultPanel from '../components/ResultPanel';
import { calcSGPA, gradeByMarks, newSubject, SEM_NAMES } from '../utils/gradeUtils';

export default function SemesterPage({ sem, semIdx, onChange }) {
  const subjects = sem.subjects;

  const setSubjects = (fn) => {
    onChange({ ...sem, subjects: fn(subjects), result: null });
  };

  const addSubject    = () => setSubjects((p) => [...p, newSubject()]);
  const removeSubject = (id) => setSubjects((p) => p.filter((s) => s.id !== id));
  const updateSubject = (updated) =>
    setSubjects((p) => p.map((s) => (s.id === updated.id ? updated : s)));

  const reset = () => {
    onChange({
      ...sem,
      subjects: [newSubject(), newSubject(), newSubject()],
      result: null,
    });
  };

  const calculate = () => {
    const valid = subjects.filter((s) => s.credits && (s.marks || s.gp));
    if (!valid.length) return;

    const processed = valid.map((s) => ({
      ...s,
      gp: s.marks
        ? (gradeByMarks(s.marks) || { gp: 0 }).gp
        : Number(s.gp),
    }));

    const result = calcSGPA(processed);
    if (result) {
      onChange({
        ...sem,
        subjects,
        result: { ...result, subjects: processed },
      });
    }
  };

  const semName = SEM_NAMES[semIdx] || `Semester ${semIdx + 1}`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3"
          style={{ color: 'var(--navy)' }}>
          {semName}
        </h2>
        <p className="text-[13px] mt-1" style={{ color: 'var(--muted)' }}>
          Enter your subject credits and marks to calculate SGPA
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl mb-5"
        style={{ background: 'var(--s1)', border: '1px solid var(--border)' }}>
        <span className="text-lg flex-shrink-0">📝</span>
        <div>
          <p className="text-[13px] font-semibold mb-0.5" style={{ color: 'var(--text)' }}>
            Works for any course — BBA, BA, Law, MCA, MBA and more
          </p>
          <p className="text-[12px] leading-relaxed" style={{ color: 'var(--muted)' }}>
            Enter each subject's{' '}
            <strong style={{ color: 'var(--blue)' }}>credits</strong> and{' '}
            <strong style={{ color: 'var(--blue)' }}>total marks out of 100</strong>.
            Subject name is optional. Grade points are calculated automatically.
          </p>
        </div>
      </div>

      {/* Subjects Card */}
      <div className="rounded-2xl p-4 sm:p-6 mb-5"
        style={{ background: 'var(--s1)', border: '1px solid var(--border)' }}>

        {/* Card header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[12px] font-bold uppercase tracking-widest"
            style={{ color: 'var(--navy)' }}>
            Subjects
          </span>
          <span className="text-[11px] font-mono" style={{ color: 'var(--muted2)' }}>
            {subjects.length} subject{subjects.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[1fr_64px_80px_90px_32px] sm:grid-cols-[1fr_80px_90px_100px_36px] gap-2 mb-2 px-0.5">
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
        {subjects.map((s) => (
          <SubjectRow
            key={s.id}
            s={s}
            onChange={updateSubject}
            onRemove={() => removeSubject(s.id)}
          />
        ))}

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap mt-5">
          <button onClick={addSubject}
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
      {sem.result && (
        <ResultPanel result={sem.result} semName={semName}/>
      )}
    </div>
  );
}