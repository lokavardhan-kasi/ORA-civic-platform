'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Globe, PlusSquare, User as UserIcon } from 'lucide-react';
import { SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarSeparator } from '@/components/ui/sidebar';
import { OraLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { users } from '@/lib/data';

const currentUser = users[0];

export function LeftSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/region', label: 'My Region', icon: Map },
    { href: '/state', label: 'My State', icon: Map },
    { href: '/national', label: 'National', icon: Globe },
  ];

  return (
    <div className="flex h-full flex-col">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 p-2">
          <OraLogo className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <h2 className="font-headline text-lg font-semibold tracking-tight">ORA</h2>
            <p className="text-xs text-muted-foreground">Civic Dialogue</p>
          </div>
        </div>
      </SidebarHeader>

      <div className="flex-1 overflow-y-auto">
        <SidebarMenu className="p-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: 'right' }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        <div className="p-2">
           <Button asChild className="w-full justify-start">
             <Link href="/posts/create">
                <PlusSquare />
                <span>Create Post</span>
             </Link>
           </Button>
        </div>

      </div>

      <SidebarSeparator />

      <SidebarFooter>
        <div className="p-2">
          <Link href={`/profile/${currentUser.id}`}>
            <SidebarMenuButton tooltip={{ children: 'Profile', side: 'right' }}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://picsum.photos/seed/${currentUser.avatar}/100/100`} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="font-semibold">{currentUser.name}</span>
                <span className="text-xs text-muted-foreground">@{currentUser.username}</span>
              </div>
            </SidebarMenuButton>
          </Link>
        </div>
      </SidebarFooter>
    </div>
  );
}
