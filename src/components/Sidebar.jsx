import { calcCGPA, toPercent, getDivision } from '../utils/gradeUtils';

export default function Sidebar({ semesters, activePage, setActivePage }) {
  const cgpaRes = calcCGPA(semesters);
  const div     = cgpaRes ? getDivision(cgpaRes.cgpa) : null;

  const navItems = [
    { id: 'ipu',  label: 'IPU Result Fetcher' },
    { id: 'cgpa', label: 'Calculate SGPA'     },
    { id: 'ref',  label: 'Grade Reference'    },
    { id: 'about', label: 'About'              },
  ];

  return (
    <aside className="w-60 h-screen flex flex-col overflow-hidden"
      style={{ background: 'var(--s1)', borderRight: '1px solid var(--border)' }}>

      {/* Logo */}
      <div className="px-5 pt-5 pb-4"
        style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: 'var(--navy)' }}>
            🎓
          </div>
          <span className="text-[15px] font-bold" style={{ color: 'var(--navy)' }}>
            IPU SCORE
          </span>
        </div>
        <p className="text-[11px] ml-10" style={{ color: 'var(--muted)' }}>
          Grade Calculator
        </p>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 py-3">

        <p className="text-[10px] font-semibold tracking-widest uppercase px-2 mb-2"
          style={{ color: 'var(--muted2)' }}>
          Tools
        </p>

        {navItems.map((t) => {
          const isActive = activePage === t.id;
          return (
            <button key={t.id} onClick={() => setActivePage(t.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium mb-0.5 transition-all text-left"
              style={{
                background: isActive ? 'var(--blue-lt)' : 'transparent',
                color:      isActive ? 'var(--blue)'    : 'var(--muted)',
                borderLeft: isActive ? '3px solid var(--blue)' : '3px solid transparent',
              }}>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* CGPA mini card */}
      <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="rounded-xl p-4 text-center cursor-pointer transition-all hover:shadow-sm"
          style={{ background: 'var(--s2)', border: '1px solid var(--border)' }}
          onClick={() => setActivePage('cgpa')}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1"
            style={{ color: 'var(--muted)' }}>
            Manual CGPA
          </p>
          {cgpaRes ? (
            <>
              <p className="text-[26px] font-bold font-mono leading-none"
                style={{ color: 'var(--navy)' }}>
                {cgpaRes.cgpa.toFixed(2)}
              </p>
              <p className="text-[11px] font-mono mt-1"
                style={{ color: 'var(--muted)' }}>
                {toPercent(cgpaRes.cgpa)}% · {cgpaRes.credits} cr
              </p>
              {div && (
                <span className="inline-block mt-2 text-[10px] font-semibold px-3 py-0.5 rounded-full"
                  style={{ background: div.bg, color: div.color }}>
                  {div.label}
                </span>
              )}
            </>
          ) : (
            <p className="text-[12px] mt-1" style={{ color: 'var(--muted2)' }}>
              No data yet
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}