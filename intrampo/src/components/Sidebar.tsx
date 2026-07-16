'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiMessageSquare,
  FiBarChart2,
  FiFolder,
  FiInbox,
  FiPackage,
  FiFileText,
  FiShield,
  FiLogOut,
} from 'react-icons/fi';
import { FaChurch } from 'react-icons/fa';
import type { IconType } from 'react-icons';

const navItems: { section: string; items: { label: string; href: string; icon: IconType }[] }[] = [
  {
    section: 'Principal',
    items: [
      { label: 'Dashboard', href: '/', icon: FiHome },
      { label: 'Directorio', href: '/directorio', icon: FiUsers },
      { label: 'Calendario', href: '/calendario', icon: FiCalendar },
    ],
  },
  {
    section: 'Comunicación',
    items: [
      { label: 'Comunicados', href: '/comunicados', icon: FiMessageSquare },
    ],
  },
  {
    section: 'Reportes',
    items: [
      { label: 'Asistencia', href: '/asistencia', icon: FiBarChart2 },
      { label: 'Ministerios', href: '/ministerios', icon: FaChurch },
    ],
  },
  {
    section: 'Recursos',
    items: [
      { label: 'Archivos', href: '/archivos', icon: FiFolder },
      { label: 'Inventario', href: '/inventario', icon: FiPackage },
      { label: 'Solicitudes', href: '/solicitudes', icon: FiInbox },
      { label: 'Formularios', href: '/formularios', icon: FiFileText },
    ],
  },
  {
    section: 'Administración',
    items: [
      { label: 'Usuarios y Roles', href: '/usuarios', icon: FiShield },
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 w-[260px] bg-[var(--color-bg-panel)] border-r border-white/10 flex flex-col z-[100] transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} overflow-hidden`}>
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />

        {/* Logo - Fixed height matching Header (70px) */}
        <div className="h-[70px] px-6 border-b border-white/10 relative flex items-center gap-3 shrink-0">
          <div className="font-display text-xl font-extrabold tracking-wider bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent leading-tight">
            INTRA - MPO
          </div>
          <div className="text-[0.6rem] text-gray-500 uppercase tracking-widest font-semibold border-l border-white/10 pl-3 leading-tight">
            Iglesia<br/>Maranatha
          </div>
        </div>

        <nav className="flex-1 p-4 px-3 flex flex-col gap-1 relative overflow-y-auto">
          {navItems.map((section) => {
            // Restringir la sección de Administración solo a superadmin y logisticadmin
            if (section.section === 'Administración' && !['superadmin', 'logisticadmin'].includes(userRole.toLowerCase())) {
              return null;
            }

            return (
              <div key={section.section}>
                <div className="text-[0.65rem] uppercase tracking-widest text-gray-500 font-semibold px-3 py-2 pt-4">{section.section}</div>
                {section.items.map((item) => {
                  const isActive = pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[0.88rem] font-medium transition-colors relative decoration-none ${isActive ? 'bg-amber-500/10 text-amber-300' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                      onClick={onClose}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[60%] bg-gradient-to-b from-amber-400 to-amber-600 rounded-r-full" />
                      )}
                      <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 relative">
          <div className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-white/5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-sm text-gray-950 shrink-0">
              {getInitials(userName)}
            </div>
            <div className="overflow-hidden">
              <div className="text-[0.82rem] font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis">{userName}</div>
              <div className="text-[0.7rem] text-gray-400 capitalize">{userRole}</div>
            </div>
          </div>
          <button
            className="w-full mt-4 flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            onClick={handleLogout}
          >
            <FiLogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
