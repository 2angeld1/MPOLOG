'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import { EditModeProvider } from './cms/EditModeContext';

interface UserData {
  userId: string;
  nombre: string;
  email: string;
  roles: string[];
}

interface AppContextType {
  user: UserData | null;
}

const AppContext = createContext<AppContextType>({ user: null });

export function useAppContext() {
  return useContext(AppContext);
}

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/directorio': 'Directorio de Miembros',
  '/calendario': 'Calendario de Eventos',
  '/comunicados': 'Comunicados',
  '/asistencia': 'Reportes de Asistencia',
  '/ministerios': 'Ministerios',
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="login-page">
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto var(--space-4)' }} />
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Cargando INTRAMPO...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const pageTitle = pageTitles[pathname] || 'INTRAMPO';

  return (
    <AppContext.Provider value={{ user }}>
      <EditModeProvider userRoles={user.roles}>
        <div className="app-layout">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            userName={user.nombre}
            userRole={user.roles[0] || 'miembro'}
          />
          <div className="main-content">
            <Header
              title={pageTitle}
              onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            />
            <div className="page-container">
              {children}
            </div>
          </div>
        </div>
      </EditModeProvider>
    </AppContext.Provider>
  );
}
