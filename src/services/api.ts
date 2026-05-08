// Single entry point that components/services use.
// Today: backed by mocks/fakeApi.ts (localStorage).
// Later: switch implementations by setting VITE_API_URL and pointing methods at axios calls.
//
// Endpoints the future Express + Mongoose backend should expose to make this drop-in:
//   POST   /auth/signup             -> { userId, otp }
//   POST   /auth/verify-otp         -> { userId, token }
//   POST   /auth/login              -> { userId, token }
//   POST   /auth/forgot-password    -> { sent: true }
//   POST   /auth/reset-password     -> { ok: true }
//   GET    /me
//   PATCH  /me
//   GET    /users/:id
//   GET    /users/search?q=&collegeId=&skill=
//   GET    /colleges
//   GET    /connections                          -> my accepted
//   GET    /connections/incoming                 -> pending to me
//   GET    /connections/suggestions
//   POST   /connections                          { toUserId }
//   PATCH  /connections/:id                      { accept: bool }
//   GET    /posts                                -> feed
//   POST   /posts
//   POST   /posts/:id/like
//   POST   /posts/:id/comments                   { content }
//   GET    /projects
//   GET    /projects/:id
//   POST   /projects
//   POST   /projects/:id/join
//   PATCH  /projects/:id/join/:userId            { accept }
//   POST   /projects/:id/tasks                   { title }
//   PATCH  /projects/:id/tasks/:taskId           { done }
//   GET    /notifications
//   POST   /notifications/read-all
//   GET    /admin/stats
import { fakeApi } from "@/mocks/fakeApi";

export const api = fakeApi;
export type { FakeApi as Api } from "@/mocks/fakeApi";
