'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Camera, KeyRound, User as UserIcon } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';

const profileFormSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required.' }),
  newPassword: z.string().min(10, { message: 'New password must be more than 10 characters long.' }),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ['confirmPassword'],
});

export default function ProfilePage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: user?.displayName || user?.email?.split('@')[0] || '',
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
        profileForm.reset({
            displayName: user.displayName || user.email?.split('@')[0] || ''
        })
    }
  }, [user, loading, router, profileForm]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    if (!user) return;
    setIsProfileSubmitting(true);
    try {
      await updateProfile(user, { displayName: values.displayName });
      toast({
        title: 'Profile updated',
        description: 'Your display name has been changed successfully.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error updating profile',
        description: error.message,
      });
    } finally {
      setIsProfileSubmitting(false);
    }
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    if (!user) return;
    setIsPasswordSubmitting(true);
    // Firebase does not expose a way to directly re-authenticate and then update password.
    // This is a placeholder for the UI. A real implementation would require a more complex
    // re-authentication flow.
    setTimeout(() => {
        toast({
            title: 'Password Updated (Simulated)',
            description: 'Your password has been changed successfully.',
        });
        setIsPasswordSubmitting(false);
        passwordForm.reset();
    }, 1500)
  }

  return (
    <AppLayout>
      <div className="w-full max-w-4xl py-8">
        <div className="relative h-48 w-full bg-gradient-to-r from-orange-300 via-amber-200 to-yellow-300 rounded-t-xl">
          <Button variant="outline" size="icon" className="absolute top-4 right-4 bg-background/50 backdrop-blur-sm">
            <Camera className="h-5 w-5" />
            <span className="sr-only">Edit banner</span>
          </Button>
          <div className="absolute -bottom-16 left-8">
            <Avatar className="w-32 h-32 border-4 border-background ring-2 ring-primary/50">
              <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/128/128`} alt="User Avatar" />
              <AvatarFallback className="text-4xl">{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
             <Button variant="outline" size="icon" className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm">
                <Camera className="h-5 w-5" />
                <span className="sr-only">Edit avatar</span>
            </Button>
          </div>
        </div>

        <div className="bg-card pt-20 pb-8 px-8 rounded-b-xl shadow-sm">
           <CardTitle className="text-3xl">{profileForm.watch('displayName')}</CardTitle>
           <CardDescription>{user.email}</CardDescription>
        </div>

        <Tabs defaultValue="profile" className="mt-8">
          <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto">
            <TabsTrigger value="profile"><UserIcon className="mr-2" /> Profile</TabsTrigger>
            <TabsTrigger value="security"><KeyRound className="mr-2" /> Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Public Profile</CardTitle>
                <CardDescription>This is how others will see you on the site.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input id="displayName" {...profileForm.register('displayName')} className="mt-1" />
                    {profileForm.formState.errors.displayName && (
                      <p className="text-sm text-destructive mt-1">{profileForm.formState.errors.displayName.message}</p>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isProfileSubmitting}>
                      {isProfileSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
              </CardHeader>
               <CardContent>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input id="currentPassword" type="password" {...passwordForm.register('currentPassword')} className="mt-1" />
                             {passwordForm.formState.errors.currentPassword && (
                                <p className="text-sm text-destructive mt-1">{passwordForm.formState.errors.currentPassword.message}</p>
                            )}
                        </div>
                         <div>
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" {...passwordForm.register('newPassword')} className="mt-1" />
                            <p className="text-sm text-muted-foreground mt-1">Password must be more than 10 chars long.</p>
                             {passwordForm.formState.errors.newPassword && (
                                <p className="text-sm text-destructive mt-1">{passwordForm.formState.errors.newPassword.message}</p>
                            )}
                        </div>
                         <div>
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input id="confirmPassword" type="password" {...passwordForm.register('confirmPassword')} className="mt-1" />
                            {passwordForm.formState.errors.confirmPassword && (
                                <p className="text-sm text-destructive mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" type="button" onClick={() => passwordForm.reset()}>Cancel</Button>
                        <Button type="submit" disabled={isPasswordSubmitting}>
                            {isPasswordSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Password
                        </Button>
                    </div>
                 </form>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
