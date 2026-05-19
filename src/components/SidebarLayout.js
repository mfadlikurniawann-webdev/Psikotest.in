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

  const hrNav = [
    { href: '/hr/dashboard',   label: 'Dashboard',  icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z', active: pathname === '/hr/dashboard' },
    { href: '/hr/candidates',  label: 'Kandidat',   icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', active: pathname.startsWith('/hr/candidate') },
  ];

  const candidateNav = [
    { href: '/candidate/dashboard',           label: 'Dashboard',      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', active: pathname === '/candidate/dashboard' },
    { href: '/candidate/test/psikotes',        label: 'Psikotes Terpadu', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', active: pathname.startsWith('/candidate/test') },
  ];

  const navItems = isHr ? hrNav : candidateNav;

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
          <p className="text-ink-400 text-xs">Platform Asesmen</p>
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
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} onClick={() => setOpen(false)} />
        ))}
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
