import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Image as ImageIcon,
  Hash,
  TrendingUp,
  Sparkles,
  Rocket,
  Users,
  Briefcase,
  MessageSquare,
  Trophy,
  Activity,
  ArrowRight,
  Zap,
  Target,
  Code2,
  Lightbulb,
  CheckCircle2,
  Calendar,
  Flame,
  Star,
  PenSquare,
  Filter,
} from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { UserCard } from "@/components/UserCard";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import type { Post, User } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/feed")({
  component: FeedPage,
});

const ACTIVITY_EVENTS = [
  { icon: Rocket, text: "Aarav launched CampusEats v1.2", tone: "primary" },
  { icon: Users, text: "Team Helios is looking for a UI designer", tone: "warning" },
  { icon: Trophy, text: "HackBangalore winners announced", tone: "success" },
  { icon: Sparkles, text: "12 new students joined from IIT-B today", tone: "primary" },
  { icon: Code2, text: "Open-source week kicks off Monday", tone: "warning" },
  { icon: Briefcase, text: "Project rooms crossed 200 active builds", tone: "success" },
  { icon: MessageSquare, text: "Priya started a thread on AI for campus", tone: "primary" },
];

const QUICK_TILES = [
  {
    icon: PenSquare,
    title: "Share an update",
    desc: "Post a thought or build log",
    to: "#composer" as const,
    accent: "primary",
  },
  {
    icon: Briefcase,
    title: "Start a project",
    desc: "Pitch an idea, find a team",
    to: "/network" as const,
    accent: "warning",
  },
  {
    icon: Users,
    title: "Find teammates",
    desc: "Match by skill and interest",
    to: "/search" as const,
    accent: "success",
  },
  {
    icon: Trophy,
    title: "Hackathon hub",
    desc: "Live events you can join",
    to: "/network" as const,
    accent: "primary",
  },
];

const ROLE_FILTERS = ["All", "Developer", "Designer", "PM", "Researcher"] as const;

const SHOWCASE_PROJECTS = [
  {
    title: "CampusEats",
    tag: "Marketplace",
    members: 4,
    blurb: "Hyperlocal food ordering inside hostel blocks.",
    stack: ["Next.js", "Mongo", "Razorpay"],
  },
  {
    title: "StudyMate AI",
    tag: "AI",
    members: 3,
    blurb: "Personal study buddy that summarises lectures.",
    stack: ["Python", "OpenAI", "FastAPI"],
  },
  {
    title: "FestPass",
    tag: "Events",
    members: 5,
    blurb: "QR-based pass system for college fests.",
    stack: ["React", "Node", "Postgres"],
  },
];

