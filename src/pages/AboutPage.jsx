export default function AboutPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-3xl">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold"
          style={{ color: 'var(--navy)' }}>
          About
        </h2>
        <p className="text-[13px] mt-1" style={{ color: 'var(--muted)' }}>
          About this project and the developer
        </p>
      </div>

      {/* About the project */}
      <div className="rounded-2xl p-6 mb-4"
        style={{ background: 'var(--s1)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: 'var(--blue-lt)' }}>
            🎓
          </div>
          <div>
            <h3 className="text-[15px] font-bold" style={{ color: 'var(--navy)' }}>
              IPU Result Portal
            </h3>
            <p className="text-[11px]" style={{ color: 'var(--muted)' }}>
              Built for GGSIPU students
            </p>
          </div>
        </div>

        <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>
          IPU Result Portal is a student-friendly web app built to make accessing
          and understanding your academic results simple and visual. Instead of
          struggling with the official IPU portal, get your complete result in one
          click — semester-wise, with graphs and performance overview.
        </p>

        {/* Features list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { icon: '📊', title: 'Semester-wise Results',   desc: 'View each semester result clearly with subject breakdown' },
            { icon: '🏆', title: 'CGPA & SGPA',             desc: 'Automatic calculation based on IPU Ordinance 11'         },
            { icon: '📈', title: 'Performance Graph',       desc: 'Visual SGPA trend graph across all semesters'            },
            { icon: '🧮', title: 'Manual Calculator',       desc: 'Calculate SGPA manually if IPU server is down'           },
            { icon: '💯', title: 'Grade Reference',         desc: 'Complete IPU grading table with grade points'            },
            { icon: '🔒', title: '100% Safe',               desc: 'Credentials never stored, discarded immediately'         },
          ].map(f => (
            <div key={f.title} className="flex items-start gap-3 p-3 rounded-xl"
              style={{ background: 'var(--s2)', border: '1px solid var(--border)' }}>
              <span className="text-lg flex-shrink-0">{f.icon}</span>
              <div>
                <p className="text-[12px] font-semibold" style={{ color: 'var(--text)' }}>
                  {f.title}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--muted)' }}>
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Calculator note */}
      <div className="rounded-2xl p-5 mb-4 flex items-start gap-3"
        style={{ background: 'var(--blue-lt)', border: '1px solid #bfdbfe' }}>
        <span className="text-xl flex-shrink-0">💡</span>
        <div>
          <p className="text-[13px] font-semibold mb-1" style={{ color: '#1e40af' }}>
            IPU Server Down?
          </p>
          <p className="text-[12px] leading-relaxed" style={{ color: '#1e40af' }}>
            No worries! Use the <strong>Manual SGPA Calculator</strong> — just enter
            your subject credits and total marks out of 100 and get your SGPA instantly.
            No login required.
          </p>
        </div>
      </div>

      {/* About the developer */}
      <div className="rounded-2xl p-6"
        style={{ background: 'var(--s1)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
            style={{ background: 'var(--navy)' }}>
            AY
          </div>
          <div>
            <h3 className="text-[15px] font-bold" style={{ color: 'var(--navy)' }}>
              Aditya Yadav
            </h3>
            <p className="text-[12px]" style={{ color: 'var(--muted)' }}>
              B.Tech CSE · USICT · 2023–2027
            </p>
          </div>
        </div>

        <p className="text-[13px] leading-relaxed mb-5" style={{ color: 'var(--muted)' }}>
          Hey! I'm Aditya Yadav, a Computer Science student at University School of
          Information & Communication Technology (USICT), GGSIPU, batch 2023–2027.
          I built this portal because I felt the official IPU result portal was
          hard to use and lacked visual insights. Hope this helps fellow IPU
          students! 🚀
        </p>

        {/* Links */}
        <div className="flex flex-wrap gap-3">
          <a href="https://www.linkedin.com/in/adityayadav25/"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:shadow-md"
            style={{ background: '#0077b5', color: '#fff' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>

          <a href="https://github.com/aditya05-ydv?tab=repositories"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:shadow-md"
            style={{ background: '#24292e', color: '#fff' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </div>
      </div>

    </div>
  );
}