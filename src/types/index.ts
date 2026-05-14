export type College = {
  id: string;
  name: string;
  shortName: string;
  domain: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  collegeId: string;
  collegeName: string;
  department: string;
  year: number;
  bio: string;
  skills: string[];
  interests: string[];
  techStack: string[];
  profileImage: string;
  coverImage: string;
  github?: string;
  linkedin?: string;
  resumeUrl?: string;
  contributionScore: number;
  collaborationRating: number; // 0-5
  role: "student" | "admin";
  createdAt: string;
};

export type Comment = {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
};

export type Post = {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  likes: string[]; // user ids
  comments: Comment[];
  projectId?: string; // optional linked project room
  createdAt: string;
};

export type ConnectionStatus = "none" | "pending_outgoing" | "pending_incoming" | "connected";

export type ConnectionRequest = {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  ownerId: string;
  memberIds: string[];
  joinRequestIds: string[];
  status: "open" | "in_progress" | "completed";
  tasks: Task[];
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  assigneeId?: string;
  done: boolean;
  dueDate?: string;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  seen: boolean;
};

export type Conversation = {
  id: string;
  participantIds: string[];
  lastMessageAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  type: "connection_request" | "connection_accepted" | "post_like" | "post_comment" | "project_invite" | "message";
  fromUserId?: string;
  refId?: string; // post/project id
  text: string;
  read: boolean;
  createdAt: string;
};
