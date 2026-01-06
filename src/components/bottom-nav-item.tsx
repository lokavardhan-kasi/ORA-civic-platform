'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
}

export function BottomNavItem({ href, label, icon: Icon, isActive }: BottomNavItemProps) {
  return (
    <Link href={href} className="h-full bubbles">
      <div className={cn(
        "bubble-content h-full inline-flex flex-col items-center justify-center font-normal w-full",
        isActive ? 'text-primary' : 'text-muted-foreground'
      )}>
        <Icon className="h-6 w-6 mb-1" />
        <span className="text-xs">{label}</span>
      </div>
    </Link>
  );
}
