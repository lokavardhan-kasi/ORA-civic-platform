import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-semibold">Profile Information</h3>
            <div className="space-y-2">
                <Label htmlFor='name'>Name</Label>
                <Input id="name" defaultValue="Aarav Sharma" />
            </div>
            <div className="space-y-2">
                <Label htmlFor='username'>Username</Label>
                <Input id="username" defaultValue="@aaravs" />
            </div>
          </div>

          <Separator />
          
           <div className="space-y-4">
            <h3 className="font-semibold">Location</h3>
            <div className="space-y-2">
                <Label>State</Label>
                <Input defaultValue="Maharashtra" disabled />
            </div>
            <div className="space-y-2">
                <Label>Region</Label>
                <Input defaultValue="Mumbai" disabled />
            </div>
            <p className="text-xs text-muted-foreground">Your location cannot be changed after initial setup.</p>
          </div>
          
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
