import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserCard } from "@/components/UserCard";
import { api } from "@/services/api";
import type { ConnectionRequest, User } from "@/types";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/network")({
  component: NetworkPage,
});

function NetworkPage() {
  const [incoming, setIncoming] = useState<{ request: ConnectionRequest; from: User }[]>([]);
  const [connections, setConnections] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);

  async function refresh() {
    const [i, c, s] = await Promise.all([
      api.listIncomingRequests(),
      api.listMyConnections(),
      api.listSuggestions(12),
    ]);
    setIncoming(i);
    setConnections(c);
    setSuggestions(s);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function respond(reqId: string, accept: boolean) {
    await api.respondConnection(reqId, accept);
    toast.success(accept ? "Connection accepted" : "Request dismissed");
    refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My Network</h1>
        <p className="text-sm text-muted-foreground">Manage requests, see your connections, and discover students.</p>
      </div>

      <Tabs defaultValue="suggestions">
        <TabsList>
          <TabsTrigger value="suggestions">Discover</TabsTrigger>
          <TabsTrigger value="requests">Requests {incoming.length > 0 && `(${incoming.length})`}</TabsTrigger>
          <TabsTrigger value="connections">Connections ({connections.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="mt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {suggestions.map((u) => (
              <UserCard key={u.id} user={u} />
            ))}
          </div>
          {suggestions.length === 0 && (
            <Card className="border bg-surface p-8 text-center text-sm text-muted-foreground">
              No suggestions right now — check back later.
            </Card>
          )}
        </TabsContent>

        <TabsContent value="requests" className="mt-4">
          {incoming.length === 0 ? (
            <Card className="border bg-surface p-8 text-center text-sm text-muted-foreground">
              No pending requests.
            </Card>
          ) : (
            <div className="space-y-2">
              {incoming.map(({ request, from }) => (
                <Card key={request.id} className="flex items-center gap-3 border bg-surface p-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={from.profileImage} />
                    <AvatarFallback>{from.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{from.name}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {from.department} · {from.collegeName}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => respond(request.id, true)}>
                    <Check className="mr-1 h-4 w-4" /> Accept
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => respond(request.id, false)}>
                    <X className="mr-1 h-4 w-4" /> Dismiss
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="connections" className="mt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {connections.map((u) => (
              <UserCard key={u.id} user={u} />
            ))}
          </div>
          {connections.length === 0 && (
            <Card className="border bg-surface p-8 text-center text-sm text-muted-foreground">
              You haven't connected with anyone yet.
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
