// Lightweight realtime bus for the mock backend.
// Cross-tab via BroadcastChannel; same-tab via window CustomEvent fallback.
import type { Post, Message } from "@/types";

export type RealtimeEvent =
  | { type: "post:new"; post: Post; actorId: string }
  | { type: "post:update"; post: Post; actorId: string }
  | { type: "post:like"; post: Post; actorId: string }
  | { type: "post:comment"; post: Post; actorId: string }
  | { type: "message:new"; message: Message; actorId: string }
  | { type: "message:seen"; conversationId: string; actorId: string };

const CHANNEL = "unisphere:realtime:v1";
const WIN_EVT = "unisphere:realtime";

let bc: BroadcastChannel | null = null;
function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined") return null;
  if (bc) return bc;
  if (typeof BroadcastChannel === "undefined") return null;
  bc = new BroadcastChannel(CHANNEL);
  return bc;
}

export function emitRealtime(event: RealtimeEvent) {
  if (typeof window === "undefined") return;
  try {
    getChannel()?.postMessage(event);
  } catch {
    // ignore
  }
  // Same-tab listeners (BroadcastChannel doesn't fire in the sender tab).
  window.dispatchEvent(new CustomEvent(WIN_EVT, { detail: event }));
}

export function onRealtime(handler: (e: RealtimeEvent) => void) {
  if (typeof window === "undefined") return () => {};
  const ch = getChannel();
  const bcHandler = (msg: MessageEvent) => handler(msg.data as RealtimeEvent);
  const winHandler = (e: Event) => handler((e as CustomEvent<RealtimeEvent>).detail);
  ch?.addEventListener("message", bcHandler);
  window.addEventListener(WIN_EVT, winHandler);
  return () => {
    ch?.removeEventListener("message", bcHandler);
    window.removeEventListener(WIN_EVT, winHandler);
  };
}
