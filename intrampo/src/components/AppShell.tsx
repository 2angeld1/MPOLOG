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
  '/inventario': 'Inventario de Materiales',
  '/formularios': 'Generador de Formularios',
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

        // Si la sesión está corrupta (le falta el email o roles), forzamos el deslogueo
        if (!data.user?.email || !data.user?.roles) {
          await fetch('/api/auth/logout', { method: 'POST' });
          router.push('/login');
          return;
        }

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
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-root)]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-white/20 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Cargando INTRA - MPO...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const pageTitle = pageTitles[pathname] || 'INTRA - MPO';

  return (
    <AppContext.Provider value={{ user }}>
      <EditModeProvider userRoles={user.roles}>
        <div className="flex min-h-screen relative z-10">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            userName={user.nombre}
            userRole={user.roles[0] || 'miembro'}
          />
          <div className="flex-1 lg:ml-[260px] pt-[70px] min-h-screen transition-all duration-300">
            <Header
              title={pageTitle}
              onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            />
            <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
              {children}
            </div>
          </div>
        </div>
      </EditModeProvider>
    </AppContext.Provider>
  );
}
