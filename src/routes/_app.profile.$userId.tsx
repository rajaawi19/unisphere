import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, FileText, Star, Trophy, MessageSquare, UserPlus, Check, Clock } from "lucide-react";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import type { ConnectionStatus, Post, User } from "@/types";
import { PostCard } from "@/components/PostCard";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile/$userId")({
  component: ProfilePage,
});

function ProfilePage() {
  const { userId } = Route.useParams();
  const me = useAuthStore((s) => s.user)!;
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("none");
  const [posts, setPosts] = useState<Post[]>([]);
  const isMe = me.id === userId;

  useEffect(() => {
    api.getUser(userId).then(setUser);
    api.getConnectionStatus(userId).then(setStatus);
    api.listFeed().then((all) => setPosts(all.filter((p) => p.userId === userId)));
  }, [userId]);

  async function connect() {
    await api.sendConnection(userId);
    setStatus("pending_outgoing");
    toast.success("Connection request sent");
  }

  if (!user) return <div className="py-20 text-center text-sm text-muted-foreground">Loading…</div>;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <Card className="overflow-hidden border bg-surface p-0">
          <div className="h-36 w-full bg-cover bg-center" style={{ backgroundImage: `url(${user.coverImage})` }} />
          <div className="px-6 pb-6">
            <div className="-mt-12 flex items-end justify-between gap-4">
              <Avatar className="h-24 w-24 border-4 border-surface">
                <AvatarImage src={user.profileImage} />
                <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
                {isMe ? (
                  <Button asChild variant="outline">
                    <Link to="/profile/edit">Edit profile</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline">
                      <MessageSquare className="mr-2 h-4 w-4" /> Message
                    </Button>
                    {status === "connected" ? (
                      <Button disabled variant="secondary">
                        <Check className="mr-2 h-4 w-4" /> Connected
                      </Button>
                    ) : status === "pending_outgoing" ? (
                      <Button disabled variant="secondary">
                        <Clock className="mr-2 h-4 w-4" /> Pending
                      </Button>
                    ) : (
                      <Button onClick={connect}>
                        <UserPlus className="mr-2 h-4 w-4" /> Connect
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
            <h1 className="mt-4 text-2xl font-semibold">{user.name}</h1>
            <div className="text-sm text-muted-foreground">
              {user.department} · {user.collegeName} · Year {user.year}
            </div>
            {user.bio && <p className="mt-3 text-sm leading-relaxed">{user.bio}</p>}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              {user.github && (
                <a href={user.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                  <Github className="h-4 w-4" /> GitHub
                </a>
              )}
              {user.linkedin && (
                <a href={user.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              )}
              {user.resumeUrl && (
                <a href={user.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                  <FileText className="h-4 w-4" /> Resume
                </a>
              )}
            </div>
          </div>
        </Card>

        {user.skills.length > 0 && (
          <Card className="border bg-surface p-5">
            <h2 className="mb-3 text-sm font-semibold">Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {user.skills.map((s) => (
                <Badge key={s} variant="secondary" className="font-normal">
                  {s}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {user.interests.length > 0 && (
          <Card className="border bg-surface p-5">
            <h2 className="mb-3 text-sm font-semibold">Interests</h2>
            <div className="flex flex-wrap gap-1.5">
              {user.interests.map((s) => (
                <Badge key={s} variant="outline" className="font-normal">
                  {s}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        <Card className="border bg-surface p-5">
          <h2 className="mb-3 text-sm font-semibold">Recent posts</h2>
          {posts.length === 0 ? (
            <div className="text-sm text-muted-foreground">No posts yet.</div>
          ) : (
            <div className="space-y-3">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} onChange={(updated) => setPosts((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))} />
              ))}
            </div>
          )}
        </Card>
      </div>

      <aside className="space-y-4">
        <Card className="border bg-surface p-5">
          <h2 className="mb-3 text-sm font-semibold">Reputation</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Contribution score</div>
                <div className="text-lg font-semibold text-primary">{user.contributionScore}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-warning/15 text-warning">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Collab rating</div>
                <div className="text-lg font-semibold">{user.collaborationRating.toFixed(1)} / 5</div>
              </div>
            </div>
          </div>
        </Card>
        <Card className="border bg-surface p-5">
          <h2 className="mb-3 text-sm font-semibold">Tech stack</h2>
          <div className="flex flex-wrap gap-1.5">
            {user.techStack.map((t) => (
              <Badge key={t} variant="secondary" className="font-normal">
                {t}
              </Badge>
            ))}
            {user.techStack.length === 0 && <span className="text-sm text-muted-foreground">Not set</span>}
          </div>
        </Card>
      </aside>
    </div>
  );
}
