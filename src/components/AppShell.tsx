import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  Search,
  Shield,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/services/api";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/feed", label: "Home", icon: Home },
  { to: "/network", label: "Network", icon: Users },
  { to: "/projects", label: "Projects", icon: Briefcase },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/notifications", label: "Notifications", icon: Bell },
] as const;

export function AppShell() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [unread, setUnread] = useState(0);
  const [q, setQ] = useState("");

  useEffect(() => {
    let alive = true;
    api.listNotifications().then((n) => {
      if (alive) setUnread(n.filter((x) => !x.read).length);
    });
    return () => {
      alive = false;
    };
  }, [path]);

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/search", search: { q } as never });
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <Logo />
          <form onSubmit={submitSearch} className="ml-2 hidden flex-1 max-w-md md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search students, skills, colleges…"
                className="bg-muted/60 pl-9 border-transparent focus-visible:bg-surface"
              />
            </div>
          </form>
          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = path.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to as "/feed"}
                  className={cn(
                    "relative flex flex-col items-center px-3 py-2 text-xs text-muted-foreground hover:text-foreground",
                    active && "text-primary",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="mt-0.5">{item.label}</span>
                  {item.label === "Notifications" && unread > 0 && (
                    <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
                      {unread}
                    </span>
                  )}
                  {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
                </Link>
              );
            })}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger className="ml-2 flex flex-col items-center px-2 py-1 text-xs">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.profileImage} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="mt-0.5 text-muted-foreground">Me</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile/$userId" params={{ userId: user.id }}>
                      <UserIcon className="mr-2 h-4 w-4" /> View profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile/edit">Edit profile</Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <Shield className="mr-2 h-4 w-4" /> Admin dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      </header>

      {/* Mobile search */}
      <div className="border-b bg-surface px-4 py-2 md:hidden">
        <form onSubmit={submitSearch}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="bg-muted/60 pl-9 border-transparent"
            />
          </div>
        </form>
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <Outlet />
      </main>

      {/* Mobile bottom tabs */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-surface md:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-5">
          {navItems.map((item) => {
            const active = path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to as "/feed"}
                className={cn(
                  "relative flex flex-col items-center justify-center py-2 text-[10px] text-muted-foreground",
                  active && "text-primary",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="mt-0.5">{item.label}</span>
                {item.label === "Notifications" && unread > 0 && (
                  <Badge className="absolute right-3 top-1 h-4 min-w-4 px-1 text-[10px]">{unread}</Badge>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
