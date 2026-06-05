import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  Plus,
  Search,
  Bookmark,
  BookmarkCheck,
  Trophy,
  Rocket,
  FlaskConical,
  Users,
  Sparkles,
  Compass,
  UserCheck,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import type { Project, ProjectCategory } from "@/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/projects/")({
  component: ProjectsHub,
});

type TabKey =
  | "all"
  | "mine"
  | "joined"
  | "saved"
  | "hackathon"
  | "startup"
  | "research"
  | "team_request";

const TABS: { key: TabKey; label: string; icon: typeof Briefcase }[] = [
  { key: "all", label: "Browse", icon: Compass },
  { key: "mine", label: "My Projects", icon: Briefcase },
  { key: "joined", label: "Joined", icon: UserCheck },
  { key: "saved", label: "Saved", icon: Bookmark },
  { key: "hackathon", label: "Hackathons", icon: Trophy },
  { key: "startup", label: "Startup Ideas", icon: Rocket },
  { key: "research", label: "Research Labs", icon: FlaskConical },
  { key: "team_request", label: "Team Requests", icon: Users },
];

const CATEGORY_META: Record<ProjectCategory, { label: string; tone: string }> = {
  general: { label: "General", tone: "bg-muted text-foreground" },
  hackathon: { label: "Hackathon", tone: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  startup: { label: "Startup", tone: "bg-primary/15 text-primary" },
  research: { label: "Research", tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  team_request: { label: "Team Request", tone: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
};

function ProjectsHub() {
  const me = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<TabKey>("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const all = await api.listProjects();
      setProjects(all);
      setSavedIds(new Set(api.listSavedProjectIds()));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    let list = projects;
    if (tab === "mine") list = list.filter((p) => me && p.ownerId === me.id);
    else if (tab === "joined")
      list = list.filter((p) => me && p.memberIds.includes(me.id) && p.ownerId !== me.id);
    else if (tab === "saved") list = list.filter((p) => savedIds.has(p.id));
    else if (tab !== "all") list = list.filter((p) => (p.category ?? "general") === tab);

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.techStack.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [projects, tab, query, savedIds, me]);

  const counts = useMemo(() => {
    const byCat = (c: ProjectCategory) =>
      projects.filter((p) => (p.category ?? "general") === c).length;
    return {
      all: projects.length,
      mine: me ? projects.filter((p) => p.ownerId === me.id).length : 0,
      joined: me
        ? projects.filter((p) => p.memberIds.includes(me.id) && p.ownerId !== me.id).length
        : 0,
      saved: savedIds.size,
      hackathon: byCat("hackathon"),
      startup: byCat("startup"),
      research: byCat("research"),
      team_request: byCat("team_request"),
    } satisfies Record<TabKey, number>;
  }, [projects, savedIds, me]);

  async function onToggleSave(projectId: string) {
    const nowSaved = await api.toggleSaveProject(projectId);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (nowSaved) next.add(projectId);
      else next.delete(projectId);
      return next;
    });
    toast.success(nowSaved ? "Saved" : "Removed from saved");
  }

  return (
    <div className="space-y-8">
      {/* Hero — echoes the landing page */}
      <section className="relative overflow-hidden rounded-3xl border bg-surface">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--accent),_transparent_60%)]"
          aria-hidden
        />
        <div className="grid items-center gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5" /> Projects on UniSphere
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Find a team. <span className="text-primary">Ship something real.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Browse open project rooms, hackathon squads, research labs, and live team
              requests from every college — or start your own in 30 seconds.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={() => setCreateOpen(true)} className="gap-1.5">
                <Plus className="h-4 w-4" /> Start a project
              </Button>
              <Button variant="outline" onClick={() => setTab("hackathon")} className="gap-1.5">
                <Trophy className="h-4 w-4" /> Join a hackathon
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Compass, label: "Open projects", value: counts.all },
              { icon: Trophy, label: "Hackathons", value: counts.hackathon },
              { icon: Rocket, label: "Startups", value: counts.startup },
              { icon: FlaskConical, label: "Research", value: counts.research },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border bg-background p-4 shadow-sm">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-4 w-4" />
                </div>
                <div className="mt-3 text-2xl font-semibold tabular-nums">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs + search */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, tech, keywords…"
              className="bg-muted/50 pl-9"
            />
          </div>
          <Button onClick={() => setCreateOpen(true)} size="sm" className="gap-1.5 sm:self-end">
            <Plus className="h-4 w-4" /> New project
          </Button>
        </div>

        <div className="-mx-2 overflow-x-auto px-2">
          <div className="flex min-w-max gap-1.5">
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={
                    "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition " +
                    (active
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-surface text-muted-foreground hover:bg-muted hover:text-foreground")
                  }
                >
                  <t.icon className="h-3.5 w-3.5" />
                  {t.label}
                  <span
                    className={
                      "ml-1 rounded-full px-1.5 text-[10px] font-semibold tabular-nums " +
                      (active ? "bg-primary-foreground/20" : "bg-muted")
                    }
                  >
                    {counts[t.key]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid place-items-center py-20 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState tab={tab} onCreate={() => setCreateOpen(true)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCardItem
              key={p.id}
              project={p}
              saved={savedIds.has(p.id)}
              isOwner={me?.id === p.ownerId}
              isMember={me ? p.memberIds.includes(me.id) : false}
              onToggleSave={() => onToggleSave(p.id)}
            />
          ))}
        </div>
      )}

      <CreateProjectDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={refresh}
      />
    </div>
  );
}

