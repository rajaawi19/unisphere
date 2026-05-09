import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/services/api";
import { toast } from "sonner";
import type { College } from "@/types";
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  Building2,
  BookOpen,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function scorePassword(pw: string) {
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 4);
}

function SignupPage() {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<College[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    collegeId: "",
    department: "",
    year: "1",
    password: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.listColleges().then(setColleges);
  }, []);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const pwScore = useMemo(() => scorePassword(form.password), [form.password]);
  const pwLabels = ["Too weak", "Weak", "Okay", "Good", "Strong"];
  const pwColors = [
    "bg-destructive",
    "bg-destructive",
    "bg-warning",
    "bg-primary",
    "bg-success",
  ];

  const completed = [
    !!form.name,
    !!form.email,
    !!form.collegeId,
    !!form.department,
    form.password.length >= 6,
  ].filter(Boolean).length;
  const totalSteps = 5;
  const progress = Math.round((completed / totalSteps) * 100);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { userId } = await api.signup({
        name: form.name,
        email: form.email,
        collegeId: form.collegeId,
        department: form.department,
        year: Number(form.year),
        password: form.password,
      });
      toast.success("Account created — verify your email to continue.");
      navigate({ to: "/verify-otp", search: { userId } as never });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Join thousands of students already building together.">
      <form onSubmit={submit} className="space-y-4">
        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Profile completeness</span>
            <span className="font-semibold text-foreground">{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Full name</Label>
          <div className="relative">
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Aarav Sharma"
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>College email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@college.edu"
              className="pl-9"
              required
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Any email works — college domains get a verified badge automatically.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>College</Label>
            <Select value={form.collegeId} onValueChange={(v) => set("collegeId", v)}>
              <SelectTrigger>
                <Building2 className="mr-1.5 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                {colleges.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.shortName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Year</Label>
            <Select value={form.year} onValueChange={(v) => set("year", v)}>
              <SelectTrigger>
                <GraduationCap className="mr-1.5 h-4 w-4 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    Year {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Department</Label>
          <div className="relative">
            <BookOpen className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={form.department}
              onChange={(e) => set("department", e.target.value)}
              placeholder="Computer Science, Mechanical, …"
              className="pl-9"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              minLength={6}
              placeholder="At least 6 characters"
              className="pl-9 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {form.password && (
            <div className="mt-1.5 space-y-1">
              <div className="grid grid-cols-4 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-colors ${
                      i < pwScore ? pwColors[pwScore] : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Strength: <span className="font-medium text-foreground">{pwLabels[pwScore]}</span>
              </p>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full gap-2" size="lg" disabled={busy || !form.collegeId}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Create account
        </Button>

        <ul className="grid gap-1.5 pt-1 text-[11px] text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Free forever for students
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" /> No credit card required
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Delete your account anytime
          </li>
        </ul>

        <p className="pt-2 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
