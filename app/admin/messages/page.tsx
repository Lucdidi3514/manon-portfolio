import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, MailOpen } from 'lucide-react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  read: boolean;
}

async function getMessages(): Promise<ContactSubmission[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return data as ContactSubmission[];
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-64" />
      <div className="grid gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    </div>
  );
}

async function MessagesContent() {
  const messages = await getMessages();
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Nachrichten</h1>
          <p className="text-muted-foreground">
            Kontaktanfragen von Ihrer Webseite
            {unreadCount > 0 && (
              <span className="ml-2 text-primary font-medium">
                ({unreadCount} ungelesen)
              </span>
            )}
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Noch keine Nachrichten vorhanden</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {messages.map((message) => (
            <Card key={message.id} className={!message.read ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{message.subject}</CardTitle>
                      {!message.read && <Badge>Ungelesen</Badge>}
                    </div>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        {message.read ? (
                          <MailOpen className="h-4 w-4" />
                        ) : (
                          <Mail className="h-4 w-4" />
                        )}
                        {message.name}
                      </span>
                      <span>{message.email}</span>
                      <span>
                        {new Date(message.created_at).toLocaleDateString('de-DE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <MessagesContent />
    </Suspense>
  );
}
