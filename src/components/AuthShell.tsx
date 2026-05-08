import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-2">
        <div className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
          <Logo className="text-primary-foreground [&_span:last-child]:text-primary-foreground" />
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold leading-tight">
              The collaboration network <br /> built for college students.
            </h2>
            <p className="text-primary-foreground/80 max-w-md">
              Find teammates from any college, ship real projects together, and build a portfolio that recruiters actually
              want to see.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-primary-foreground/70">
            <span>4+ colleges</span>
            <span>·</span>
            <span>200+ projects</span>
            <span>·</span>
            <span>10k+ students</span>
          </div>
        </div>
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
          <div className="mx-auto w-full max-w-md">
            <div className="lg:hidden">
              <Logo />
            </div>
            <div className="mt-8 lg:mt-0">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
