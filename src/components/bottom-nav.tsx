'use client';

import Link from 'next/link';
import { Plus, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { BottomNavItem } from './bottom-nav-item';

interface BottomNavProps {
  navItems: {
    href: string;
    label: string;
    icon: LucideIcon;
  }[];
  pathname: string;
}

export function BottomNav({ navItems, pathname }: BottomNavProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-20 bg-background border-t">
      <div className="grid h-full grid-cols-5 mx-auto">
        {navItems.slice(0, 2).map((item) => (
          <BottomNavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={pathname === item.href}
          />
        ))}

        <div className="flex items-center justify-center">
            <Button asChild size="lg" className="rounded-full w-16 h-16 -translate-y-4 shadow-lg bg-primary hover:bg-primary/90">
                <Link href="/submit">
                    <Plus className="h-8 w-8" />
                    <span className="sr-only">New Proposal</span>
                </Link>
            </Button>
        </div>

        {navItems.slice(2).map((item) => (
          <BottomNavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={pathname === item.href}
          />
        ))}
      </div>
    </div>
  );
}
