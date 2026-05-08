
# UniSphere — Inter College Collaboration Platform (Plan)

## ⚠️ Important: Tech stack reality

Lovable का native stack **TanStack Start + React + Tailwind + Lovable Cloud (Postgres/Auth/Storage/Realtime/Edge Functions)** है. यहाँ हम Node/Express/MongoDB backend host नहीं कर सकते.

आपने MERN चुना है, इसलिए दो रास्ते हैं:

1. **Recommended:** Frontend Lovable में बनाएँ (React + Tailwind — वही जो आप चाहते हैं), backend आप अलग से Render/Railway पर Node+Express+MongoDB deploy करें. हम frontend को `axios` + `socket.io-client` से आपके API से connect कर देंगे. एक `VITE_API_URL` env var से switch होगा.
2. **Alternative (बाद में decide कर सकते हैं):** Lovable Cloud use करें — same features (auth, DB, realtime, storage, file upload) बिना खुद कुछ host किए मिल जाते हैं.

यह plan **option 1** के हिसाब से है — हम pure React frontend बनाएँगे जो आपके future MERN API से बात करेगा. अभी API नहीं है तो हम **mock data + localStorage** से full UI flow चलाएँगे, ताकि बाद में सिर्फ `services/` layer में real endpoints plug करने हों.

---

## Scope (MVP — Phase 1 + 2 combined)

आपने सब features माँगे हैं, लेकिन एक turn में सब देना realistic नहीं. MVP में shipping:

- Auth UI (signup, login, OTP screen, forgot/reset password)
- Student Profile (view + edit, skills, college, links, resume placeholder)
- Connections (suggested, send/accept/reject, my network)
- Idea/Post Feed (create post, like, comment)
- Real-time Chat UI (1-to-1 list, conversation view, typing/online indicators — wired to mock socket, ready for real Socket.io)
- Projects (create, list, detail with members + tasks, join request)
- Search & Discovery (skills, college, tech)
- Notifications panel
- Admin Dashboard (basic — users, posts, reports, analytics cards)
- Responsive, clean LinkedIn-style UI

Phase 2 (अलग turns में): AI matchmaking, AI resume analyzer, video calling, hackathon module, GitHub integration.

---

## UX & Design

- **Style:** Clean minimal, LinkedIn-inspired — white surfaces, subtle borders, lots of whitespace, single accent color (deep indigo/blue), sans-serif (Inter).
- **Layout:** Top nav (logo, search, nav icons, profile menu) + left rail on desktop (Home/Network/Projects/Messages/Notifications) + right rail (suggestions/trending) on Home.
- **Mobile:** Bottom tab bar + collapsible search.
- **Tokens:** सब colors `src/styles.css` में semantic tokens के रूप में (oklch).

---

## Routes (TanStack Start file-based)

```
src/routes/
  __root.tsx                  shell + providers
  index.tsx                   landing / redirect to /feed if logged in
  login.tsx
  signup.tsx
  verify-otp.tsx
  forgot-password.tsx
  reset-password.tsx
  _app.tsx                    authed layout (top nav + rails)
  _app/feed.tsx               idea feed (home)
  _app/network.tsx            connections + suggestions
  _app/profile.$userId.tsx    public profile
  _app/profile.edit.tsx       edit own profile
  _app/messages.tsx           chat list + active conversation
  _app/projects.index.tsx     project discovery
  _app/projects.new.tsx       create project
  _app/projects.$projectId.tsx project workspace (tasks, members, chat)
  _app/notifications.tsx
  _app/search.tsx
  _app/admin.tsx              admin dashboard (role-gated UI)
```

Auth gate: `_app.tsx` reads token from localStorage; if missing → redirect to `/login`.

---

## Frontend architecture

```
src/
  components/    UI (PostCard, ProfileHeader, ConnectionCard, ChatBubble, TaskItem, …)
  layouts/       AppShell, AuthShell
  services/      api.ts (axios instance), auth.ts, users.ts, posts.ts, projects.ts, chat.ts, socket.ts
  store/         Zustand stores (authStore, chatStore, notificationsStore) — lightweight, swap for Redux Toolkit later if needed
  hooks/         useAuth, useSocket, useDebounce, …
  mocks/         seed data + a fake API + fake socket so the app fully works without backend
  utils/         formatters, validators (zod schemas shared with API)
  types/         User, Post, Project, Message, Notification
```

`services/api.ts` reads `import.meta.env.VITE_API_URL`. If unset → routes to `mocks/fakeApi.ts`. This means UI works **today** and switches to real MERN backend by setting one env var later.

---

## Data models (mirror your MongoDB collections)

TypeScript types matching your suggested schemas exactly: `User`, `Post`, `Project`, `Message`, `Notification`, `ConnectionRequest`. Seeded with ~20 users across 4 colleges, ~30 posts, ~10 projects so every screen feels alive.

---

## Phasing inside this plan

To keep build quality high I will ship in 2 turns:

**Turn A (this implementation):**
- Design system + AppShell + Auth screens (with mock auth) + Profile (view/edit) + Feed (create/like/comment) + Network (suggestions/requests) + Search + Notifications panel + responsive nav.

**Turn B (next message after A):**
- Messages (chat UI + mock socket), Projects (list/create/detail with tasks/members/join), Admin dashboard, polish.

After Turn B, backend integration becomes a focused task: replace `mocks/fakeApi.ts` calls with real axios endpoints + connect real Socket.io URL.

---

## What you should plan in parallel (outside Lovable)

So you can plug it in later:
- Express API matching `services/` endpoints (I'll list exact endpoints in code comments).
- MongoDB Atlas + Mongoose models exactly matching the TS types we define.
- Socket.io server emitting events: `message:new`, `typing`, `presence`, `notification:new`.
- Deploy API to Render, set `VITE_API_URL` in Lovable project.

---

## Out of scope for MVP (will do later on request)

AI features, video calling, GitHub integration, Cloudinary uploads (we'll use local preview URLs for now), real OTP email sending, hackathon hosting.

Confirm and I'll start with **Turn A**.
