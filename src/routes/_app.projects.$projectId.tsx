import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Briefcase, CheckCircle2, Circle, Plus, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import type { Project, User, Post } from "@/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/projects/$projectId")({
  component: ProjectRoom,
});

function ProjectRoom() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();
  const me = useAuthStore((s) => s.user);
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [linkedPosts, setLinkedPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Record<string, User>>({});
  const [taskTitle, setTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const p = await api.getProject(projectId);
      if (!p) {
        setError("Project not found");
        setProject(null);
        return;
      }
      setProject(p);
      const users = await Promise.all(p.memberIds.map((id) => api.getUser(id)));
      setMembers(users.filter(Boolean) as User[]);
      const feed = await api.listFeed();
      const linked = feed.filter((post) => post.projectId === p.id);
      setLinkedPosts(linked);
      const need = Array.from(new Set(linked.map((post) => post.userId)));
      const authorList = await Promise.all(need.map((id) => api.getUser(id)));
      setAuthors(
        Object.fromEntries(authorList.filter(Boolean).map((u) => [u!.id, u!])),
      );
    } catch (e) {
      setError((e as Error).message ?? "Couldn't load project");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function toggleTask(taskId: string) {
    if (!project) return;
    const updated = await api.toggleTask(project.id, taskId);
    setProject({ ...updated });
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!project || !taskTitle.trim()) return;
    const updated = await api.addTask(project.id, taskTitle.trim());
    setProject({ ...updated });
    setTaskTitle("");
  }

  async function requestJoin() {
    if (!project) return;
    await api.requestJoinProject(project.id);
    toast.success("Join request sent");
    load();
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-1/3 animate-pulse rounded bg-muted" />
        <Card className="h-40 animate-pulse bg-muted/40" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <Card className="border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="text-sm text-destructive">{error ?? "Not found"}</p>
        <Button className="mt-3" variant="outline" onClick={() => navigate({ to: "/feed" })}>
          Back to feed
        </Button>
      </Card>
    );
  }

  const isMember = me ? project.memberIds.includes(me.id) : false;
  const isOwner = me?.id === project.ownerId;
  const hasRequested = me ? project.joinRequestIds.includes(me.id) : false;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/feed" })}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Button>
      </div>

      <Card className="overflow-hidden border bg-surface p-0">
        <div className="border-b bg-primary/5 px-5 py-4">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-primary">
            <Briefcase className="h-3.5 w-3.5" /> Project room
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{project.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{project.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.techStack.map((t) => (
              <Badge key={t} variant="secondary" className="font-normal">
                {t}
              </Badge>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge className="capitalize">{project.status.replace("_", " ")}</Badge>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" /> {project.memberIds.length} members
            </span>
            {!isMember && !isOwner && (
              <Button size="sm" onClick={requestJoin} disabled={hasRequested}>
                {hasRequested ? "Request sent" : "Request to join"}
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <Card className="border bg-surface p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Tasks
              </h2>
              <span className="text-xs text-muted-foreground">
                {project.tasks.filter((t) => t.done).length}/{project.tasks.length} done
              </span>
            </div>
            <ul className="mt-3 space-y-1.5">
              {project.tasks.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => isMember && toggleTask(t.id)}
                    disabled={!isMember}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted disabled:opacity-70"
                  >
                    {t.done ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={t.done ? "line-through text-muted-foreground" : ""}>
                      {t.title}
                    </span>
                  </button>
                </li>
              ))}
              {project.tasks.length === 0 && (
                <li className="text-xs text-muted-foreground">No tasks yet.</li>
              )}
            </ul>
            {isMember && (
              <form onSubmit={addTask} className="mt-3 flex gap-2">
                <Input
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Add a new task…"
                />
                <Button type="submit" size="sm" disabled={!taskTitle.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </form>
            )}
          </Card>

          <Card className="border bg-surface p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Linked posts
            </h2>
            <div className="mt-3 space-y-3">
              {linkedPosts.map((post) => {
                const a = authors[post.userId];
                return (
                  <div key={post.id} className="rounded-lg border bg-background p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={a?.profileImage} />
                        <AvatarFallback>{a?.name?.[0] ?? "?"}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{a?.name ?? "…"}</span>
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm">{post.content}</p>
                  </div>
                );
              })}
              {linkedPosts.length === 0 && (
                <p className="text-xs text-muted-foreground">No posts linked yet.</p>
              )}
            </div>
          </Card>
        </div>

        <Card className="border bg-surface p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Members
          </h2>
          <ul className="mt-3 space-y-2">
            {members.map((u) => (
              <li key={u.id}>
                <Link
                  to="/profile/$userId"
                  params={{ userId: u.id }}
                  className="flex items-center gap-2 rounded-md p-1.5 hover:bg-muted"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={u.profileImage} />
                    <AvatarFallback>{u.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{u.name}</div>
                    <div className="truncate text-[11px] text-muted-foreground">
                      {u.department}
                    </div>
                  </div>
                  {u.id === project.ownerId && (
                    <Badge variant="outline" className="ml-auto text-[10px]">
                      Owner
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
