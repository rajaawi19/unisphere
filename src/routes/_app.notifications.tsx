import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Bell, UserPlus, Heart, MessageSquare, Briefcase, Check } from "lucide-react";
import { api } from "@/services/api";
import type { Notification, User } from "@/types";

export const Route = createFileRoute("/_app/notifications")({
  component: NotificationsPage,
});

const ICONS = {
  connection_request: UserPlus,
  connection_accepted: Check,
  post_like: Heart,
  post_comment: MessageSquare,
  project_invite: Briefcase,
  message: MessageSquare,
} as const;

function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});

  async function refresh() {
    const list = await api.listNotifications();
    setItems(list);
    const ids = Array.from(new Set(list.map((n) => n.fromUserId).filter(Boolean) as string[]));
    const fetched = await Promise.all(ids.map((id) => api.getUser(id)));
    setUsers(Object.fromEntries(fetched.filter(Boolean).map((u) => [u!.id, u!])));
  }

  useEffect(() => {
    refresh();
  }, []);

  async function markAll() {
    await api.markAllRead();
    refresh();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="text-sm text-muted-foreground">Stay on top of activity from your network.</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAll}>
          Mark all read
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="border bg-surface p-8 text-center text-sm text-muted-foreground">
          <Bell className="mx-auto mb-2 h-6 w-6 opacity-50" /> No notifications yet.
        </Card>
      ) : (
        <Card className="divide-y border bg-surface p-0">
          {items.map((n) => {
            const Icon = ICONS[n.type] ?? Bell;
            const u = n.fromUserId ? users[n.fromUserId] : undefined;
            return (
              <div key={n.id} className={`flex items-start gap-3 p-4 ${n.read ? "" : "bg-accent/40"}`}>
                {u ? (
                  <Link to="/profile/$userId" params={{ userId: u.id }}>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={u.profileImage} />
                      <AvatarFallback>{u.name[0]}</AvatarFallback>
                    </Avatar>
                  </Link>
                ) : (
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-sm">{n.text}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </div>
                </div>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
