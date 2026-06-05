import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  MessageSquare,
  Send,
  Search,
  ArrowLeft,
  Loader2,
  CheckCheck,
  Plus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { api } from "@/services/api";
import { onRealtime } from "@/lib/realtime";
import { useAuthStore } from "@/store/authStore";
import type { Conversation, Message, User } from "@/types";
import { cn } from "@/lib/utils";

type SearchSchema = { c?: string };

export const Route = createFileRoute("/_app/messages")({
  validateSearch: (search: Record<string, unknown>): SearchSchema => ({
    c: typeof search.c === "string" ? search.c : undefined,
  }),
  component: MessagesPage,
});

type Row = {
  conversation: Conversation;
  otherUser: User;
  lastMessage: Message | null;
  unread: number;
};

function MessagesPage() {
  const me = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(search.c ?? null);
  const [newOpen, setNewOpen] = useState(false);

  async function loadRows() {
    setLoading(true);
    try {
      const data = await api.listConversations();
      setRows(data);
      if (!activeId && data.length > 0 && window.innerWidth >= 768) {
        setActiveId(data[0].conversation.id);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRows();
  }, []);

  // realtime: refresh rows when messages move
  useEffect(() => {
    return onRealtime((e) => {
      if (e.type === "message:new" || e.type === "message:seen") loadRows();
    });
  }, []);

  // keep the URL in sync with the open conversation
  useEffect(() => {
    navigate({
      to: "/messages",
      search: activeId ? { c: activeId } : {},
      replace: true,
    });
  }, [activeId, navigate]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.otherUser.name.toLowerCase().includes(q) ||
        (r.lastMessage?.content.toLowerCase().includes(q) ?? false),
    );
  }, [rows, query]);

  const active = rows.find((r) => r.conversation.id === activeId) ?? null;

  return (
    <div className="grid gap-4 md:grid-cols-[320px_minmax(0,1fr)] md:gap-6">
      {/* Conversation list */}
      <aside
        className={cn(
          "flex flex-col rounded-2xl border bg-surface",
          active && "hidden md:flex",
        )}
      >
        <header className="border-b p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold tracking-tight">Messages</h1>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 gap-1.5 px-2 text-xs"
              onClick={() => setNewOpen(true)}
            >
              <Plus className="h-4 w-4" /> New
            </Button>
          </div>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations…"
              className="bg-muted/60 pl-9"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="grid place-items-center py-10 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              {query ? "No matching conversations." : "No messages yet."}
            </div>
          ) : (
            <ul className="space-y-0.5">
              {filtered.map((r) => {
                const isActive = r.conversation.id === activeId;
                const mine = r.lastMessage?.senderId === me?.id;
                return (
                  <li key={r.conversation.id}>
                    <button
                      onClick={() => setActiveId(r.conversation.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-muted/60",
                        isActive && "bg-primary/10 hover:bg-primary/10",
                      )}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={r.otherUser.profileImage} />
                        <AvatarFallback>{r.otherUser.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={cn(
                              "truncate text-sm font-medium",
                              r.unread > 0 && "font-semibold",
                            )}
                          >
                            {r.otherUser.name}
                          </span>
                          {r.lastMessage && (
                            <span className="shrink-0 text-[10px] text-muted-foreground">
                              {formatRelative(r.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <p
                            className={cn(
                              "truncate text-xs text-muted-foreground",
                              r.unread > 0 && "text-foreground",
                            )}
                          >
                            {mine && "You: "}
                            {r.lastMessage?.content ?? "Say hi 👋"}
                          </p>
                          {r.unread > 0 && (
                            <Badge className="ml-auto h-4 min-w-4 shrink-0 rounded-full px-1.5 text-[10px]">
                              {r.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      {/* Thread */}
      <section
        className={cn(
          "flex min-h-[70vh] flex-col rounded-2xl border bg-surface",
          !active && "hidden md:flex",
        )}
      >
        {active ? (
          <Thread
            row={active}
            onBack={() => setActiveId(null)}
            onActivity={loadRows}
          />
        ) : (
          <EmptyThread onStart={() => setNewOpen(true)} />
        )}
      </section>

      <NewChatDialog
        open={newOpen}
        onOpenChange={setNewOpen}
        onPick={async (userId) => {
          const conv = await api.getOrCreateConversation(userId);
          setNewOpen(false);
          await loadRows();
          setActiveId(conv.id);
        }}
      />
    </div>
  );
}

function Thread({
  row,
  onBack,
  onActivity,
}: {
  row: Row;
  onBack: () => void;
  onActivity: () => void;
}) {
  const me = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function refresh() {
    setLoading(true);
    try {
      const m = await api.listMessages(row.conversation.id);
      setMessages(m);
      await api.markConversationSeen(row.conversation.id);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.conversation.id]);

  useEffect(() => {
    return onRealtime((e) => {
      if (e.type === "message:new" && e.message.conversationId === row.conversation.id) {
        setMessages((prev) =>
          prev.some((m) => m.id === e.message.id) ? prev : [...prev, e.message],
        );
        if (e.message.senderId !== me?.id) {
          api.markConversationSeen(row.conversation.id);
        }
      }
    });
  }, [row.conversation.id, me?.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length, loading]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    setSending(true);
    const content = draft;
    setDraft("");
    try {
      const msg = await api.sendMessage(row.conversation.id, content);
      setMessages((prev) => [...prev, msg]);
      onActivity();
    } catch (err) {
      setDraft(content);
      // surface error inline
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <header className="flex items-center gap-3 border-b p-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onBack}
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Link
          to="/profile/$userId"
          params={{ userId: row.otherUser.id }}
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={row.otherUser.profileImage} />
            <AvatarFallback>{row.otherUser.name[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{row.otherUser.name}</div>
            <div className="truncate text-xs text-muted-foreground">
              {row.otherUser.department} · {row.otherUser.collegeName}
            </div>
          </div>
        </Link>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-2 overflow-y-auto bg-background/40 p-4"
      >
        {loading ? (
          <div className="grid place-items-center py-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">
            <div>
              <MessageSquare className="mx-auto h-8 w-8 opacity-50" />
              <p className="mt-2">No messages yet. Say hi 👋</p>
            </div>
          </div>
        ) : (
          messages.map((m, i) => {
            const mine = m.senderId === me?.id;
            const prev = messages[i - 1];
            const groupedWithPrev = prev && prev.senderId === m.senderId;
            return (
              <div
                key={m.id}
                className={cn(
                  "flex items-end gap-2",
                  mine ? "justify-end" : "justify-start",
                  groupedWithPrev ? "mt-0.5" : "mt-3",
                )}
              >
                {!mine && !groupedWithPrev ? (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={row.otherUser.profileImage} />
                    <AvatarFallback>{row.otherUser.name[0]}</AvatarFallback>
                  </Avatar>
                ) : (
                  !mine && <div className="w-6" />
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm",
                    mine
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-surface border",
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                  <div
                    className={cn(
                      "mt-1 flex items-center gap-1 text-[10px]",
                      mine ? "justify-end text-primary-foreground/70" : "text-muted-foreground",
                    )}
                  >
                    <span>{formatTime(m.createdAt)}</span>
                    {mine && (
                      <CheckCheck
                        className={cn("h-3 w-3", m.seen && "text-sky-300")}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={send} className="border-t p-3">
        <div className="flex items-end gap-2">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(e as unknown as React.FormEvent);
              }
            }}
            placeholder={`Message ${row.otherUser.name.split(" ")[0]}…`}
            rows={1}
            className="max-h-32 min-h-10 resize-none bg-muted/40"
          />
          <Button type="submit" size="icon" disabled={!draft.trim() || sending}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </>
  );
}

function EmptyThread({ onStart }: { onStart: () => void }) {
  return (
    <div className="grid flex-1 place-items-center p-10 text-center">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <MessageSquare className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-lg font-semibold tracking-tight">Your inbox is quiet</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Start a conversation with anyone in your network — about a project, a hackathon,
          or just to say hi.
        </p>
        <Button onClick={onStart} className="mt-4 gap-1.5">
          <Plus className="h-4 w-4" /> New message
        </Button>
      </div>
    </div>
  );
}

function NewChatDialog({
  open,
  onOpenChange,
  onPick,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onPick: (userId: string) => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    api.listMyConnections().then((u) => {
      setUsers(u);
      setLoading(false);
    });
  }, [open]);

  const filtered = users.filter((u) =>
    q.trim() ? u.name.toLowerCase().includes(q.trim().toLowerCase()) : true,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a conversation</DialogTitle>
          <DialogDescription>Pick someone from your network.</DialogDescription>
        </DialogHeader>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search your connections…"
        />
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="grid place-items-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <Card className="border-dashed bg-background p-6 text-center text-sm text-muted-foreground">
              {users.length === 0
                ? "Connect with people first, then start a chat."
                : "No matches."}
            </Card>
          ) : (
            <ul className="space-y-1">
              {filtered.map((u) => (
                <li key={u.id}>
                  <button
                    onClick={() => onPick(u.id)}
                    className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-muted"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={u.profileImage} />
                      <AvatarFallback>{u.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{u.name}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {u.department} · {u.collegeName}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
function formatRelative(iso: string) {
  const diff = (Date.now() - +new Date(iso)) / 1000;
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });
}
