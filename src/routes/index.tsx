import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { getSession } from "@/mocks/fakeApi";
import {
  Users,
  Briefcase,
  Sparkles,
  GraduationCap,
  MessageSquare,
  Rocket,
  Trophy,
  Target,
  Lightbulb,
  Code2,
  Network,
  Star,
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe,
} from "lucide-react";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && getSession()) {
      throw redirect({ to: "/feed" });
    }
  },
  component: Landing,
});

const features = [
  {
    icon: Network,
    title: "Cross-college network",
    desc: "Every college, every branch, every year — all in one place. Step beyond your university walls.",
  },
  {
    icon: Briefcase,
    title: "Real project collabs",
    desc: "From idea to launch — find teammates, split tasks, and build something meaningful together.",
  },
  {
    icon: MessageSquare,
    title: "Real-time messaging",
    desc: "Typing indicators, online status, and team chats — conversations that move projects forward.",
  },
  {
    icon: Sparkles,
    title: "Smart matchmaking",
    desc: "Discover the right teammate by skill, interest, and goal — matches that actually click.",
  },
];

const journey = [
  { icon: GraduationCap, step: "01", title: "Sign up", desc: "Create your profile in 30 seconds with any college email." },
  { icon: Lightbulb, step: "02", title: "Share an idea", desc: "Post your idea, project, or thought to a community that listens." },
  { icon: Users, step: "03", title: "Build a team", desc: "Match by skills and join forces with students who get it." },
  { icon: Rocket, step: "04", title: "Ship it", desc: "Build, launch, add it to your portfolio — and start your career story." },
];

const builtFor = [
  { icon: Code2, label: "Developers" },
  { icon: Sparkles, label: "Designers" },
  { icon: Lightbulb, label: "Founders" },
  { icon: Target, label: "Researchers" },
  { icon: Trophy, label: "Hackathon teams" },
  { icon: Globe, label: "Open-source contributors" },
];

const testimonials = [
  {
    quote:
      "I found a teammate from a college in another state — together we launched a SaaS product that 2k users actively use today.",
    name: "Aarav S.",
    role: "CSE, 3rd year",
  },
  {
    quote:
      "My college didn't have a coding club. On UniSphere I found a team of 4 and we won our very first hackathon together.",
    name: "Priya M.",
    role: "ECE, 2nd year",
  },
  {
    quote:
      "Recruiters now ask for my UniSphere profile, not my resume. Real projects, real impact — that's the difference.",
    name: "Rohan K.",
    role: "IT, Final year",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-surface/90 backdrop-blur">
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
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--accent),_transparent_60%)]"
            aria-hidden
          />
          <div className="mx-auto max-w-6xl px-4 py-20 lg:py-28">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border bg-surface px-3 py-1 text-xs font-medium text-primary shadow-sm">
                  <Zap className="h-3.5 w-3.5" /> India का first inter-college collaboration platform
                </span>
                <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  जहाँ <span className="text-primary">ideas</span> teams बनते हैं,
                  <br />
                  और teams <span className="text-primary">future</span> बनाती हैं।
                </h1>
                <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
                  UniSphere एक ऐसा ecosystem है जहाँ हर college के students मिलते हैं, projects build करते हैं,
                  hackathons जीतते हैं, और अपने career की पहली असली कहानी यहाँ से शुरू करते हैं।
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/signup">
                      अभी शुरू करो — Free है <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/login">मेरा already account है</Link>
                  </Button>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-success" /> कोई credit card नहीं
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-success" /> 30 second signup
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-success" /> सभी colleges welcome
                  </span>
                </div>
              </div>

              <div className="relative">
                <div
                  className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/15 via-accent to-transparent blur-2xl"
                  aria-hidden
                />
                <div className="relative grid grid-cols-2 gap-3">
                  {features.map((f) => (
                    <div
                      key={f.title}
                      className="group rounded-2xl border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                        <f.icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y bg-surface">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-10 text-center sm:grid-cols-4">
            {[
              { v: "10k+", l: "Active students" },
              { v: "200+", l: "Live projects" },
              { v: "50+", l: "Colleges connected" },
              { v: "1.2k+", l: "Teams formed" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-3xl font-semibold text-primary">{s.v}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Journey */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              तुम्हारी journey
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              4 steps में अपना college experience बदल दो
            </h2>
            <p className="mt-3 text-muted-foreground">
              ज़रूरत है सिर्फ़ एक email की — बाकी सब UniSphere तुम्हें देगा।
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {journey.map((j) => (
              <div
                key={j.step}
                className="relative rounded-2xl border bg-surface p-6 shadow-sm transition hover:shadow-md"
              >
                <span className="absolute right-4 top-4 text-3xl font-bold text-accent">{j.step}</span>
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <j.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{j.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{j.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Built for */}
        <section className="border-t bg-accent/40">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_2fr]">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">
                  हर तरह के <span className="text-primary">student</span> के लिए।
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  चाहे तुम code लिखते हो, design करते हो, या business idea रखते हो — यहाँ तुम्हारी जगह है।
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {builtFor.map((b) => (
                  <div
                    key={b.label}
                    className="flex items-center gap-3 rounded-xl border bg-surface px-4 py-3 shadow-sm"
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                      <b.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Students की कहानियाँ
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              इनकी जैसी कहानी अगली तुम्हारी हो सकती है
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-2xl border bg-surface p-6 shadow-sm"
              >
                <div className="flex gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t pt-4">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 pb-20">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground shadow-xl sm:px-12">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_50%)]"
              aria-hidden
            />
            <div className="relative">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                तुम्हारा next big project एक click दूर है।
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-foreground/85">
                Profile बनाओ, teammates ढूँढो, और अपने college life को सिर्फ़ classes से कुछ ज़्यादा बनाओ।
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" variant="secondary" className="gap-2">
                  <Link to="/signup">
                    Free में join करो <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <Link to="/login">पहले से account है?</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-surface py-8 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-6xl px-4">
          <Logo className="mx-auto" />
          <p className="mt-3">Students के लिए, students के द्वारा बनाया गया platform।</p>
          <p className="mt-2">© {new Date().getFullYear()} UniSphere · Inter-college collaboration ecosystem</p>
        </div>
      </footer>
    </div>
  );
}
