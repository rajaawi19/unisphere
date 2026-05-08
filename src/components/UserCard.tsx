import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Check, Clock } from "lucide-react";
import { api } from "@/services/api";
import type { ConnectionStatus, User } from "@/types";
import { toast } from "sonner";

export function UserCard({ user, compact = false }: { user: User; compact?: boolean }) {
  const [status, setStatus] = useState<ConnectionStatus>("none");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.getConnectionStatus(user.id).then(setStatus);
  }, [user.id]);

  async function connect() {
    setBusy(true);
    try {
      await api.sendConnection(user.id);
      setStatus("pending_outgoing");
      toast.success(`Request sent to ${user.name}`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="overflow-hidden border bg-surface p-0">
      {!compact && (
        <div
          className="h-16 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${user.coverImage})` }}
        />
      )}
      <div className={compact ? "flex items-center gap-3 p-3" : "flex flex-col items-center px-4 pb-4 text-center"}>
        <Avatar className={compact ? "h-12 w-12" : "-mt-7 h-16 w-16 border-4 border-surface"}>
          <AvatarImage src={user.profileImage} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div className={compact ? "min-w-0 flex-1" : "mt-2"}>
          <Link
            to="/profile/$userId"
            params={{ userId: user.id }}
            className="block truncate text-sm font-semibold hover:underline"
          >
            {user.name}
          </Link>
          <div className="truncate text-xs text-muted-foreground">{user.department}</div>
          <div className="truncate text-xs text-muted-foreground">{user.collegeName}</div>
        </div>
        {!compact && (
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {user.skills.slice(0, 3).map((s) => (
              <Badge key={s} variant="secondary" className="font-normal">
                {s}
              </Badge>
            ))}
          </div>
        )}
        <div className={compact ? "" : "mt-3 w-full"}>
          {status === "connected" ? (
            <Button variant="outline" size="sm" disabled className={compact ? "" : "w-full"}>
              <Check className="mr-1 h-4 w-4" /> Connected
            </Button>
          ) : status === "pending_outgoing" ? (
            <Button variant="outline" size="sm" disabled className={compact ? "" : "w-full"}>
              <Clock className="mr-1 h-4 w-4" /> Pending
            </Button>
          ) : (
            <Button onClick={connect} disabled={busy} size="sm" className={compact ? "" : "w-full"}>
              <UserPlus className="mr-1 h-4 w-4" /> Connect
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
