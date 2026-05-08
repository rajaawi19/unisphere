import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { getSession } from "@/mocks/fakeApi";
import { Users, Briefcase, Sparkles, GraduationCap, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && getSession()) {
      throw redirect({ to: "/feed" });
    }
  },
  component: Landing,
});

const features = [
  { icon: Users, title: "Cross-college network", desc: "Connect with verified students from any college, not just yours." },
  { icon: Briefcase, title: "Real project collabs", desc: "Form teams around real projects with tasks, members, and chat." },
  { icon: MessageSquare, title: "Real-time messaging", desc: "1-to-1 and team chat with online status and typing indicators." },
  { icon: Sparkles, title: "Smart matchmaking", desc: "Discover teammates by skill, college, and shared interests." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-surface">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/signup">Join UniSphere</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                <GraduationCap className="h-3.5 w-3.5" /> For students, by students
              </span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                The collaboration network for <span className="text-primary">college students.</span>
              </h1>
              <p className="mt-4 max-w-lg text-base text-muted-foreground">
                UniSphere is where students from different colleges connect, form teams, and ship real projects together.
                LinkedIn-grade profiles. GitHub-style collaboration. Built for the campus generation.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/signup">Create your profile</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/login">I already have an account</Link>
                </Button>
              </div>
              <div className="mt-6 text-xs text-muted-foreground">
                Try it instantly — sign in with any email, or use the demo account on the login page.
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/10 to-accent" aria-hidden />
              <div className="relative grid grid-cols-2 gap-3">
                {features.map((f) => (
                  <div key={f.title} className="rounded-2xl border bg-surface p-4 shadow-sm">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t bg-surface">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-10 text-center sm:grid-cols-4">
            {[
              { v: "10k+", l: "Students" },
              { v: "200+", l: "Active projects" },
              { v: "50+", l: "Colleges" },
              { v: "1.2k+", l: "Teams formed" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-semibold text-primary">{s.v}</div>
                <div className="text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t bg-surface py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} UniSphere · Built for student collaboration
      </footer>
    </div>
  );
}
