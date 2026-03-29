import { useState } from 'react';
import Sidebar from './components/Sidebar';
import SemesterPage from './pages/SemesterPage';
import CGPAPage from './pages/CGPAPage';
import ReferencePage from './pages/ReferencePage';
import AboutPage from './pages/AboutPage';
import IPUResultPage from './pages/IPUResultPage';
import { newSubject, SEM_NAMES } from './utils/gradeUtils';


const createSemester = () => ({
  subjects: [newSubject(), newSubject(), newSubject()],
  result:   null,
});

export default function App() {
  const [semesters, setSemesters]     = useState([
    createSemester(), createSemester(),
    createSemester(), createSemester(),
  ]);
  const [activePage, setActivePage]   = useState('ipu');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── IPU session persists across page switches ──
  const [ipuSession, setIpuSession] = useState({
    step:         'login',
    studentData:  null,
    allResults:   {},
    credits:      {},
    creditStatus: {},
  });

  const updateSemester = (idx, updated) =>
    setSemesters(prev => prev.map((s, i) => i === idx ? updated : s));

  const addSemester = () => {
    if (semesters.length >= 8) return;
    const newIdx = semesters.length;
    setSemesters(prev => [...prev, createSemester()]);
    setActivePage(`sem-${newIdx}`);
    setSidebarOpen(false);
  };

  const handleSetPage = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  const renderPage = () => {
    if (activePage === 'ipu')   return (
      <IPUResultPage
        session={ipuSession}
        setSession={setIpuSession}
      />
    );
    
    if (activePage === 'cgpa')  return <CGPAPage semesters={semesters}/>;
    if (activePage === 'about') return <AboutPage />;
    if (activePage === 'ref')   return <ReferencePage/>;

    const idx = parseInt(activePage.split('-')[1]);
    if (!isNaN(idx) && semesters[idx]) {
      return (
        <SemesterPage
          sem={semesters[idx]}
          semIdx={idx}
          onChange={updated => updateSemester(idx, updated)}
        />
      );
    }
    return null;
  };

  const pageLabel = () => {
    if (activePage === 'ipu')   return 'IPU Result Fetcher';
    if (activePage === 'cgpa')  return 'Calculate SGPA';
    if (activePage === 'about') return 'About';
    if (activePage === 'ref')   return 'Grade Reference';
    const idx = parseInt(activePage.split('-')[1]);
    return SEM_NAMES[idx] || `Sem ${idx + 1}`;
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setSidebarOpen(false)}/>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:flex-shrink-0
      `}>
        <Sidebar
          semesters={semesters}
          activePage={activePage}
          setActivePage={handleSetPage}
          onAddSemester={addSemester}
        />
      </div>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">

        {/* Mobile top bar */}
        <div className="flex items-center gap-3 px-4 py-3 lg:hidden flex-shrink-0"
          style={{ background: 'var(--s1)', borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
            style={{ background: 'var(--s2)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
            ☰
          </button>
          <span className="font-bold text-[14px] truncate" style={{ color: 'var(--navy)' }}>
            {pageLabel()}
          </span>
          <span className="ml-auto text-[10px] font-mono px-2 py-1 rounded-md flex-shrink-0"
            style={{ background: 'var(--navy)', color: '#fff' }}>
            IPU
          </span>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="w-full max-w-4xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}