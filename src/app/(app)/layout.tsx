'use client';

import { SidebarProvider, Sidebar, SidebarInset, useSidebar } from '@/components/ui/sidebar';
import { LeftSidebar } from '@/components/layout/left-sidebar';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { TopNav } from '@/components/layout/top-nav';
import { useIsMobile } from '@/hooks/use-mobile';
import React from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon" className="hidden border-r bg-card md:flex">
          <LeftSidebar />
        </Sidebar>

        <div className="flex flex-1 flex-col overflow-hidden">
          <TopNav />
          <div className="flex flex-1 overflow-hidden">
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              {children}
            </main>
            {!isMobile && <RightSidebar />}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
