import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { NavArrows } from "@/components/NavArrows";
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
  Mail,
  ShieldCheck,
  KeyRound,
  Lock,
  HelpCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
                  <Zap className="h-3.5 w-3.5" /> India's first inter-college collaboration platform
                </span>
                <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Where <span className="text-primary">ideas</span> become teams,
                  <br />
                  and teams shape the <span className="text-primary">future</span>.
                </h1>
                <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
                  UniSphere is the ecosystem where students from every college meet, build real projects,
                  win hackathons, and write the first true chapter of their career — together.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/signup">
                      Get started — it's free <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/login">I already have an account</Link>
                  </Button>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-success" /> No credit card
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-success" /> 30-second signup
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-success" /> All colleges welcome
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

        {/* Why UniSphere */}
        <section className="border-y bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Why UniSphere
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                College should be your launchpad — not a waiting room.
              </h2>
              <p className="mt-3 text-muted-foreground">
                Most students graduate with a degree but no portfolio, no network, no proof of what they can build.
                UniSphere fixes that — from day one of your first semester.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: Trophy,
                  title: "Build a portfolio that stands out",
                  desc: "Real projects with real teammates beat any course certificate. Recruiters notice the difference.",
                },
                {
                  icon: Globe,
                  title: "Break out of your campus bubble",
                  desc: "Your next co-founder, mentor, or best friend is studying at a college you've never even visited.",
                },
                {
                  icon: Zap,
                  title: "Move from learning to shipping",
                  desc: "Stop watching tutorials in isolation. Join a team, take ownership of a feature, and ship something real.",
                },
              ].map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl border bg-background p-6 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-3 rounded-2xl border bg-background p-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Find teammates by skill",
                "Join open project rooms",
                "Compete in hackathons",
                "Showcase what you build",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                <HelpCircle className="h-3.5 w-3.5" /> Frequently asked
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Everything you wanted to ask before signing up
              </h2>
              <p className="mt-3 text-muted-foreground">
                Quick, honest answers about email verification, login, privacy, and how we match you with the right people.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_2fr]">
              <div className="space-y-3">
                {[
                  { icon: Mail, label: "Email verification" },
                  { icon: KeyRound, label: "OTP login" },
                  { icon: Lock, label: "Your privacy" },
                  { icon: Sparkles, label: "How matching works" },
                ].map((t) => (
                  <div
                    key={t.label}
                    className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3 shadow-sm"
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                      <t.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{t.label}</span>
                  </div>
                ))}
                <div className="rounded-xl border bg-primary/5 p-4 text-xs leading-relaxed text-muted-foreground">
                  <ShieldCheck className="mb-2 h-5 w-5 text-primary" />
                  We treat your data the way we'd want our own treated — minimal collection, no selling, ever.
                </div>
              </div>

              <Accordion type="single" collapsible className="rounded-2xl border bg-background px-2">
                {[
                  {
                    q: "Do I need an official college email to sign up?",
                    a: "Any email works to get started — Gmail, Outlook, college domain, anything. If you sign up with a recognised college domain (.edu, .ac.in, etc.) your profile gets a verified college badge automatically. Personal emails can still join, post, and collaborate; the badge unlocks once you verify a college email later from settings.",
                  },
                  {
                    q: "How does email verification work?",
                    a: "After you create an account, we send a 6-digit OTP to your inbox. Enter it on the verification screen and you're in — no password resets, no magic links to hunt down. The code expires in 10 minutes, and you can request a new one anytime.",
                  },
                  {
                    q: "What is OTP login and why use it?",
                    a: "OTP (One-Time Password) is a short code emailed to you when you sign in. You don't have to remember another password, and even if someone guesses your email, they can't log in without access to your inbox. You can also set a regular password if you prefer — both options work.",
                  },
                  {
                    q: "Who can see my profile and posts?",
                    a: "Your profile is visible to other signed-in students by default — that's the point of a collaboration network. You control what's on it: bio, skills, projects, links. Direct messages are private. Project rooms are visible only to members. Switch to a private profile anytime from settings.",
                  },
                  {
                    q: "How do you handle my data and privacy?",
                    a: "We collect only what's needed to make the platform work: your email, profile info you choose to share, and activity inside UniSphere. We never sell your data, never share it with recruiters without your consent, and you can export or permanently delete your account in one click.",
                  },
                  {
                    q: "How does smart matchmaking actually work?",
                    a: "When you fill out your skills, interests, year, and the kind of projects you want to build, our matching engine surfaces people whose strengths complement yours — like a backend dev looking for a designer, or a researcher looking for a frontend partner. Nothing happens automatically — you decide whom to connect with.",
                  },
                  {
                    q: "Is UniSphere free?",
                    a: "Yes — completely free for students. Core features like profiles, feeds, messaging, and project collaboration will always stay free. We may add optional premium tools for clubs, fests, or recruiters later, but never gate the student experience.",
                  },
                  {
                    q: "Can I delete my account later?",
                    a: "Absolutely. Settings → Account → Delete account removes everything tied to you within 30 days. No emails to write, no support tickets, no friction.",
                  },
                ].map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-0">
                    <AccordionTrigger className="px-3 text-left text-sm font-semibold hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="px-3 text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>


        {/* Journey */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Your journey
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Transform your college experience in 4 steps
            </h2>
            <p className="mt-3 text-muted-foreground">
              All you need is one email — UniSphere takes care of the rest.
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
                  Built for every kind of <span className="text-primary">student</span>.
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Whether you write code, craft designs, or carry a business idea — there's a place for you here.
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
              Student stories
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              The next story like theirs could be yours
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
                Your next big project is one click away.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-foreground/85">
                Build your profile, find your teammates, and turn your college years into something far bigger than classes.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" variant="secondary" className="gap-2">
                  <Link to="/signup">
                    Join free <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <Link to="/login">Already have an account?</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-surface py-8 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-6xl px-4">
          <Logo className="mx-auto" />
          <p className="mt-3">A platform built for students, by students.</p>
          <p className="mt-2">© {new Date().getFullYear()} UniSphere · Inter-college collaboration ecosystem</p>
        </div>
      </footer>
    </div>
  );
}