function FeedPage() {
  const me = useAuthStore((s) => s.user)!;
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [posting, setPosting] = useState(false);
  const [feedFilter, setFeedFilter] = useState<"latest" | "trending" | "mine">("latest");
  const [roleFilter, setRoleFilter] = useState<(typeof ROLE_FILTERS)[number]>("All");

  useEffect(() => {
    api.listFeed().then(setPosts);
    api.listSuggestions(8).then((users) => {
      setAllUsers(users);
      setSuggestions(users.slice(0, 4));
    });
  }, []);

  async function publish() {
    if (!content.trim()) return;
    setPosting(true);
    try {
      const tags = tagsInput
        .split(/[,\s]+/)
        .map((t) => t.replace(/^#/, "").trim())
        .filter(Boolean);
      const post = await api.createPost({ content: content.trim(), tags });
      setPosts((prev) => [post, ...prev]);
      setContent("");
      setTagsInput("");
      toast.success("Posted to your network");
    } finally {
      setPosting(false);
    }
  }

  function patchPost(updated: Post) {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  const trendingTags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags))).slice(0, 10),
    [posts],
  );

  const visiblePosts = useMemo(() => {
    if (feedFilter === "mine") return posts.filter((p) => p.userId === me.id);
    if (feedFilter === "trending")
      return [...posts].sort((a, b) => b.likes.length - a.likes.length);
    return posts;
  }, [posts, feedFilter, me.id]);

  const matchedTeammates = useMemo(() => {
    if (roleFilter === "All") return allUsers.slice(0, 3);
    const keyword = roleFilter.toLowerCase();
    const matches = allUsers.filter((u) =>
      [u.bio, u.department, ...u.skills, ...u.interests]
        .filter(Boolean)
        .some((s) => s.toLowerCase().includes(keyword)),
    );
    return (matches.length ? matches : allUsers).slice(0, 3);
  }, [allUsers, roleFilter]);

  const profileFields: Array<keyof User> = ["bio", "skills", "techStack", "github", "linkedin"];
  const filledCount = profileFields.filter((k) => {
    const v = me[k];
    return Array.isArray(v) ? v.length > 0 : Boolean(v);
  }).length;
  const completion = Math.round((filledCount / profileFields.length) * 100);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-6">
      {/* Marquee keyframes (respects reduced motion) */}
      <style>{`
        @keyframes us-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .us-marquee { animation: us-marquee 40s linear infinite; }
        .us-marquee:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .us-marquee { animation: none; }
        }
      `}</style>

      {/* 1 — Welcome console */}
      <section className="overflow-hidden rounded-2xl border bg-surface">
        <div className="grid gap-0 md:grid-cols-[1fr_auto]">
          <div className="px-5 py-5 sm:px-7 sm:py-6">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-success" />
              Live · {today}
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Welcome back, <span className="text-primary">{me.name.split(" ")[0]}</span>.
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
              Your workspace for building, collaborating, and shipping with students across colleges.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm" className="gap-1.5">
                <a href="#composer">
                  <PenSquare className="h-3.5 w-3.5" /> New post
                </a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/search">
                  <Users className="mr-1.5 h-3.5 w-3.5" /> Find teammates
                </Link>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link to="/network">
                  Explore network <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* right: stat strip */}
          <div className="grid grid-cols-3 border-t bg-background/40 md:border-l md:border-t-0">
            {[
              { label: "Score", value: me.contributionScore, icon: Zap },
              { label: "Rating", value: me.collaborationRating.toFixed(1), icon: Star },
              { label: "Profile", value: `${completion}%`, icon: Target },
            ].map((s) => (
              <div
                key={s.label}
                className="flex min-w-[88px] flex-col items-center justify-center px-4 py-4 text-center sm:px-6"
              >
                <s.icon className="h-4 w-4 text-primary" />
                <div className="mt-1 text-lg font-semibold leading-none">{s.value}</div>
                <div className="mt-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2 — Live activity ticker */}
      <section
        aria-label="Live activity"
        className="overflow-hidden rounded-xl border bg-background"
      >
        <div className="flex items-stretch">
          <div className="flex shrink-0 items-center gap-1.5 border-r bg-primary/10 px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-primary">
            <Activity className="h-3.5 w-3.5" /> Live
          </div>
          <div className="relative flex-1 overflow-hidden py-2">
            <div className="us-marquee flex gap-10 whitespace-nowrap pl-6 will-change-transform">
              {[...ACTIVITY_EVENTS, ...ACTIVITY_EVENTS].map((e, i) => (
                <span key={i} className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <e.icon
                    className={cn(
                      "h-3.5 w-3.5",
                      e.tone === "primary" && "text-primary",
                      e.tone === "success" && "text-success",
                      e.tone === "warning" && "text-warning",
                    )}
                  />
                  <span className="text-foreground">{e.text}</span>
                  <span className="text-muted-foreground/60">·</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3 — Quick action bento */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_TILES.map((t) => {
          const inner = (
            <div className="group h-full rounded-xl border bg-surface p-4 transition hover:-translate-y-0.5 hover:shadow-md">
              <div
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-lg",
                  t.accent === "primary" && "bg-primary/10 text-primary",
                  t.accent === "warning" && "bg-warning/15 text-warning",
                  t.accent === "success" && "bg-success/15 text-success",
                )}
              >
                <t.icon className="h-4 w-4" />
              </div>
              <div className="mt-3 text-sm font-semibold">{t.title}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{t.desc}</div>
              <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-primary opacity-0 transition group-hover:opacity-100">
                Open <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          );
          return t.to.startsWith("#") ? (
            <a key={t.title} href={t.to}>
              {inner}
            </a>
          ) : (
            <Link key={t.title} to={t.to as "/search"}>
              {inner}
            </Link>
          );
        })}
      </section>

      {/* 4 — Main grid: feed + side rail */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main column */}
        <div className="space-y-5">
          {/* Composer */}
          <Card id="composer" className="border bg-surface p-0 overflow-hidden">
            <div className="flex items-center justify-between border-b px-4 py-2.5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                <PenSquare className="h-3.5 w-3.5 text-primary" /> Compose
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Visible to your network
              </span>
            </div>
            <div className="flex gap-3 p-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={me.profileImage} />
                <AvatarFallback>{me.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share a build log, a question, or what you shipped today…"
                  className="min-h-[88px] resize-none border-transparent bg-background/60 focus-visible:bg-background"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative min-w-[180px] flex-1">
                    <Hash className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="add tags (comma separated)"
                      className="pl-7 text-xs"
                    />
                  </div>
                  <Button variant="ghost" size="sm" disabled title="Coming soon">
                    <ImageIcon className="mr-1 h-4 w-4" /> Image
                  </Button>
                  <Button onClick={publish} disabled={posting || !content.trim()}>
                    {posting ? "Posting…" : "Publish"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Feed filter chips */}
          <div className="flex items-center justify-between rounded-xl border bg-surface px-3 py-2">
            <div className="flex items-center gap-1">
              <Filter className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
              {(["latest", "trending", "mine"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFeedFilter(f)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium capitalize transition",
                    feedFilter === f
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {f === "latest" ? "Latest" : f === "trending" ? "Trending" : "Your posts"}
                </button>
              ))}
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">
              {visiblePosts.length} posts
            </span>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {visiblePosts.map((p) => (
              <PostCard key={p.id} post={p} onChange={patchPost} />
            ))}
            {visiblePosts.length === 0 && (
              <Card className="border border-dashed bg-surface p-8 text-center">
                <Lightbulb className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Nothing here yet. Try another filter or be the first to post.
                </p>
              </Card>
            )}
          </div>

          {/* Project showcase strip — at the bottom of the feed */}
          <section className="rounded-2xl border bg-surface p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-primary">
                  Showcase
                </div>
                <h2 className="mt-1 text-lg font-semibold">Student-built projects</h2>
              </div>
              <Button asChild size="sm" variant="ghost">
                <Link to="/network">
                  View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {SHOWCASE_PROJECTS.map((p) => (
                <div
                  key={p.title}
                  className="group rounded-xl border bg-background p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-normal text-[10px]">
                      {p.tag}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Users className="h-3 w-3" /> {p.members}
                    </span>
                  </div>
                  <div className="mt-3 text-sm font-semibold">{p.title}</div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.blurb}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Side rail */}
        <aside className="space-y-4">
          {/* Profile mini */}
          <Card className="overflow-hidden border bg-surface p-0">
            <div
              className="h-14 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${me.coverImage})` }}
            />
            <div className="-mt-7 flex flex-col items-center px-4 pb-4 text-center">
              <Avatar className="h-14 w-14 border-4 border-surface">
                <AvatarImage src={me.profileImage} />
                <AvatarFallback>{me.name[0]}</AvatarFallback>
              </Avatar>
              <Link
                to="/profile/$userId"
                params={{ userId: me.id }}
                className="mt-2 text-sm font-semibold hover:underline"
              >
                {me.name}
              </Link>
              <div className="text-xs text-muted-foreground">{me.department}</div>
              <div className="text-xs text-muted-foreground">{me.collegeName}</div>
            </div>
            <div className="border-t px-4 py-3">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                <span>Profile completeness</span>
                <span className="text-primary">{completion}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
              {completion < 100 && (
                <Button asChild variant="ghost" size="sm" className="mt-2 w-full text-xs">
                  <Link to="/profile/edit">Complete your profile →</Link>
                </Button>
              )}
            </div>
          </Card>

          {/* Smart teammate finder mini-demo */}
          <Card className="border bg-surface p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-primary" /> Smart matches
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Beta
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Pick a role to see students you could team up with.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {ROLE_FILTERS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] transition",
                    roleFilter === r
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-primary/40",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-2">
              {matchedTeammates.map((u) => (
                <UserCard key={u.id} user={u} compact />
              ))}
              {matchedTeammates.length === 0 && (
                <p className="py-3 text-center text-xs text-muted-foreground">
                  No matches yet — try a different role.
                </p>
              )}
            </div>
          </Card>

          {/* Trending tags */}
          <Card className="border bg-surface p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-primary" /> Trending tags
            </div>
            {trendingTags.length === 0 ? (
              <p className="text-xs text-muted-foreground">Tags will appear as people post.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {trendingTags.map((t) => (
                  <Badge key={t} variant="secondary" className="font-normal">
                    #{t}
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          {/* Upcoming events */}
          <Card className="border bg-surface p-4">
            <div className="mb-3 flex items-center justify-between text-sm font-semibold">
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> This week
              </span>
              <Flame className="h-4 w-4 text-warning" />
            </div>
            <ul className="space-y-2.5 text-xs">
              {[
                { day: "Mon", title: "Open-source kickoff", tag: "Workshop" },
                { day: "Wed", title: "AI x Campus meetup", tag: "Talk" },
                { day: "Sat", title: "HackSphere 24h", tag: "Hackathon" },
              ].map((e) => (
                <li key={e.title} className="flex items-start gap-3">
                  <div className="grid h-9 w-10 shrink-0 place-items-center rounded-md border bg-background font-mono text-[10px] uppercase text-muted-foreground">
                    {e.day}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-foreground">{e.title}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {e.tag}
                    </div>
                  </div>
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                </li>
              ))}
            </ul>
          </Card>

          {/* Suggestions */}
          <Card className="border bg-surface p-4">
            <div className="mb-3 flex items-center justify-between text-sm font-semibold">
              <span>People you may know</span>
              <Link to="/network" className="text-xs font-normal text-primary hover:underline">
                See all
              </Link>
            </div>
            <div className="space-y-2">
              {suggestions.map((u) => (
                <UserCard key={u.id} user={u} compact />
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
