import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './[locale]/globals.css';

export const metadata: Metadata = {
  title: 'HandyToolkit',
  description: 'Free browser-based developer and productivity tools',
};

const GA_ID = 'G-G0YE8ZCN66';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{page_path:window.location.pathname});`,
          }}
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
