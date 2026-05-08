import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, withText = true }: { className?: string; withText?: boolean }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2 font-semibold", className)}>
      <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
        <GraduationCap className="h-5 w-5" />
      </span>
      {withText && (
        <span className="text-lg tracking-tight">
          Uni<span className="text-primary">Sphere</span>
        </span>
      )}
    </Link>
  );
}
