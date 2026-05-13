import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { NavArrows } from "@/components/NavArrows";
import { Button } from "@/components/ui/button";
import { Network, Rocket, Users, Sparkles, Quote, ShieldCheck, Home } from "lucide-react";

const highlights = [
  { icon: Network, title: "Cross-college network", desc: "Connect beyond your campus walls." },
  { icon: Users, title: "Find your people", desc: "Match by skill, interest & vibe." },
  { icon: Rocket, title: "Ship real projects", desc: "Move from learning to building." },
  { icon: Sparkles, title: "Build your portfolio", desc: "Proof of work that recruiters love." },
];

const quotes = [
  {
    text: "I found a teammate from another state — together we built a SaaS with 2k users.",
    name: "Aarav S.",
    role: "CSE, 3rd year",
  },
  {
    text: "My college had no coding club. Here I found a team of 4 and won my first hackathon.",
    name: "Priya M.",
    role: "ECE, 2nd year",
  },
  {
    text: "Recruiters now ask for my UniSphere profile, not my resume.",
    name: "Rohan K.",
    role: "IT, Final year",
  },
];

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const [qIdx, setQIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setQIdx((i) => (i + 1) % quotes.length), 5000);
    return () => clearInterval(id);
  }, []);
  const quote = quotes[qIdx];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Subtle ambient blobs (mobile + desktop) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-accent/60 blur-3xl"
      />

      <div className="relative mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-2">
        {/* Left brand panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
          {/* animated gradient overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,_rgba(255,255,255,0.18),_transparent_45%),radial-gradient(circle_at_80%_90%,_rgba(255,255,255,0.12),_transparent_45%)]"
          />
          {/* faint grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:32px_32px]"
          />

          <div className="relative z-10">
            <Logo className="text-primary-foreground [&_span:last-child]:text-primary-foreground" />
          </div>

          <div className="relative z-10 space-y-8">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> Built for college students
              </span>
              <h2 className="text-3xl font-semibold leading-tight">
                Where ideas become teams,
                <br />
                and teams shape the future.
              </h2>
              <p className="max-w-md text-primary-foreground/80">
                Find teammates from any college, ship real projects together, and build the portfolio recruiters
                actually want to see.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {highlights.map((h) => (
                <div
                  key={h.title}
                  className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-3 backdrop-blur transition hover:bg-primary-foreground/10"
                >
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary-foreground/15">
                    <h.icon className="h-4 w-4" />
                  </div>
                  <div className="mt-2 text-sm font-semibold">{h.title}</div>
                  <div className="text-xs text-primary-foreground/75">{h.desc}</div>
                </div>
              ))}
            </div>

            <figure
              key={quote.name}
              className="animate-in fade-in slide-in-from-bottom-2 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5 backdrop-blur duration-500"
            >
              <Quote className="h-5 w-5 text-primary-foreground/60" />
              <blockquote className="mt-2 text-sm leading-relaxed text-primary-foreground/90">
                {quote.text}
              </blockquote>
              <figcaption className="mt-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold">{quote.name}</div>
                  <div className="text-primary-foreground/65">{quote.role}</div>
                </div>
                <div className="flex gap-1">
                  {quotes.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Show story ${i + 1}`}
                      onClick={() => setQIdx(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === qIdx ? "w-6 bg-primary-foreground" : "w-1.5 bg-primary-foreground/40"
                      }`}
                    />
                  ))}
                </div>
              </figcaption>
            </figure>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-xs text-primary-foreground/70">
            <ShieldCheck className="h-4 w-4" />
            Secure by default · No spam, ever
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
          <div className="mx-auto w-full max-w-md">
            <div className="lg:hidden">
              <Logo />
            </div>
            <div className="mt-8 lg:mt-0">
              <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
              {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="mt-8 rounded-2xl border bg-surface/60 p-6 shadow-sm backdrop-blur sm:p-8">
              {children}
            </div>
            <p className="mt-6 text-center text-[11px] text-muted-foreground">
              By continuing you agree to our Terms & Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
