import Link from 'next/link';
import { notifications as allNotifications, users } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Globe, MessageSquare } from 'lucide-react';

export default function NotificationsPage() {
  const currentUser = users[0];
  const notifications = allNotifications.filter(n => n.userId === currentUser.id);

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <ul className="space-y-2">
              {notifications.map(notification => (
                <li key={notification.id}>
                  <Link
                    href={`/posts/${notification.postId}`}
                    className={cn(
                      'block rounded-lg p-4 transition-colors',
                      notification.readStatus
                        ? 'bg-transparent hover:bg-accent'
                        : 'bg-primary/10 hover:bg-primary/20'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {notification.message.includes('created') ? 
                            <Globe className="h-5 w-5 text-primary" /> : 
                            <MessageSquare className="h-5 w-5 text-green-500" />
                        }
                      </div>
                      <div>
                        <p className="text-sm text-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground">You have no new notifications.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
