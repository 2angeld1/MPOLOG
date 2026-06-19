'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    section: 'Principal',
    items: [
      { label: 'Dashboard', href: '/', icon: '📊' },
      { label: 'Directorio', href: '/directorio', icon: '👥' },
      { label: 'Calendario', href: '/calendario', icon: '📅' },
    ],
  },
  {
    section: 'Comunicación',
    items: [
      { label: 'Comunicados', href: '/comunicados', icon: '📢' },
    ],
  },
  {
    section: 'Reportes',
    items: [
      { label: 'Asistencia', href: '/asistencia', icon: '📈' },
      { label: 'Ministerios', href: '/ministerios', icon: '⛪' },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userRole?: string;
}

export default function Sidebar({ isOpen, onClose, userName = 'Usuario', userRole = 'miembro' }: SidebarProps) {
  const pathname = usePathname();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch {
      window.location.href = '/login';
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 99 }}
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-text">INTRAMPO</div>
          <div className="sidebar-logo-sub">Iglesia Maranatha</div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((section) => (
            <div key={section.section}>
              <div className="sidebar-section-label">{section.section}</div>
              {section.items.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={onClose}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{getInitials(userName)}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{userName}</div>
              <div className="sidebar-user-role">{userRole}</div>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm w-full mt-4"
            onClick={handleLogout}
            style={{ justifyContent: 'flex-start', gap: '0.75rem' }}
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
