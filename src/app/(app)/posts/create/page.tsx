import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function CreatePostPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Civic Post</CardTitle>
          <CardDescription>
            Start a new discussion. Your post will function as an Agree/Disagree poll.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="level">Post Level</Label>
            <Select>
              <SelectTrigger id="level">
                <SelectValue placeholder="Select the visibility level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Region">My Region</SelectItem>
                <SelectItem value="State">My State</SelectItem>
                <SelectItem value="National">National</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="A clear, concise question or statement" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Provide more context and details here." rows={5} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="hashtags">Hashtags</Label>
            <Input id="hashtags" placeholder="e.g., #Education #Policy (comma separated)" />
            <p className="text-xs text-muted-foreground">Use hashtags to help others discover your post.</p>
          </div>
          <div className="flex justify-end">
            <Button>Publish Post</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
