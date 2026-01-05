import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OraLogo } from '@/components/icons';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
            <Link href="/" className="flex items-center gap-3">
                <OraLogo className="h-10 w-10 text-primary" />
                <span className="text-3xl font-bold tracking-tight text-foreground">ORA</span>
            </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Enter your email to sign in or create an account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <Button className="w-full" asChild>
                <Link href="/location-setup">Continue</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
