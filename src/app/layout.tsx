import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './[locale]/globals.css';

export const metadata: Metadata = {
  title: 'HandyToolkit',
  description: 'Free browser-based developer and productivity tools',
};

const GA_ID = 'G-3LYD80FR0D';

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
              <script
          dangerouslySetInnerHTML={{
            __html: "window.addEventListener('click',function(event){var link=event.target&&event.target.closest?event.target.closest('a[rel*=\\\"sponsored\\\"],[data-affiliate-link]'):null;if(!link||typeof window.gtag!==\\\"function\\\")return;window.gtag('event','affiliate_click',{merchant:(link.textContent||'').trim().slice(0,60)||'partner',placement:link.getAttribute('data-placement')||link.getAttribute('aria-label')||'sponsored-link',page_location:window.location.href});},{capture:true});",
          }}
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
