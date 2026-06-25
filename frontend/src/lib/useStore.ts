"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAssignments, getNotices, getMaterials, getEvents,
  Assignment, Notice, UploadedMaterial, CalendarEvent,
} from "./store";

/**
 * Subscribes to cf_store_update events so any component using this
 * hook will automatically re-render when the teacher posts/deletes data.
 */
export function useStore() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [materials, setMaterials] = useState<UploadedMaterial[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const refresh = useCallback(() => {
    setAssignments(getAssignments());
    setNotices(getNotices());
    setMaterials(getMaterials());
    setEvents(getEvents());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("cf_store_update", refresh);
    // Also sync across browser tabs via storage event
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("cf_store_update", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  return { assignments, notices, materials, events, refresh };
}
