import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { UserCard } from "@/components/UserCard";
import { api } from "@/services/api";
import type { College, User } from "@/types";

export const Route = createFileRoute("/_app/search")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  component: SearchPage,
});

const POPULAR_SKILLS = ["React", "Python", "Go", "Node.js", "Swift", "Tailwind", "MongoDB", "TensorFlow"];

function SearchPage() {
  const { q } = Route.useSearch();
  const [query, setQuery] = useState(q);
  const [collegeId, setCollegeId] = useState<string>("all");
  const [skill, setSkill] = useState<string>("all");
  const [results, setResults] = useState<User[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);

  useEffect(() => {
    api.listColleges().then(setColleges);
  }, []);

  useEffect(() => {
    setQuery(q);
  }, [q]);

  useEffect(() => {
    api
      .searchUsers(query, {
        collegeId: collegeId === "all" ? undefined : collegeId,
        skill: skill === "all" ? undefined : skill,
      })
      .then(setResults);
  }, [query, collegeId, skill]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Discover students</h1>
        <p className="text-sm text-muted-foreground">Search by name, skill, college, or department.</p>
      </div>

      <Card className="border bg-surface p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="pl-9" />
          </div>
          <Select value={collegeId} onValueChange={setCollegeId}>
            <SelectTrigger>
              <SelectValue placeholder="College" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All colleges</SelectItem>
              {colleges.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.shortName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={skill} onValueChange={setSkill}>
            <SelectTrigger>
              <SelectValue placeholder="Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any skill</SelectItem>
              {POPULAR_SKILLS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {POPULAR_SKILLS.map((s) => (
            <Badge
              key={s}
              variant={skill === s ? "default" : "secondary"}
              className="cursor-pointer font-normal"
              onClick={() => setSkill(skill === s ? "all" : s)}
            >
              {s}
            </Badge>
          ))}
        </div>
      </Card>

      <div className="text-xs text-muted-foreground">
        {results.length} {results.length === 1 ? "student" : "students"} found
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.map((u) => (
          <UserCard key={u.id} user={u} />
        ))}
      </div>
      {results.length === 0 && (
        <Card className="border bg-surface p-8 text-center text-sm text-muted-foreground">
          No students match those filters.
        </Card>
      )}
    </div>
  );
}
