import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { OraLogo } from '@/components/icons';

export default function LocationSetupPage() {
  const states = ['Maharashtra', 'Karnataka', 'Delhi', 'Telangana', 'Tamil Nadu'];
  const regions: { [key: string]: string[] } = {
    Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
    Karnataka: ['Bengaluru', 'Mysuru', 'Mangaluru'],
    Delhi: ['New Delhi', 'North Delhi', 'South Delhi'],
    Telangana: ['Hyderabad', 'Warangal', 'Nizamabad'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
  };

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
            <CardTitle>Set Your Location</CardTitle>
            <CardDescription>This helps us show you relevant civic posts. This can only be set once.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region (City/District)</Label>
               <Select>
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select your region" />
                </SelectTrigger>
                <SelectContent>
                   {regions['Karnataka']?.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" asChild>
                <Link href="/home">Confirm and Enter ORA</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
