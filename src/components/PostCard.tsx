import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, MoreHorizontal, Briefcase, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { api } from "@/services/api";
import type { Post, Project, User } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { onRealtime } from "@/lib/realtime";
import { toast } from "sonner";

export function PostCard({ post, onChange }: { post: Post; onChange?: (p: Post) => void }) {
  const me = useAuthStore((s) => s.user);
  const [author, setAuthor] = useState<User | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [draft, setDraft] = useState("");
  const [commentAuthors, setCommentAuthors] = useState<Record<string, User>>({});

  useEffect(() => {
    api.getUser(post.userId).then((u) => u && setAuthor(u));
  }, [post.userId]);

  useEffect(() => {
    if (!showComments) return;
    const need = post.comments.map((c) => c.userId).filter((id) => !commentAuthors[id]);
    Promise.all(need.map((id) => api.getUser(id))).then((users) => {
      setCommentAuthors((prev) => {
        const next = { ...prev };
        users.forEach((u) => u && (next[u.id] = u));
        return next;
      });
    });
  }, [showComments, post.comments, commentAuthors]);

  // Live updates for this post (likes/comments) from other tabs/users.
  useEffect(() => {
    return onRealtime((evt) => {
      if (
        (evt.type === "post:like" || evt.type === "post:comment" || evt.type === "post:update") &&
        evt.post.id === post.id
      ) {
        onChange?.(evt.post);
      }
    });
  }, [post.id, onChange]);

  const liked = me ? post.likes.includes(me.id) : false;

  async function toggleLike() {
    const updated = await api.toggleLike(post.id);
    onChange?.(updated);
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    await api.addComment(post.id, draft.trim());
    setDraft("");
    // refresh
    const feed = await api.listFeed();
    const fresh = feed.find((p) => p.id === post.id);
    if (fresh) onChange?.(fresh);
  }

  if (!author) return <Card className="h-48 animate-pulse bg-muted/40" />;

  return (
    <Card className="overflow-hidden border bg-surface p-0">
      <div className="flex items-start gap-3 px-4 pt-4">
        <Link to="/profile/$userId" params={{ userId: author.id }}>
          <Avatar className="h-11 w-11">
            <AvatarImage src={author.profileImage} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            to="/profile/$userId"
            params={{ userId: author.id }}
            className="text-sm font-semibold hover:underline"
          >
            {author.name}
          </Link>
          <div className="text-xs text-muted-foreground">
            {author.department} · {author.collegeName} · Year {author.year}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="px-4 pt-3 text-sm whitespace-pre-wrap">{post.content}</div>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 px-4 pt-2">
          {post.tags.map((t) => (
            <Badge key={t} variant="secondary" className="font-normal">
              #{t}
            </Badge>
          ))}
        </div>
      )}

      {post.imageUrl && (
        <img src={post.imageUrl} alt="" className="mt-3 w-full max-h-[420px] object-cover" />
      )}

      <div className="mt-3 flex items-center justify-between border-t px-2 py-1 text-sm">
        <Button variant="ghost" size="sm" onClick={toggleLike} className={liked ? "text-primary" : ""}>
          <Heart className={`mr-2 h-4 w-4 ${liked ? "fill-current" : ""}`} /> {post.likes.length} Like
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowComments((v) => !v)}>
          <MessageCircle className="mr-2 h-4 w-4" /> {post.comments.length} Comment
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
      </div>

      {showComments && (
        <div className="border-t bg-muted/30 px-4 py-3 space-y-3">
          {me && (
            <form onSubmit={submitComment} className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={me.profileImage} />
                <AvatarFallback>{me.name[0]}</AvatarFallback>
              </Avatar>
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a comment…"
                className="bg-surface"
              />
              <Button type="submit" size="sm" disabled={!draft.trim()}>
                Post
              </Button>
            </form>
          )}
          {post.comments.map((c) => {
            const u = commentAuthors[c.userId];
            return (
              <div key={c.id} className="flex gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={u?.profileImage} />
                  <AvatarFallback>{u?.name?.[0] ?? "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 rounded-lg bg-surface px-3 py-2">
                  <div className="text-xs font-medium">{u?.name ?? "…"}</div>
                  <div className="text-sm">{c.content}</div>
                </div>
              </div>
            );
          })}
          {post.comments.length === 0 && (
            <div className="text-center text-xs text-muted-foreground">Be the first to comment.</div>
          )}
        </div>
      )}
    </Card>
  );
}
