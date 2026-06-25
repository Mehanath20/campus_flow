// Shared data store (localStorage-backed)
// Teacher writes → Student reads in real-time via storage events

export type Assignment = {
  id: string;
  title: string;
  subject: string;
  marks: number;
  deadline: string;
  description: string;
  createdBy: string;
  createdAt: string;
  status: "pending" | "submitted";
};

export type Notice = {
  id: string;
  title: string;
  message: string;
  type: "exam" | "holiday" | "event" | "general";
  date: string;
  createdBy: string;
  createdAt: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: "assignment" | "exam" | "event";
  description?: string;
};

export type UploadedMaterial = {
  id: string;
  name: string;
  subject: string;
  uploadedBy: string;
  uploadedAt: string;
  type: "pdf" | "ppt" | "doc";
  size?: string;
};

export const KEYS = {
  assignments: "cf_assignments",
  notices: "cf_notices",
  events: "cf_events",
  materials: "cf_materials",
  role: "userRole",
  userName: "userName",
};

function get<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
  // Dispatch custom event so same-tab listeners (students) can react
  window.dispatchEvent(new CustomEvent("cf_store_update", { detail: { key } }));
}

// ─── Assignments ─────────────────────────────────────────────────────────────
export const getAssignments = (): Assignment[] => get(KEYS.assignments);

export const addAssignment = (a: Omit<Assignment, "id" | "createdAt" | "status">): Assignment => {
  const all = getAssignments();
  const newItem: Assignment = {
    ...a,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  save(KEYS.assignments, [newItem, ...all]);
  addEvent({
    title: a.title,
    date: a.deadline,
    type: "assignment",
    description: `${a.subject} — ${a.marks} marks`,
  });
  return newItem;
};

export const deleteAssignment = (id: string): void => {
  save(KEYS.assignments, getAssignments().filter((a) => a.id !== id));
};

// ─── Notices ─────────────────────────────────────────────────────────────────
export const getNotices = (): Notice[] => get(KEYS.notices);

export const addNotice = (n: Omit<Notice, "id" | "createdAt">): Notice => {
  const all = getNotices();
  const newItem: Notice = { ...n, id: Date.now().toString(), createdAt: new Date().toISOString() };
  save(KEYS.notices, [newItem, ...all]);
  if (n.date) {
    addEvent({ title: n.title, date: n.date, type: n.type === "exam" ? "exam" : "event", description: n.message });
  }
  return newItem;
};

export const deleteNotice = (id: string): void => {
  save(KEYS.notices, getNotices().filter((n) => n.id !== id));
};

// ─── Calendar Events ──────────────────────────────────────────────────────────
export const getEvents = (): CalendarEvent[] => get(KEYS.events);

export const addEvent = (e: Omit<CalendarEvent, "id">): CalendarEvent => {
  const all = getEvents();
  const newItem: CalendarEvent = { ...e, id: Date.now().toString() };
  save(KEYS.events, [newItem, ...all]);
  return newItem;
};

export const deleteEvent = (id: string): void => {
  save(KEYS.events, getEvents().filter((e) => e.id !== id));
};

// ─── Materials ────────────────────────────────────────────────────────────────
export const getMaterials = (): UploadedMaterial[] => get(KEYS.materials);

export const addMaterial = (m: Omit<UploadedMaterial, "id" | "uploadedAt">): UploadedMaterial => {
  const all = getMaterials();
  const newItem: UploadedMaterial = { ...m, id: Date.now().toString(), uploadedAt: new Date().toISOString() };
  save(KEYS.materials, [newItem, ...all]);
  return newItem;
};

export const deleteMaterial = (id: string): void => {
  save(KEYS.materials, getMaterials().filter((m) => m.id !== id));
};

// ─── Auth helpers ─────────────────────────────────────────────────────────────
export const getRole = (): string => {
  if (typeof window === "undefined") return "student";
  return localStorage.getItem(KEYS.role) || "student";
};
export const getUserName = (): string => {
  if (typeof window === "undefined") return "User";
  return localStorage.getItem(KEYS.userName) || "User";
};
