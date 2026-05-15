'use client';

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

export default function AdsterraSlot(_props: Props) {
  return null;
}
