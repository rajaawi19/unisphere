import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Hash, TrendingUp } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { UserCard } from "@/components/UserCard";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import type { Post, User } from "@/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/feed")({
  component: FeedPage,
});

function FeedPage() {
  const me = useAuthStore((s) => s.user)!;
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    api.listFeed().then(setPosts);
    api.listSuggestions(4).then(setSuggestions);
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

  const trendingTags = Array.from(
    new Set(posts.flatMap((p) => p.tags)),
  ).slice(0, 8);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
      {/* Left rail — profile card */}
      <aside className="hidden lg:block">
        <Card className="overflow-hidden border bg-surface p-0">
          <div
            className="h-16 w-full bg-cover bg-center"
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
          <div className="border-t px-4 py-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Contribution score</span>
              <span className="font-semibold text-primary">{me.contributionScore}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-muted-foreground">Collab rating</span>
              <span className="font-semibold">{me.collaborationRating.toFixed(1)} / 5</span>
            </div>
          </div>
          <div className="border-t p-3">
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link to="/profile/edit">Edit profile</Link>
            </Button>
          </div>
        </Card>
      </aside>

      {/* Main feed */}
      <div className="space-y-4">
        <Card className="border bg-surface p-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={me.profileImage} />
              <AvatarFallback>{me.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share an idea, a project update, or what you're learning…"
                className="min-h-[80px] resize-none"
              />
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Hash className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="tags (comma separated)"
                    className="pl-7 text-xs"
                  />
                </div>
                <Button variant="ghost" size="sm" disabled title="Coming soon">
                  <ImageIcon className="mr-1 h-4 w-4" /> Image
                </Button>
                <Button onClick={publish} disabled={posting || !content.trim()}>
                  Post
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {posts.map((p) => (
          <PostCard key={p.id} post={p} onChange={patchPost} />
        ))}
      </div>

      {/* Right rail */}
      <aside className="hidden lg:block space-y-4">
        <Card className="border bg-surface p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-4 w-4 text-primary" /> Trending tags
          </div>
          <div className="flex flex-wrap gap-1.5">
            {trendingTags.map((t) => (
              <Badge key={t} variant="secondary" className="font-normal">
                #{t}
              </Badge>
            ))}
          </div>
        </Card>
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
  );
}
