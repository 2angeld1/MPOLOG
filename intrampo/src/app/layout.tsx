import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'INTRA - MPO | Iglesia Maranatha',
  description: 'Intranet de la Iglesia Maranatha - Gestión integral de ministerios, eventos, asistencia y comunicados.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#0f1118" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⛪</text></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}
