'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const BookIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
  </svg>
);

function NavItem({ href, label, icon, active, onClick }) {
  return (
    <Link href={href} onClick={onClick}
      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition text-sm font-medium ${
        active
          ? 'bg-gold text-ink-900 shadow-sm'
          : 'text-ink-300 hover:text-white hover:bg-ink-700'
      }`}>
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={icon}/>
      </svg>
      {label}
    </Link>
  );
}

function NavSection({ title, children }) {
  return (
    <div className="mb-2">
      {title && <p className="px-3.5 mb-2 text-[10px] font-semibold text-ink-500 uppercase tracking-widest">{title}</p>}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

export default function SidebarLayout({ user, children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    router.push('/login'); router.refresh();
  };

  const initials = (name) => {
    if (!name) return 'U';
    const p = name.split(' ');
    return p.length > 1 ? (p[0][0] + p[1][0]).toUpperCase() : name.slice(0,2).toUpperCase();
  };

  const isHr = user?.role === 'hr';

  const ICONS = {
    dashboard: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z',
    candidates: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    cognitive: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    personality: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    graphic: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    kraepelin: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  };

  const Sidebar = ({ mobile }) => (
    <aside className={`${mobile
      ? `fixed top-0 left-0 h-screen w-64 z-30 sidebar-transition ${open ? 'translate-x-0' : '-translate-x-full'}`
      : 'hidden lg:flex sticky top-0 h-screen w-64 flex-shrink-0'
    } bg-ink-900 text-white flex flex-col overflow-y-auto border-r border-ink-700`}>

      {/* Logo */}
      <div className="px-6 py-5 border-b border-ink-700 flex items-center gap-3">
        <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center text-ink-900">
          <BookIcon />
        </div>
        <div>
          <p className="font-display font-semibold text-white text-base leading-tight">Psikotest.in</p>
          <p className="text-ink-400 text-xs">Platform Asesmen HCGA</p>
        </div>
      </div>

      {/* User */}
      {user && (
        <div className="px-6 py-4 border-b border-ink-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold text-sm flex-shrink-0">
              {initials(user.name)}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user.name}</p>
              <p className="text-ink-400 text-xs">{isHr ? 'HR Administrator' : 'Kandidat'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-4">
        {isHr ? (
          <>
            <NavSection>
              <NavItem href="/hr/dashboard" label="Dashboard" icon={ICONS.dashboard} active={pathname === '/hr/dashboard'} onClick={() => setOpen(false)} />
              <NavItem href="/hr/candidates" label="Kandidat" icon={ICONS.candidates} active={pathname.startsWith('/hr/candidate')} onClick={() => setOpen(false)} />
            </NavSection>
          </>
        ) : (
          <>
            <NavSection>
              <NavItem href="/candidate/dashboard" label="Dashboard" icon={ICONS.home} active={pathname === '/candidate/dashboard'} onClick={() => setOpen(false)} />
            </NavSection>
            <NavSection title="Modul Tes">
              <NavItem href="/candidate/test/cognitive" label="Tes Kognitif" icon={ICONS.cognitive} active={pathname.startsWith('/candidate/test/cognitive')} onClick={() => setOpen(false)} />
              <NavItem href="/candidate/test/personality" label="Tes Kepribadian" icon={ICONS.personality} active={pathname.startsWith('/candidate/test/personality')} onClick={() => setOpen(false)} />
              <NavItem href="/candidate/test/graphic" label="Tes Grafis" icon={ICONS.graphic} active={pathname.startsWith('/candidate/test/graphic')} onClick={() => setOpen(false)} />
              <NavItem href="/candidate/test/kraepelin" label="Tes Kraepelin" icon={ICONS.kraepelin} active={pathname.startsWith('/candidate/test/kraepelin')} onClick={() => setOpen(false)} />
            </NavSection>
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-ink-700">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 text-ink-400 hover:text-white hover:bg-ink-700 rounded-xl transition text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Keluar
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-ink-900 border-b border-ink-700 flex items-center justify-between px-4 h-14">
        <button onClick={() => setOpen(true)} className="text-white p-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <span className="font-display font-semibold text-white text-lg">Psikotest.in</span>
        <div className="w-8"/>
      </div>

      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setOpen(false)}/>}

      <div className="flex min-h-screen">
        <Sidebar mobile={false} />
        <Sidebar mobile={true}  />
        <main className="flex-1 min-w-0 pt-14 lg:pt-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
