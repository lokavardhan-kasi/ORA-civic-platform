
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth, useFirestore } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { OraLogo } from '@/components/icons';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleAuthAction = async () => {
    setLoading(true);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await setDoc(doc(firestore, "users", user.uid), {
          id: user.uid,
          name: user.email?.split('@')[0] || "New User",
          avatarUrl: `https://picsum.photos/seed/${user.uid}/40/40`,
        });

        toast({ title: 'Signed up successfully!' });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: 'Logged in successfully!' });
      }
      router.push('/feed');
    } catch (error: any) {
      let description = "An unexpected error occurred. Please try again.";
      if (error.code === 'auth/email-already-in-use' && isSignUp) {
        description = "This email is already in use. Please try logging in instead.";
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        description = "Invalid login credentials. Please check your email and password.";
      } else {
        description = error.message;
      }

      toast({
        variant: 'destructive',
        title: 'Authentication failed',
        description: description,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuthAction();
  };

  return (
    <div className="w-full min-h-dvh flex items-center justify-center bg-gradient-to-br from-secondary via-background to-secondary p-4">
      <div className={cn(
        "relative w-full max-w-md lg:max-w-5xl h-auto lg:h-[600px] rounded-3xl shadow-2xl overflow-hidden",
        "grid lg:grid-cols-2"
      )}>
        {/* Image Panel */}
         <div className={cn(
          "absolute top-0 h-full w-full lg:w-1/2 p-12 bg-primary text-primary-foreground flex-col justify-between hidden lg:flex transition-transform duration-700 ease-in-out",
          isSignUp ? 'lg:translate-x-full lg:rounded-l-3xl lg:rounded-r-none' : 'lg:translate-x-0 lg:rounded-r-3xl lg:rounded-l-none'
        )}>
            <div className="absolute inset-0 w-full h-full">
                <Image 
                    src="https://picsum.photos/seed/login/1200/1800" 
                    alt="Community Engagement" 
                    fill
                    className="object-cover opacity-20"
                    data-ai-hint="civic engagement"
                />
            </div>
             <div className="relative z-10 flex items-center gap-2">
                <OraLogo className="h-8 w-8" />
                <span className="text-xl font-bold">ORA</span>
            </div>
            <div className="relative z-10 mt-auto max-w-md">
                <h2 className="text-4xl font-bold leading-tight tracking-tighter">Shape the future of your community.</h2>
                <p className="mt-4 text-lg text-primary-foreground/80">Your voice matters. Propose ideas, give feedback on policies, and collaborate for a better tomorrow.</p>
            </div>
        </div>

        {/* Form Panel */}
        <div className={cn(
          "relative lg:absolute top-0 flex flex-col justify-center h-full w-full lg:w-1/2 p-8 sm:p-12 bg-background/80 backdrop-blur-xl transition-transform duration-700 ease-in-out rounded-3xl lg:rounded-none",
          isSignUp ? 'lg:translate-x-0' : 'lg:translate-x-full'
        )}>
          <div className="w-full max-w-md mx-auto space-y-8">
            <div className="text-center">
                <Link href="/" className="inline-block mb-4">
                    <OraLogo className="h-12 w-12 text-primary" />
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">
                    {isSignUp ? 'Create an Account' : 'Welcome Back'}
                </h1>
                <p className="mt-2 text-muted-foreground">
                    {isSignUp ? 'Enter your email and password to sign up.' : 'Enter your credentials to access your account.'}
                </p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {!isSignUp && (
                    <Link href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <button onClick={() => setIsSignUp(!isSignUp)} className="font-semibold text-primary hover:underline">
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