function ProjectCardItem({
  project,
  saved,
  isOwner,
  isMember,
  onToggleSave,
}: {
  project: Project;
  saved: boolean;
  isOwner: boolean;
  isMember: boolean;
  onToggleSave: () => void;
}) {
  const meta = CATEGORY_META[project.category ?? "general"];
  return (
    <Card className="group flex h-full flex-col border bg-surface p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <Badge className={"font-normal " + meta.tone} variant="outline">
          {meta.label}
        </Badge>
        <button
          type="button"
          onClick={onToggleSave}
          aria-label={saved ? "Remove from saved" : "Save project"}
          className="rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-primary"
        >
          {saved ? (
            <BookmarkCheck className="h-4 w-4 text-primary" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
      </div>

      <Link
        to="/projects/$projectId"
        params={{ projectId: project.id }}
        className="mt-3 line-clamp-2 text-base font-semibold tracking-tight hover:text-primary"
      >
        {project.title}
      </Link>
      <p className="mt-1.5 line-clamp-3 text-sm text-muted-foreground">{project.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.techStack.slice(0, 4).map((t) => (
          <Badge key={t} variant="secondary" className="font-normal">
            {t}
          </Badge>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Users className="h-3.5 w-3.5" /> {project.memberIds.length}
        </span>
        <Badge variant="outline" className="capitalize">
          {project.status.replace("_", " ")}
        </Badge>
        <Button asChild size="sm" variant="ghost" className="h-7 px-2 text-xs">
          <Link to="/projects/$projectId" params={{ projectId: project.id }}>
            {isOwner ? "Manage" : isMember ? "Open" : "View"}
          </Link>
        </Button>
      </div>
    </Card>
  );
}

function EmptyState({ tab, onCreate }: { tab: TabKey; onCreate: () => void }) {
  const messages: Record<TabKey, { title: string; desc: string }> = {
    all: { title: "No projects yet", desc: "Be the first to start something." },
    mine: { title: "You haven't started any projects", desc: "Spin up a workspace in 30 seconds." },
    joined: { title: "Not part of any teams yet", desc: "Browse open rooms and request to join." },
    saved: { title: "Nothing saved", desc: "Tap the bookmark on a project to save it for later." },
    hackathon: { title: "No hackathon squads right now", desc: "Start one and rally a team." },
    startup: { title: "No startup ideas yet", desc: "Share your idea and find co-founders." },
    research: { title: "No active research labs", desc: "Open the first lab on UniSphere." },
    team_request: { title: "No open team requests", desc: "Post what you need — get matched fast." },
  };
  const m = messages[tab];
  return (
    <Card className="border-dashed bg-surface p-10 text-center">
      <Briefcase className="mx-auto h-8 w-8 text-muted-foreground" />
      <h3 className="mt-3 text-base font-semibold">{m.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
      <Button onClick={onCreate} className="mt-4 gap-1.5">
        <Plus className="h-4 w-4" /> Start a project
      </Button>
    </Card>
  );
}

function CreateProjectDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState("");
  const [category, setCategory] = useState<ProjectCategory>("general");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    try {
      await api.createProject({
        title: title.trim(),
        description: description.trim(),
        techStack: tech
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        category,
      });
      toast.success("Project created");
      setTitle("");
      setDescription("");
      setTech("");
      setCategory("general");
      onOpenChange(false);
      onCreated();
    } catch (err) {
      toast.error((err as Error).message ?? "Couldn't create project");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <span className="hidden" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Start a project</DialogTitle>
          <DialogDescription>
            Create a workspace, then invite teammates from any college.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Real-time campus event app"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you building? Who do you need?"
              rows={4}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <Select value={category} onValueChange={(v) => setCategory(v as ProjectCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="hackathon">Hackathon</SelectItem>
                  <SelectItem value="startup">Startup Idea</SelectItem>
                  <SelectItem value="research">Research Lab</SelectItem>
                  <SelectItem value="team_request">Team Request</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Tech stack (comma-separated)
              </label>
              <Input
                value={tech}
                onChange={(e) => setTech(e.target.value)}
                placeholder="React, Node, Postgres"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
