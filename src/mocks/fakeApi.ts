// Fake API backed by localStorage. Mirrors a future Express + Mongoose backend.
// Replace this file (or wire services/api.ts to axios) when the real backend is ready.
import {
  colleges,
  seedUsers,
  seedPosts,
  seedProjects,
  seedConnections,
  seedNotifications,
  DEFAULT_DEMO_USER_ID,
} from "./seed";
import { emitRealtime } from "@/lib/realtime";
import type {
  User,
  Post,
  Comment,
  Project,
  ConnectionRequest,
  Notification,
  ConnectionStatus,
  College,
} from "@/types";

const KEY = "unisphere:db:v1";
const SESSION_KEY = "unisphere:session:v1";

type DB = {
  users: User[];
  posts: Post[];
  projects: Project[];
  connections: ConnectionRequest[];
  notifications: Notification[];
  colleges: College[];
};

function isBrowser() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function load(): DB {
  if (!isBrowser()) {
    return {
      users: seedUsers,
      posts: seedPosts,
      projects: seedProjects,
      connections: seedConnections,
      notifications: seedNotifications,
      colleges,
    };
  }
  const raw = localStorage.getItem(KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as DB;
    } catch {
      // fall through and reseed
    }
  }
  const fresh: DB = {
    users: seedUsers,
    posts: seedPosts,
    projects: seedProjects,
    connections: seedConnections,
    notifications: seedNotifications,
    colleges,
  };
  localStorage.setItem(KEY, JSON.stringify(fresh));
  return fresh;
}

function save(db: DB) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, JSON.stringify(db));
}

const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms));
const id = () => Math.random().toString(36).slice(2, 10);

// ------------------------------- Auth -------------------------------

export type Session = { userId: string; token: string };

export function getSession(): Session | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as Session) : null;
}

function setSession(s: Session | null) {
  if (!isBrowser()) return;
  if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  else localStorage.removeItem(SESSION_KEY);
}

