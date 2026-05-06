import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './[locale]/globals.css';

export const metadata: Metadata = {
  title: 'HandyToolkit',
  description: 'Free browser-based developer and productivity tools',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
