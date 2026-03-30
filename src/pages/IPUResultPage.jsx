import { useState, useEffect } from 'react';
import { GRADES, toPercent, getDivision } from '../utils/gradeUtils';

const BACKEND = import.meta.env.VITE_API_URL;


const gradeByTotal = (total) => {
  const n = Number(total);
  if (isNaN(n) || total === '-') return null;
  return GRADES.find(g => n >= g.min && n <= g.max) || GRADES[GRADES.length - 1];
};

// ── SGPA Line Graph ──
function SGPAGraph({ sgpaData }) {
  if (!sgpaData || sgpaData.length < 2) return null;

  const width = 520, height = 180;
  const padL = 38, padR = 24, padT = 28, padB = 32;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;

  const allSgpa = sgpaData.map(d => d.sgpa);
  const minV = Math.max(0, Math.floor(Math.min(...allSgpa)) - 1);
  const maxV = Math.min(10, Math.ceil(Math.max(...allSgpa)) + 1);

  const points = sgpaData.map((d, i) => ({
    x:    padL + (i / (sgpaData.length - 1)) * innerW,
    y:    padT + (1 - (d.sgpa - minV) / (maxV - minV)) * innerH,
    sgpa: d.sgpa,
    sem:  d.sem,
  }));

  const pathD = points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
  ).join(' ');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padT + innerH} L ${points[0].x} ${padT + innerH} Z`;
  const gridVs = Array.from({ length: 5 }, (_, i) => minV + ((maxV - minV) / 4) * i);
  const classAvg = sgpaData.reduce((a, b) => a + b.sgpa, 0) / sgpaData.length;
  const avgY = padT + (1 - (classAvg - minV) / (maxV - minV)) * innerH;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto" style={{ minWidth: 280, maxHeight: 200 }}>
        <defs>
          <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3b82f6" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01"/>
          </linearGradient>
        </defs>

        {gridVs.map((v, i) => {
          const y = padT + (1 - (v - minV) / (maxV - minV)) * innerH;
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={padL + innerW} y2={y}
                stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,3"/>
              <text x={padL - 5} y={y + 4} fontSize="8" fill="#94a3b8" textAnchor="end">
                {v.toFixed(1)}
              </text>
            </g>
          );
        })}

        <line x1={padL} y1={avgY} x2={padL + innerW} y2={avgY}
          stroke="#94a3b8" strokeWidth="1" strokeDasharray="5,4"/>
        <text x={padL + innerW + 4} y={avgY + 4} fontSize="8" fill="#94a3b8">Avg</text>

        <path d={areaD} fill="url(#areaG)"/>
        <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"/>

        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4.5" fill="#fff" stroke="#3b82f6" strokeWidth="2.5"/>
            <text x={p.x} y={p.y - 9} fontSize="8" fill="#1a2332"
              textAnchor="middle" fontWeight="600">
              {p.sgpa.toFixed(2)}
            </text>
            <text x={p.x} y={padT + innerH + 14} fontSize="8"
              fill="#94a3b8" textAnchor="middle">
              S{p.sem}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ── Subject Bar Graph ──
function SubjectGraph({ subjects, credits }) {
  if (!subjects || subjects.length === 0) return null;

  const width = 520, height = 160;
  const padL = 30, padR = 16, padT = 20, padB = 48;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const barW = Math.min(32, (innerW / subjects.length) - 6);

  return (
    <div className="w-full overflow-x-auto mt-3">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto" style={{ minWidth: 280, maxHeight: 170 }}>

        {[0, 25, 50, 75, 100].map(v => {
          const y = padT + (1 - v / 100) * innerH;
          return (
            <g key={v}>
              <line x1={padL} y1={y} x2={padL + innerW} y2={y}
                stroke="#e2e8f0" strokeWidth="1"/>
              <text x={padL - 4} y={y + 4} fontSize="7" fill="#94a3b8" textAnchor="end">
                {v}
              </text>
            </g>
          );
        })}

        {subjects.map((s, i) => {
          const x = padL + (i / subjects.length) * innerW + (innerW / subjects.length - barW) / 2;
          const pct = Math.min(100, Math.max(0, Number(s.total) || 0));
          const barH = (pct / 100) * innerH;
          const barY = padT + innerH - barH;
          const color = Number(s.total) < 40 ? '#dc2626' : '#3b82f6';
          const shortName = s.name
            ? (s.name.length > 8 ? s.name.substring(0, 7) + '…' : s.name)
            : `S${i + 1}`;
          const cr = credits ? credits[s.code] : null;

          return (
            <g key={i}>
              <rect x={x} y={barY} width={barW} height={barH} rx="3"
                fill={color} fillOpacity="0.8"/>
              <text x={x + barW / 2} y={barY - 3} fontSize="7.5"
                fill="#1a2332" textAnchor="middle" fontWeight="600">
                {pct}
              </text>
              <text x={x + barW / 2} y={padT + innerH + 12} fontSize="7"
                fill="#64748b" textAnchor="middle">
                {shortName}
              </text>
              {cr && (
                <text x={x + barW / 2} y={padT + innerH + 22} fontSize="7"
                  fill="#94a3b8" textAnchor="middle">
                  {cr}cr
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Stat Card ──
function StatCard({ label, value, color }) {
  return (
    <div className="rounded-xl p-4 text-center"
      style={{ background: 'var(--s2)', border: '1px solid var(--border)' }}>
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-1"
        style={{ color: 'var(--muted)' }}>
        {label}
      </p>
      <p className="text-[22px] font-bold font-mono"
        style={{ color: color || 'var(--navy)' }}>
        {value}
      </p>
    </div>
  );
}

// ════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════
export default function IPUResultPage({ session, setSession }) {

  const step         = session.step;
  const studentData  = session.studentData;
  const allResults   = session.allResults;
  const credits      = session.credits;

  const setStep        = (v) => setSession(p => ({ ...p, step: v }));
  const setStudentData = (v) => setSession(p => ({ ...p, studentData: v }));
  const setAllResults  = (v) => setSession(p => ({ ...p, allResults: v }));
  const setCredits     = (v) => setSession(p => ({ ...p, credits: v }));

  const [username,   setUsername]   = useState('');
  const [password,   setPassword]   = useState('');
  const [captchaVal, setCaptchaVal] = useState('');
  const [captchaUrl, setCaptchaUrl] = useState('');
  const [loading,    setLoading]    = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error,      setError]      = useState('');
  const [activeSem,  setActiveSem]  = useState('overall');

  const loadCaptcha = () => {
    setCaptchaUrl(`${BACKEND}/api/captcha?t=${Date.now()}`);
    setCaptchaVal('');
  };

  useEffect(() => { loadCaptcha(); }, []);

  const fetchCredit = async (code) => {
    try {
      const res  = await fetch(`${BACKEND}/api/credit/${code}`, { credentials: 'include' });
      const data = await res.json();
      return data;
    } catch {
      return { found: false, credits: null };
    }
  };

  const processResults = async (rawResults) => {
    const grouped = {};
    for (const row of rawResults) {
      const sem   = row[0];
      const code  = row[1]?.trim().toUpperCase();
      const name  = row[2];
      const int_  = row[3];
      const ext   = row[4];
      const total = row[5];

      if (!grouped[sem]) grouped[sem] = [];
      const existing = grouped[sem].findIndex(s => s.code === code);
      const entry = { code, name, internal: int_, external: ext, total, grade: gradeByTotal(total) };

      if (existing >= 0) {
        if (Number(total) > Number(grouped[sem][existing].total))
          grouped[sem][existing] = entry;
      } else {
        grouped[sem].push(entry);
      }
    }

    const allCodes  = [...new Set(rawResults.map(r => r[1]?.trim().toUpperCase()))];
    const creditMap = {};

   // FAST - all at once
await Promise.all(
  allCodes.map(async (code) => {
    const result = await fetchCredit(code);
    creditMap[code] = result.found ? result.credits : null;
  })
);

    setCredits(creditMap);
    return grouped;
  };

  const handleLogin = async () => {
    if (!username || !password || !captchaVal) {
      setError('Please fill all fields'); return;
    }
    setLoading(true); setError('');
    try {
      setLoadingMsg('Logging into IPU portal…');
      const loginRes  = await fetch(`${BACKEND}/api/login`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, captcha: captchaVal }),
      });
      const loginData = await loginRes.json();

      if (!loginData.success) {
        setError(loginData.error || 'Login failed. Check credentials or CAPTCHA.');
        loadCaptcha(); setLoading(false); return;
      }

      setLoadingMsg('Fetching all semester results…');
      const resultRes  = await fetch(`${BACKEND}/api/result`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const resultData = await resultRes.json();

      if (!resultData.success) {
        setError(resultData.error || 'Failed to fetch results.');
        setLoading(false); return;
      }

      setLoadingMsg('Calculating SGPA & CGPA…');
      const grouped = await processResults(resultData.results);
      setStudentData(resultData.student);
      setAllResults(grouped);
      setActiveSem('overall');
      setStep('result');

    } catch {
  setError('Network error. Please try again.');
}
    setLoading(false);
  };

  const calcSemSGPA = (subjects) => {
    let tc = 0, tp = 0;
    subjects.forEach(s => {
      const cr = credits[s.code], gp = s.grade?.gp;
      if (cr && gp !== undefined) { tc += cr; tp += cr * gp; }
    });
    return tc > 0 ? { sgpa: tp / tc, credits: tc } : null;
  };

  const calcOverall = () => {
    let tc = 0, tp = 0;
    Object.values(allResults).forEach(subjects => {
      const r = calcSemSGPA(subjects);
      if (r) { tc += r.credits; tp += r.credits * r.sgpa; }
    });
    return tc > 0 ? { cgpa: tp / tc, credits: tc } : null;
  };

  const overall    = calcOverall();
  const div        = overall ? getDivision(overall.cgpa) : null;
  const sortedSems = Object.keys(allResults).sort((a, b) => Number(a) - Number(b));

  const sgpaGraphData = sortedSems.map(sem => {
    const r = calcSemSGPA(allResults[sem]);
    return r ? { sem: Number(sem), sgpa: r.sgpa } : null;
  }).filter(Boolean);

  const currentSemSubjects = activeSem !== 'overall' ? allResults[activeSem] : null;
  const currentSemSGPA     = currentSemSubjects ? calcSemSGPA(currentSemSubjects) : null;

  // ════════════════════════════════════
  // LOGIN PAGE
  // ════════════════════════════════════
  if (step === 'login') {
    return (
      <div className="p-4 sm:p-6 lg:p-8 w-full max-w-2xl mx-auto">

        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2"
            style={{ color: 'var(--navy)' }}>
            🎓 IPU Result Portal
          </h2>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Enter your IPU portal credentials to view your complete academic result
          </p>
        </div>

        <div className="flex items-start gap-3 px-4 py-3 rounded-xl mb-6"
          style={{ background: 'var(--green-lt)', border: '1px solid #86efac' }}>
          <span className="flex-shrink-0">🔒</span>
          <p className="text-[12px] leading-relaxed" style={{ color: '#166534' }}>
            <strong>100% Safe.</strong> We never store your password or enrollment number.
            Used only once to fetch your result, then immediately discarded.
          </p>
        </div>

        <div className="rounded-2xl p-6"
          style={{
            background:  'var(--s1)',
            border:      '1px solid var(--border)',
            boxShadow:   '0 2px 16px rgba(0,0,0,0.06)',
          }}>

          <h3 className="text-[11px] font-bold tracking-[2px] uppercase mb-5 pb-3 inline-block"
            style={{ color: 'var(--blue)', borderBottom: '2px solid var(--blue)' }}>
            IPU Portal Login
          </h3>

          <div className="mb-4">
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: 'var(--muted)' }}>
              Enrollment Number
            </label>
            <input className="input-base" type="number"
              placeholder="e.g. 06416403223"
              value={username}
              onChange={e => setUsername(e.target.value)}/>
          </div>

          <div className="mb-4">
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: 'var(--muted)' }}>
              Password
            </label>
            <input className="input-base" type="password"
              placeholder="Enter your IPU portal password"
              value={password}
              onChange={e => setPassword(e.target.value)}/>
          </div>

          <div className="mb-5">
            <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: 'var(--muted)' }}>
              Security Captcha
            </label>
            <div className="flex items-center gap-3 mb-2">
              {captchaUrl && (
                <img src={captchaUrl} alt="CAPTCHA" className="rounded-lg"
                  style={{ height: 44, border: '1px solid var(--border)', background: '#fff' }}/>
              )}
              <button onClick={loadCaptcha}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-all"
                style={{
                  background: 'var(--s2)',
                  border:     '1px solid var(--border)',
                  color:      'var(--muted)',
                }}>
                ↻ Refresh
              </button>
            </div>
            <input className="input-base" type="text"
              placeholder="Enter code shown above"
              value={captchaVal}
              onChange={e => setCaptchaVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}/>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-[12px]"
              style={{
                background: 'var(--red-lt)',
                border:     '1px solid #fca5a5',
                color:      'var(--red)',
              }}>
              ⚠️ {error}
            </div>
          )}

          {loading && (
            <div className="mb-4 px-4 py-3 rounded-xl text-[12px] flex items-center gap-3"
              style={{
                background: 'var(--blue-lt)',
                border:     '1px solid #bfdbfe',
                color:      'var(--blue)',
              }}>
              <div className="w-4 h-4 border-2 rounded-full flex-shrink-0 animate-spin"
                style={{ borderColor: '#bfdbfe', borderTopColor: 'var(--blue)' }}/>
              <span>{loadingMsg}</span>
            </div>
          )}

          <button onClick={handleLogin} disabled={loading}
            className="w-full py-3 rounded-xl text-white text-[14px] font-semibold transition-all disabled:opacity-50"
            style={{ background: 'var(--navy)' }}>
            {loading ? '⏳ Fetching your results…' : '🚀 Get My Complete Result'}
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════
  // RESULT PAGE
  // ════════════════════════════════════
  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">

      {/* Student Info */}
      <div className="rounded-2xl p-5 mb-4"
        style={{
          background:  'var(--s1)',
          border:      '1px solid var(--border)',
          boxShadow:   '0 2px 12px rgba(0,0,0,0.05)',
        }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--navy)' }}>
              Student Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-8 text-[13px]">
              {[
                { label: 'Enrollment Number', value: studentData?.nrollno },
                { label: 'Student Name',      value: studentData?.stname  },
                { label: 'Programme',         value: studentData?.prgname?.split('(')[0].trim() },
                { label: '📚 Branch',         value: studentData?.branchname || studentData?.prgname },
              ].map(({ label, value }) => value && (
                <div key={label} className="flex gap-2">
                  <span className="font-semibold min-w-[150px]" style={{ color: 'var(--text)' }}>
                    {label}:
                  </span>
                  <span style={{ color: 'var(--muted)' }}>{value}</span>
                </div>
              ))}
              {studentData?.iname && (
                <div className="flex gap-2 sm:col-span-2">
                  <span className="font-semibold min-w-[150px]" style={{ color: 'var(--text)' }}>
                    🏫 Institute:
                  </span>
                  <span style={{ color: 'var(--muted)' }}>{studentData.iname}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setSession({
                step:        'login',
                studentData: null,
                allResults:  {},
                credits:     {},
              });
              setUsername('');
              setPassword('');
              setCaptchaVal('');
              loadCaptcha();
            }}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
            style={{
              background: 'var(--s2)',
              border:     '1px solid var(--border)',
              color:      'var(--muted)',
            }}>
            ← New Search
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto"
        style={{
          background:   'var(--s1)',
          borderRadius: 12,
          padding:      6,
          border:       '1px solid var(--border)',
          boxShadow:    '0 2px 12px rgba(0,0,0,0.05)',
        }}>
        <button onClick={() => setActiveSem('overall')}
          className="px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all"
          style={{
            background: activeSem === 'overall' ? 'var(--navy)' : 'transparent',
            color:      activeSem === 'overall' ? '#fff'        : 'var(--muted)',
          }}>
          Overall
        </button>
        {sortedSems.map(sem => (
          <button key={sem} onClick={() => setActiveSem(sem)}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all"
            style={{
              background: activeSem === sem ? 'var(--navy)' : 'transparent',
              color:      activeSem === sem ? '#fff'        : 'var(--muted)',
            }}>
            Sem {sem}
          </button>
        ))}
      </div>

      {/* ── OVERALL TAB ── */}
      {activeSem === 'overall' && (
        <>
          {overall && (
            <div className="rounded-2xl p-5 mb-4"
              style={{
                background: 'var(--s1)',
                border:     '1px solid var(--border)',
                boxShadow:  '0 2px 12px rgba(0,0,0,0.05)',
              }}>
              <h3 className="text-[15px] font-bold mb-4" style={{ color: 'var(--navy)' }}>
                Overall Result
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard label="CGPA"       value={overall.cgpa.toFixed(3)}      color="var(--navy)"  />
                <StatCard label="Percentage" value={toPercent(overall.cgpa)+'%'}  color="var(--blue)"  />
                <StatCard label="Credits"    value={overall.credits}              color="var(--green)" />
                <div className="rounded-xl p-4 text-center"
                  style={{ background: 'var(--s2)', border: '1px solid var(--border)' }}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-2"
                    style={{ color: 'var(--muted)' }}>Division</p>
                  {div && (
                    <span className="inline-block text-[12px] font-bold px-3 py-1 rounded-full"
                      style={{ background: div.bg, color: div.color }}>
                      {div.label}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SGPA Graph */}
          {sgpaGraphData.length >= 2 && (
            <div className="rounded-2xl p-5 mb-4"
              style={{
                background: 'var(--s1)',
                border:     '1px solid var(--border)',
                boxShadow:  '0 2px 12px rgba(0,0,0,0.05)',
              }}>
              <h3 className="text-[14px] font-bold mb-3" style={{ color: 'var(--navy)' }}>
                Visualization
              </h3>
              <SGPAGraph sgpaData={sgpaGraphData}/>
            </div>
          )}

          {/* Breakdown table */}
          <div className="rounded-2xl mb-4 overflow-hidden"
            style={{
              background: 'var(--s1)',
              border:     '1px solid var(--border)',
              boxShadow:  '0 2px 12px rgba(0,0,0,0.05)',
            }}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h3 className="text-[15px] font-bold" style={{ color: 'var(--navy)' }}>
                Result Breakdown
              </h3>
            </div>
            <table className="w-full text-[13px] border-collapse">
              <thead>
                <tr style={{ background: 'var(--table-hd)' }}>
                  {['Semester', 'Marks', 'Percentage', 'SGPA'].map(h => (
                    <th key={h}
                      className="text-left text-white font-semibold px-5 py-3 text-[12px]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedSems.map(sem => {
                  const r      = calcSemSGPA(allResults[sem]);
                  const totalM = allResults[sem].reduce((a, s) => a + (Number(s.total) || 0), 0);
                  const totalMax = allResults[sem].length * 100;
                  const pct    = totalMax > 0 ? ((totalM / totalMax) * 100).toFixed(3) : '—';
                  return (
                    <tr key={sem}
                      className="cursor-pointer transition-colors"
                      style={{ borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--s2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      onClick={() => setActiveSem(sem)}>
                      <td className="px-5 py-3 font-medium" style={{ color: 'var(--text)' }}>
                        Semester {sem}
                      </td>
                      <td className="px-5 py-3 font-mono" style={{ color: 'var(--muted)' }}>
                        {totalM} / {totalMax}
                      </td>
                      <td className="px-5 py-3 font-mono" style={{ color: 'var(--muted)' }}>
                        {pct}%
                      </td>
                      <td className="px-5 py-3 font-mono font-bold" style={{ color: 'var(--navy)' }}>
                        {r ? r.sgpa.toFixed(3) : (
                          <span style={{ color: 'var(--yellow)' }}>Need credits</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── REAPPEAR TRACKER ── */}
          {(() => {
            const reappearSubjects = [];
            sortedSems.forEach(sem => {
              allResults[sem].forEach(s => {
                if (Number(s.total) < 40) {
                  reappearSubjects.push({ ...s, sem });
                }
              });
            });
            if (!reappearSubjects.length) return null;
            return (
              <div className="rounded-2xl mb-4 overflow-hidden"
                style={{ background: 'var(--s1)', border: '1px solid #fca5a5', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div className="px-5 py-4 flex items-center gap-3"
                  style={{ background: '#fef2f2', borderBottom: '1px solid #fca5a5' }}>
                  <span className="text-lg">⚠️</span>
                  <div>
                    <h3 className="text-[14px] font-bold" style={{ color: '#dc2626' }}>
                      Reappear / Backlog Tracker
                    </h3>
                    <p className="text-[11px]" style={{ color: '#ef4444' }}>
                      {reappearSubjects.length} subject{reappearSubjects.length > 1 ? 's' : ''} need attention
                    </p>
                  </div>
                </div>
                <table className="w-full text-[13px] border-collapse">
                  <thead>
                    <tr style={{ background: '#fff5f5' }}>
                      {['Semester', 'Subject', 'Marks', 'Status'].map(h => (
                        <th key={h}
                          className="text-left font-semibold px-5 py-3 text-[12px]"
                          style={{ color: '#dc2626', borderBottom: '1px solid #fca5a5' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reappearSubjects.map((s, i) => (
                      <tr key={i}
                        style={{ borderBottom: '1px solid #fee2e2' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fff5f5'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td className="px-5 py-3 font-mono font-bold" style={{ color: 'var(--navy)' }}>
                          Sem {s.sem}
                        </td>
                        <td className="px-5 py-3" style={{ color: 'var(--text)' }}>
                          {s.name}
                        </td>
                        <td className="px-5 py-3 font-mono font-bold" style={{ color: '#dc2626' }}>
                          {s.total}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold"
                              style={{ background: '#dc2626', color: '#fff' }}>
                              Backlog
                            </span>
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold"
                              style={{ background: '#1e293b', color: '#fff' }}>
                              Reappear
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-5 py-3"
                  style={{ background: '#fff5f5', borderTop: '1px solid #fca5a5' }}>
                  <p className="text-[11px]" style={{ color: '#ef4444' }}>
                    💡 Clear these subjects to improve your CGPA significantly
                  </p>
                </div>
              </div>
            );
          })()}
        </>
      )}

      {/* ── SEMESTER TAB ── */}
      {activeSem !== 'overall' && currentSemSubjects && (
        <>
          <div className="rounded-2xl p-5 mb-4"
            style={{
              background: 'var(--s1)',
              border:     '1px solid var(--border)',
              boxShadow:  '0 2px 12px rgba(0,0,0,0.05)',
            }}>
            <h3 className="text-[15px] font-bold mb-4" style={{ color: 'var(--navy)' }}>
              Sem {activeSem} Result
            </h3>
            {(() => {
              const totalM   = currentSemSubjects.reduce((a, s) => a + (Number(s.total) || 0), 0);
              const totalMax = currentSemSubjects.length * 100;
              const pct      = totalMax > 0 ? ((totalM / totalMax) * 100).toFixed(3) : '—';
              return (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <StatCard label="Marks"      value={`${totalM} / ${totalMax}`} color="var(--navy)"  />
                  <StatCard label="Percentage" value={`${pct}%`}                 color="var(--blue)"  />
                  <StatCard label="SGPA"
                    value={currentSemSGPA ? currentSemSGPA.sgpa.toFixed(3) : '—'}
                    color="var(--green)" />
                </div>
              );
            })()}
            <SubjectGraph subjects={currentSemSubjects} credits={credits}/>
          </div>

          {/* Subject table */}
          <div className="rounded-2xl mb-4 overflow-hidden"
            style={{
              background: 'var(--s1)',
              border:     '1px solid var(--border)',
              boxShadow:  '0 2px 12px rgba(0,0,0,0.05)',
            }}>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px] border-collapse">
                <thead>
                  <tr style={{ background: 'var(--table-hd)' }}>
                    {['Subject (Credits)', 'Int | Ext', 'Marks', 'Grade'].map(h => (
                      <th key={h}
                        className="text-left text-white font-semibold px-5 py-3 text-[12px] whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentSemSubjects.map((s, i) => {
                    const cr = credits[s.code];

                    return (
                      <tr key={i}
                        className="transition-colors"
                        style={{ borderBottom: '1px solid var(--border)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--s2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                        {/* Subject name + credits badge */}
                        <td className="px-5 py-3" style={{ color: 'var(--text)' }}>
                          <div className="font-medium">{s.name}</div>
                          <div className="mt-1">
                            {cr ? (
                              <span className="inline-block text-[11px] font-mono px-2 py-0.5 rounded"
                                style={{ background: '#e0f2fe', color: '#0369a1' }}>
                                {cr} credits ✓
                              </span>
                            ) : (
                              <span className="inline-block text-[11px] font-mono px-2 py-0.5 rounded"
                                style={{ background: 'var(--yel-lt)', color: 'var(--yellow)' }}>
                                ⚡ Credit unavailable
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-3 font-mono whitespace-nowrap"
                          style={{ color: 'var(--muted)' }}>
                          {s.internal} | {s.external}
                        </td>

                        <td className="px-5 py-3 font-mono font-bold"
                          style={{ color: 'var(--text)' }}>
                          {s.total}
                        </td>

                        <td className="px-5 py-3">
                          {s.grade && (
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold font-mono"
                              style={{ background: s.grade.color + '22', color: s.grade.color }}>
                              {s.grade.g}
                            </span>
                          )}
                          {Number(s.total) < 40 && (
                            <span className="ml-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold"
                              style={{ background: 'var(--red-lt)', color: 'var(--red)' }}>
                              Reappear
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}