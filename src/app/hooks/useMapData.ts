import { useState, useEffect, useCallback } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const BASE = `https://${projectId}.supabase.co/functions/v1/make-server-794cc4b9`;
const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` };

export interface ServerEvent {
  id: string; title: string; category: string; date: string; time: string; endTime: string;
  location: string; address: string; organizerName: string; organizerId: string;
  isLive: boolean; isBusy: boolean; connectCount: number; considerCount: number;
  volunteeringEnabled: boolean; coverPhoto: string; broadcastMessage: string | null;
  website: string; lng: number; lat: number; upcomingDates: string[]; tags: string[];
  description?: string; gallery?: string[];
}

export interface ServerPlace {
  id: string; name: string; category: string; address: string;
  organizerName: string; organizerId: string; coverPhoto: string;
  openHours: string; website: string; volunteeringEnabled: boolean;
  followerCount: number; lng: number; lat: number; associatedEventIds: string[];
  description: string;
}

export interface ContributorApplication {
  id: string; userId: string; name: string; photo: string; bio: string;
  category: string; weeklyEvents: number; status: 'pending' | 'approved' | 'rejected';
  submittedAt: string; reason: string; reviewNote?: string; reviewedAt?: string;
  socialLinks?: Record<string, string>;
}

export function useMapData() {
  const [events, setEvents] = useState<ServerEvent[]>([]);
  const [places, setPlaces] = useState<ServerPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [evRes, plRes] = await Promise.all([
        fetch(`${BASE}/events`, { headers }),
        fetch(`${BASE}/places`, { headers }),
      ]);
      const evData = await evRes.json();
      const plData = await plRes.json();
      if (evData.events) setEvents(evData.events);
      if (plData.places) setPlaces(plData.places);
      setError(null);
    } catch (e) {
      console.error('Map data fetch error:', e);
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { events, places, loading, error, refetch: fetchAll };
}

export function useApplications() {
  const [applications, setApplications] = useState<ContributorApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/applications`, { headers });
      const data = await res.json();
      if (data.applications) setApplications(data.applications);
    } catch (e) {
      console.error('Applications fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const reviewApplication = async (id: string, status: 'approved' | 'rejected', reviewNote?: string) => {
    const res = await fetch(`${BASE}/applications/${id}/review`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ status, reviewNote }),
    });
    const data = await res.json();
    if (data.application) {
      setApplications(prev => prev.map(a => a.id === id ? data.application : a));
    }
    return data;
  };

  useEffect(() => { fetchApps(); }, [fetchApps]);

  return { applications, loading, reviewApplication, refetch: fetchApps };
}
