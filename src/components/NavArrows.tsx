import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Compact back/forward navigation pill — usable on any public page (landing,
 * auth screens). The authenticated AppShell has its own copy in the header.
 */
export function NavArrows({
  className,
  variant = "solid",
}: {
  className?: string;
  variant?: "solid" | "ghost";
}) {
  const router = useRouter();
  const base =
    "inline-flex items-center rounded-full border shadow-sm overflow-hidden backdrop-blur";
  const tone =
    variant === "ghost"
      ? "border-border bg-background/70"
      : "border-border bg-surface";
  const btn =
    "grid h-8 w-8 place-items-center text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";
  return (
    <div className={cn(base, tone, className)}>
      <button
        type="button"
        aria-label="Go back"
        onClick={() => router.history.back()}
        className={cn(btn, "border-r")}
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Go forward"
        onClick={() => router.history.forward()}
        className={btn}
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