export const fakeApi = {
  // --- auth
  async signup(input: { name: string; email: string; collegeId: string; department: string; year: number; password: string }) {
    await wait();
    const db = load();
    if (db.users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
      throw new Error("Email already registered");
    }
    const college = db.colleges.find((c) => c.id === input.collegeId);
    const user: User = {
      id: "u" + id(),
      name: input.name,
      email: input.email,
      collegeId: input.collegeId,
      collegeName: college?.shortName ?? "Unknown",
      department: input.department,
      year: input.year,
      bio: "",
      skills: [],
      interests: [],
      techStack: [],
      profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(input.name)}`,
      coverImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&h=300&fit=crop",
      contributionScore: 0,
      collaborationRating: 0,
      role: "student",
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    save(db);
    // Pretend we sent OTP — return a fake one for the demo
    return { userId: user.id, otp: "123456" };
  },

  async verifyOtp(input: { userId: string; otp: string }) {
    await wait();
    if (input.otp !== "123456") throw new Error("Invalid OTP");
    const session: Session = { userId: input.userId, token: "demo-" + id() };
    setSession(session);
    return session;
  },

  async login(input: { email: string; password: string }) {
    await wait();
    const db = load();
    const user = db.users.find((u) => u.email.toLowerCase() === input.email.toLowerCase());
    if (!user) throw new Error("No account with that email");
    // Demo: any password works
    const session: Session = { userId: user.id, token: "demo-" + id() };
    setSession(session);
    return session;
  },

  async demoLogin() {
    await wait(50);
    const session: Session = { userId: DEFAULT_DEMO_USER_ID, token: "demo-" + id() };
    setSession(session);
    return session;
  },

  async forgotPassword(_email: string) {
    await wait();
    return { sent: true };
  },

  async resetPassword(_input: { token: string; password: string }) {
    await wait();
    return { ok: true };
  },

  logout() {
    setSession(null);
  },

  // --- users
  async listColleges() {
    await wait(50);
    return load().colleges;
  },

  async getMe() {
    await wait(50);
    const s = getSession();
    if (!s) return null;
    return load().users.find((u) => u.id === s.userId) ?? null;
  },

  async getUser(userId: string) {
    await wait(50);
    return load().users.find((u) => u.id === userId) ?? null;
  },

  async updateMe(patch: Partial<User>) {
    await wait();
    const s = getSession();
    if (!s) throw new Error("Not logged in");
    const db = load();
    const idx = db.users.findIndex((u) => u.id === s.userId);
    if (idx === -1) throw new Error("User not found");
    db.users[idx] = { ...db.users[idx], ...patch, id: db.users[idx].id, email: db.users[idx].email };
    save(db);
    return db.users[idx];
  },

  async searchUsers(query: string, filter?: { collegeId?: string; skill?: string }) {
    await wait(80);
    const q = query.trim().toLowerCase();
    return load().users.filter((u) => {
      if (filter?.collegeId && u.collegeId !== filter.collegeId) return false;
      if (filter?.skill && !u.skills.map((s) => s.toLowerCase()).includes(filter.skill.toLowerCase())) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.bio.toLowerCase().includes(q) ||
        u.skills.some((s) => s.toLowerCase().includes(q)) ||
        u.collegeName.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
      );
    });
  },

  // --- connections
  async getConnectionStatus(otherUserId: string): Promise<ConnectionStatus> {
    await wait(30);
    const s = getSession();
    if (!s) return "none";
    const db = load();
    const c = db.connections.find(
      (r) =>
        (r.fromUserId === s.userId && r.toUserId === otherUserId) ||
        (r.fromUserId === otherUserId && r.toUserId === s.userId),
    );
    if (!c) return "none";
    if (c.status === "accepted") return "connected";
    if (c.fromUserId === s.userId) return "pending_outgoing";
    return "pending_incoming";
  },

  async listMyConnections() {
    await wait(50);
    const s = getSession();
    if (!s) return [] as User[];
    const db = load();
    const ids = new Set<string>();
    db.connections.forEach((c) => {
      if (c.status !== "accepted") return;
      if (c.fromUserId === s.userId) ids.add(c.toUserId);
      if (c.toUserId === s.userId) ids.add(c.fromUserId);
    });
    return db.users.filter((u) => ids.has(u.id));
  },

  async listIncomingRequests() {
    await wait(50);
    const s = getSession();
    if (!s) return [];
    const db = load();
    return db.connections
      .filter((c) => c.toUserId === s.userId && c.status === "pending")
      .map((c) => ({ request: c, from: db.users.find((u) => u.id === c.fromUserId)! }));
  },

  async listSuggestions(limit = 6) {
    await wait(50);
    const s = getSession();
    const db = load();
    if (!s) return db.users.slice(0, limit);
    const connectedIds = new Set<string>([s.userId]);
    db.connections.forEach((c) => {
      if (c.fromUserId === s.userId) connectedIds.add(c.toUserId);
      if (c.toUserId === s.userId) connectedIds.add(c.fromUserId);
    });
    return db.users.filter((u) => !connectedIds.has(u.id)).slice(0, limit);
  },

  async sendConnection(toUserId: string) {
    await wait();
    const s = getSession();
    if (!s) throw new Error("Not logged in");
    const db = load();
    const exists = db.connections.find(
      (c) =>
        (c.fromUserId === s.userId && c.toUserId === toUserId) ||
        (c.fromUserId === toUserId && c.toUserId === s.userId),
    );
    if (exists) return exists;
    const cr: ConnectionRequest = {
      id: "cr" + id(),
      fromUserId: s.userId,
      toUserId,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    db.connections.push(cr);
    db.notifications.push({
      id: "n" + id(),
      userId: toUserId,
      type: "connection_request",
      fromUserId: s.userId,
      text: `${db.users.find((u) => u.id === s.userId)?.name ?? "Someone"} sent you a connection request`,
      read: false,
      createdAt: new Date().toISOString(),
    });
    save(db);
    return cr;
  },

  async respondConnection(requestId: string, accept: boolean) {
    await wait();
    const db = load();
    const idx = db.connections.findIndex((c) => c.id === requestId);
    if (idx === -1) throw new Error("Request not found");
    db.connections[idx].status = accept ? "accepted" : "rejected";
    if (accept) {
      const c = db.connections[idx];
      db.notifications.push({
        id: "n" + id(),
        userId: c.fromUserId,
        type: "connection_accepted",
        fromUserId: c.toUserId,
        text: `${db.users.find((u) => u.id === c.toUserId)?.name ?? "Someone"} accepted your connection`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
    save(db);
    return db.connections[idx];
  },

  // --- posts
  async listFeed() {
    await wait(80);
    return [...load().posts].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },

  async createPost(input: { content: string; tags: string[]; imageUrl?: string }) {
    await wait();
    const s = getSession();
    if (!s) throw new Error("Not logged in");
    const db = load();
    const post: Post = {
      id: "p" + id(),
      userId: s.userId,
      content: input.content,
      tags: input.tags,
      imageUrl: input.imageUrl,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };
    db.posts.unshift(post);
    save(db);
    return post;
  },

  async toggleLike(postId: string) {
    await wait(30);
    const s = getSession();
    if (!s) throw new Error("Not logged in");
    const db = load();
    const post = db.posts.find((p) => p.id === postId);
    if (!post) throw new Error("Post not found");
    const i = post.likes.indexOf(s.userId);
    if (i === -1) {
      post.likes.push(s.userId);
      if (post.userId !== s.userId) {
        db.notifications.push({
          id: "n" + id(),
          userId: post.userId,
          type: "post_like",
          fromUserId: s.userId,
          refId: post.id,
          text: `${db.users.find((u) => u.id === s.userId)?.name ?? "Someone"} liked your post`,
          read: false,
          createdAt: new Date().toISOString(),
        });
      }
    } else {
      post.likes.splice(i, 1);
    }
    save(db);
    return post;
  },

  async addComment(postId: string, content: string) {
    await wait(50);
    const s = getSession();
    if (!s) throw new Error("Not logged in");
    const db = load();
    const post = db.posts.find((p) => p.id === postId);
    if (!post) throw new Error("Post not found");
    const c: Comment = { id: "cm" + id(), userId: s.userId, content, createdAt: new Date().toISOString() };
    post.comments.push(c);
    save(db);
    return c;
  },

  // --- projects
  async listProjects() {
    await wait(50);
    return [...load().projects].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },

  async getProject(projectId: string) {
    await wait(30);
    return load().projects.find((p) => p.id === projectId) ?? null;
  },

  async createProject(input: { title: string; description: string; techStack: string[] }) {
    await wait();
    const s = getSession();
    if (!s) throw new Error("Not logged in");
    const db = load();
    const project: Project = {
      id: "pr" + id(),
      ...input,
      ownerId: s.userId,
      memberIds: [s.userId],
      joinRequestIds: [],
      status: "open",
      tasks: [],
      createdAt: new Date().toISOString(),
    };
    db.projects.unshift(project);
    save(db);
    return project;
  },

  async requestJoinProject(projectId: string) {
    await wait();
    const s = getSession();
    if (!s) throw new Error("Not logged in");
    const db = load();
    const p = db.projects.find((x) => x.id === projectId);
    if (!p) throw new Error("Not found");
    if (!p.memberIds.includes(s.userId) && !p.joinRequestIds.includes(s.userId)) {
      p.joinRequestIds.push(s.userId);
      save(db);
    }
    return p;
  },

  async respondJoinRequest(projectId: string, userId: string, accept: boolean) {
    await wait();
    const db = load();
    const p = db.projects.find((x) => x.id === projectId);
    if (!p) throw new Error("Not found");
    p.joinRequestIds = p.joinRequestIds.filter((u) => u !== userId);
    if (accept && !p.memberIds.includes(userId)) p.memberIds.push(userId);
    save(db);
    return p;
  },

  async toggleTask(projectId: string, taskId: string) {
    await wait(30);
    const db = load();
    const p = db.projects.find((x) => x.id === projectId);
    if (!p) throw new Error("Not found");
    const t = p.tasks.find((x) => x.id === taskId);
    if (!t) throw new Error("Task not found");
    t.done = !t.done;
    save(db);
    return p;
  },

  async addTask(projectId: string, title: string) {
    await wait(50);
    const db = load();
    const p = db.projects.find((x) => x.id === projectId);
    if (!p) throw new Error("Not found");
    p.tasks.push({ id: "t" + id(), title, done: false });
    save(db);
    return p;
  },

  // --- notifications
  async listNotifications() {
    await wait(40);
    const s = getSession();
    if (!s) return [];
    return load()
      .notifications.filter((n) => n.userId === s.userId)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },

  async markAllRead() {
    await wait(20);
    const s = getSession();
    if (!s) return;
    const db = load();
    db.notifications.forEach((n) => {
      if (n.userId === s.userId) n.read = true;
    });
    save(db);
  },

  // --- admin
  async adminStats() {
    await wait(30);
    const db = load();
    return {
      users: db.users.length,
      posts: db.posts.length,
      projects: db.projects.length,
      colleges: db.colleges.length,
      pendingConnections: db.connections.filter((c) => c.status === "pending").length,
    };
  },
};

export type FakeApi = typeof fakeApi;
