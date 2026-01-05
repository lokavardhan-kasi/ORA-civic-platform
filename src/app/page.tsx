import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { OraLogo } from '@/components/icons';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <OraLogo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tight text-foreground">ORA</span>
          </Link>
          <Button asChild>
            <Link href="/home">
              Launch App <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Structured Civic Dialogue for India
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            ORA is a modern platform for verified citizens to voice their opinions on government decisions at the
            regional, state, and national levels.
          </p>
          <div className="mt-10">
            <Button size="lg" asChild>
              <Link href="/home">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} ORA. All rights reserved.</p>
      </footer>
    </div>
  );
}
