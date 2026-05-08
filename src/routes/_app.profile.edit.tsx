import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile/edit")({
  component: EditProfilePage,
});

function TagInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");
  function add() {
    const v = draft.trim();
    if (!v) return;
    if (!values.includes(v)) onChange([...values, v]);
    setDraft("");
  }
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-1.5 rounded-md border bg-surface p-2">
        {values.map((v) => (
          <Badge key={v} variant="secondary" className="gap-1 font-normal">
            {v}
            <button onClick={() => onChange(values.filter((x) => x !== v))} className="hover:text-destructive">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
          }}
          onBlur={add}
          placeholder={placeholder}
          className="min-w-[120px] flex-1 bg-transparent text-sm outline-none"
        />
      </div>
    </div>
  );
}

function EditProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState(user);

  useEffect(() => {
    setForm(user);
  }, [user]);

  if (!form) return null;
  const current = form;

  function set<K extends keyof typeof current>(k: K, v: (typeof current)[K]) {
    setForm((f) => (f ? { ...f, [k]: v } : f));
  }

  async function save() {
    if (!form) return;
    const updated = await api.updateMe({
      name: form.name,
      bio: form.bio,
      department: form.department,
      year: form.year,
      skills: form.skills,
      interests: form.interests,
      techStack: form.techStack,
      github: form.github,
      linkedin: form.linkedin,
      profileImage: form.profileImage,
      coverImage: form.coverImage,
    });
    setUser(updated);
    toast.success("Profile updated");
    navigate({ to: "/profile/$userId", params: { userId: updated.id } });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit profile</h1>
        <p className="text-sm text-muted-foreground">Tell others what you do and what you're looking for.</p>
      </div>
      <Card className="space-y-4 border bg-surface p-6">
        <div className="space-y-1.5">
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Bio</Label>
          <Textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} className="min-h-[100px]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Department</Label>
            <Input value={form.department} onChange={(e) => set("department", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Year</Label>
            <Input
              type="number"
              min={1}
              max={5}
              value={form.year}
              onChange={(e) => set("year", Number(e.target.value))}
            />
          </div>
        </div>
        <TagInput label="Skills" values={form.skills} onChange={(v) => set("skills", v)} placeholder="Add a skill, press Enter" />
        <TagInput
          label="Interests"
          values={form.interests}
          onChange={(v) => set("interests", v)}
          placeholder="Add an interest"
        />
        <TagInput
          label="Tech stack"
          values={form.techStack}
          onChange={(v) => set("techStack", v)}
          placeholder="Add a technology"
        />
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>GitHub URL</Label>
            <Input value={form.github ?? ""} onChange={(e) => set("github", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>LinkedIn URL</Label>
            <Input value={form.linkedin ?? ""} onChange={(e) => set("linkedin", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Profile image URL</Label>
            <Input value={form.profileImage} onChange={(e) => set("profileImage", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Cover image URL</Label>
            <Input value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => navigate({ to: "/profile/$userId", params: { userId: form.id } })}>
            Cancel
          </Button>
          <Button onClick={save}>Save changes</Button>
        </div>
      </Card>
    </div>
  );
}
