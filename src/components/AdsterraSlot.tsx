'use client';

import { useEffect, useRef } from 'react';

type SlotType = 'banner' | 'social' | 'push' | 'popunder' | 'directlink' | 'multitag';

interface Props {
  type: SlotType;
  width?: number;
  height?: number;
  className?: string;
  refreshOnScroll?: boolean;
  href?: string;
  label?: string;
}

const KEYS = {
  banner: process.env.NEXT_PUBLIC_ADSTERRA_BANNER_KEY!,
  social: process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_KEY!,
  push: process.env.NEXT_PUBLIC_ADSTERRA_PUSH_KEY!,
  popunder: process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_KEY!,
  multitag: process.env.NEXT_PUBLIC_ADSTERRA_MULTITAG_KEY!,
};

export default function AdsterraSlot({
  type,
  width = 728,
  height = 90,
  className = '',
  refreshOnScroll = false,
  href,
  label,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Native banner / Multitag — DOM에 invoke.js 삽입
  useEffect(() => {
    if (type === 'directlink') return;
    if (!ref.current) return;
    const key = KEYS[type as keyof typeof KEYS];
    if (!key) return;

    const container = ref.current;
    container.innerHTML = '';

    if (type === 'banner') {
      const conf = document.createElement('script');
      conf.text = `
        atOptions = {
          'key': '${key}',
          'format': 'iframe',
          'height': ${height},
          'width': ${width},
          'params': {}
        };
      `;
      container.appendChild(conf);
    }

    const invoke = document.createElement('script');
    invoke.async = true;
    invoke.src = `//www.profitableratecpm.com/${key}/invoke.js`;
    container.appendChild(invoke);

    // 스크롤 50% 도달 시 광고 새로고침
    if (refreshOnScroll && type === 'banner') {
      let refreshed = false;
      const onScroll = () => {
        if (refreshed || !container) return;
        const rect = container.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5) {
          refreshed = true;
          const newInvoke = document.createElement('script');
          newInvoke.async = true;
          newInvoke.src = `//www.profitableratecpm.com/${key}/invoke.js?t=${Date.now()}`;
          container.appendChild(newInvoke);
          window.removeEventListener('scroll', onScroll);
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }
  }, [type, width, height, refreshOnScroll]);

  // Direct Link 버튼 — 외부 이동 + sponsored
  if (type === 'directlink') {
    const directUrl = process.env.NEXT_PUBLIC_ADSTERRA_DIRECTLINK_URL || href || '#';
    return (
      <a
        href={directUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition ${className}`}
      >
        {label || 'Open'}
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </a>
    );
  }

  return (
    <div
      ref={ref}
      className={`adsterra-slot adsterra-${type} ${className}`}
      style={{ minWidth: width, minHeight: height, margin: '1.25rem auto', textAlign: 'center' }}
    />
  );
}
