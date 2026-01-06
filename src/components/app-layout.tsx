
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { OraLogo } from '@/components/icons';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, Search, Users, Building, LogOut, PlusCircle, User as UserIcon } from 'lucide-react';
import { Button } from './ui/button';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { MobileHeader } from './mobile-header';
import { BottomNav } from './bottom-nav';


const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/government', label: 'Government', icon: Building },
  { href: '/citizen', label: 'Citizen', icon: Users },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  
  if (!user) {
    // This case should ideally not be hit if AppLayout is used correctly,
    // but it's a good fallback.
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/50">
      {/* Desktop Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-card border-r flex-col p-4 hidden md:flex">
        <div className="flex items-center gap-3 mb-8">
          <OraLogo className="h-8 w-8 text-primary" />
          <span className="font-bold text-lg">ORA</span>
        </div>
        
        <div className="p-0.5 rounded-full bg-gradient-to-b from-primary/80 to-accent/80 mb-4 shadow-lg hover:shadow-primary/30 transition-shadow">
          <Button asChild variant="default" className="w-full justify-center text-base h-12 rounded-full bg-card text-card-foreground hover:bg-background/80">
              <Link href="/submit">
                <PlusCircle className="mr-3 h-5 w-5 text-primary" />
                New Proposal
              </Link>
            </Button>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className={cn(
                "justify-start text-base font-normal text-muted-foreground hover:text-foreground",
                pathname === item.href && "bg-primary/10 text-primary font-semibold"
              )}
            >
              <Link href={item.href}>
                <item.icon className="mr-4 h-5 w-5" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="w-full justify-start h-auto p-2 hover:bg-secondary/50">
                <div className="flex items-center gap-3 w-full">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/40/40`} />
                        <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left overflow-hidden">
                        <p className="text-sm font-semibold truncate">{user.displayName || user.email?.split('@')[0]}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
               <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || user.email?.split('@')[0]}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile Header */}
      <MobileHeader user={user} onSignOut={handleSignOut} />

      {/* Main Content */}
      <main className="md:ml-64 pb-24 md:pb-8 px-4">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav navItems={navItems} pathname={pathname} />
    </div>
  );
}
