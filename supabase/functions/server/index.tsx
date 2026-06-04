import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();
app.use('*', logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

const PREFIX = "/make-server-794cc4b9";

// ── Seed data ─────────────────────────────────────────────────────────────────

const SEED_EVENTS = [
  {
    id: "e1", title: "Sunday Glory Service", category: "worship-prayer",
    date: "2026-06-08", time: "10:00 AM", endTime: "12:30 PM",
    location: "Grace City Church Main Auditorium", address: "14 Elim Way, Jubilee Quarter",
    organizerName: "Grace City Church", organizerId: "c1",
    isLive: true, isBusy: true, connectCount: 312, considerCount: 89,
    volunteeringEnabled: true,
    coverPhoto: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&h=500&fit=crop",
    broadcastMessage: "🔥 We are LIVE! Join us right now — the Spirit is moving!",
    website: "https://gracecity.church/sunday",
    lng: 28.0473, lat: -26.2041,
    upcomingDates: ["2026-06-15", "2026-06-22"],
    tags: ["worship", "sunday", "family-friendly"],
  },
  {
    id: "e2", title: "Night of Prayer & Intercession", category: "worship-prayer",
    date: "2026-06-06", time: "9:00 PM", endTime: "12:00 AM",
    location: "Kingdom Harvest Ministries", address: "7 Covenant Street",
    organizerName: "Kingdom Harvest Ministries", organizerId: "c2",
    isLive: false, isBusy: false, connectCount: 147, considerCount: 63,
    volunteeringEnabled: false,
    coverPhoto: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&h=500&fit=crop",
    broadcastMessage: null,
    website: "https://kingdomharvest.org/prayer",
    lng: 28.0620, lat: -26.2151,
    upcomingDates: ["2026-06-13"],
    tags: ["prayer", "intercession"],
  },
  {
    id: "e3", title: "Arise Youth Night", category: "youth-students",
    date: "2026-06-07", time: "6:30 PM", endTime: "10:00 PM",
    location: "The Refinery Arts Space", address: "22 Creative Quarter Blvd",
    organizerName: "Arise Youth Movement", organizerId: "c3",
    isLive: false, isBusy: false, connectCount: 428, considerCount: 201,
    volunteeringEnabled: true,
    coverPhoto: "https://images.unsplash.com/photo-1501699169021-3759ee435d66?w=800&h=500&fit=crop",
    broadcastMessage: "🎵 Tonight is going to be history. See you at 6:30!",
    website: "https://ariseyouth.co/friday",
    lng: 28.0310, lat: -26.2180,
    upcomingDates: ["2026-06-14"],
    tags: ["youth", "creative"],
  },
  {
    id: "e4", title: "Feed the City — Community Kitchen", category: "outreach-missions",
    date: "2026-06-07", time: "8:00 AM", endTime: "2:00 PM",
    location: "Lighthouse Community Centre", address: "3 Mercy Lane, Southside",
    organizerName: "Lighthouse Community Centre", organizerId: "c4",
    isLive: true, isBusy: false, connectCount: 96, considerCount: 44,
    volunteeringEnabled: true,
    coverPhoto: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=500&fit=crop",
    broadcastMessage: "🍲 Kitchen is open! We need 10 more hands — come serve!",
    website: "https://lighthousecc.org/kitchen",
    lng: 28.0680, lat: -26.1960,
    upcomingDates: ["2026-06-14", "2026-06-21"],
    tags: ["outreach", "service"],
  },
  {
    id: "e5", title: "Kingdom Creative Arts Workshop", category: "arts-culture",
    date: "2026-06-14", time: "10:00 AM", endTime: "6:00 PM",
    location: "Grace City Church — Studio Wing", address: "14 Elim Way, Jubilee Quarter",
    organizerName: "Grace City Church", organizerId: "c1",
    isLive: false, isBusy: false, connectCount: 74, considerCount: 112,
    volunteeringEnabled: false,
    coverPhoto: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=500&fit=crop",
    broadcastMessage: null,
    website: "https://gracecity.church/arts",
    lng: 28.0500, lat: -26.2060,
    upcomingDates: [],
    tags: ["arts", "workshop"],
  },
  {
    id: "e6", title: "Men's Covenant Breakfast", category: "mens-community",
    date: "2026-06-10", time: "7:00 AM", endTime: "9:30 AM",
    location: "The Covenant Hall", address: "5 Elders Row, Central District",
    organizerName: "Kingdom Harvest Ministries", organizerId: "c2",
    isLive: false, isBusy: false, connectCount: 58, considerCount: 27,
    volunteeringEnabled: false,
    coverPhoto: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=500&fit=crop",
    broadcastMessage: null,
    website: "https://kingdomharvest.org/men",
    lng: 28.0550, lat: -26.1900,
    upcomingDates: ["2026-07-08"],
    tags: ["men", "fellowship"],
  },
];

const SEED_PLACES = [
  {
    id: "p1", name: "Grace City Church", category: "churches-ministries",
    address: "14 Elim Way, Jubilee Quarter",
    organizerName: "Grace City Church", organizerId: "c1",
    coverPhoto: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&h=500&fit=crop",
    openHours: "Mon–Sat: 9AM–9PM, Sun: 7AM–2PM",
    website: "https://gracecity.church",
    volunteeringEnabled: true, followerCount: 2841,
    lng: 28.0473, lat: -26.2041,
    associatedEventIds: ["e1", "e5"],
    description: "A place where heaven touches earth.",
  },
  {
    id: "p2", name: "Lighthouse Community Centre", category: "safe-spaces",
    address: "3 Mercy Lane, Southside",
    organizerName: "Lighthouse Community Centre", organizerId: "c4",
    coverPhoto: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=500&fit=crop",
    openHours: "Mon–Fri: 7AM–10PM, Sat: 8AM–8PM",
    website: "https://lighthousecc.org",
    volunteeringEnabled: true, followerCount: 982,
    lng: 28.0680, lat: -26.1960,
    associatedEventIds: ["e4"],
    description: "A multi-purpose community space open to all.",
  },
  {
    id: "p3", name: "The Refinery Arts Space", category: "arts-creative",
    address: "22 Creative Quarter Blvd",
    organizerName: "Arise Youth Movement", organizerId: "c3",
    coverPhoto: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop",
    openHours: "Tue–Sun: 11AM–11PM",
    website: "https://ariseyouth.co/refinery",
    volunteeringEnabled: false, followerCount: 647,
    lng: 28.0310, lat: -26.2180,
    associatedEventIds: ["e3"],
    description: "A consecrated creative space for artists and musicians.",
  },
];

const SEED_APPLICATIONS = [
  {
    id: "app1", userId: "u2", name: "Emmanuel Asiedu",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    bio: "Kingdom entrepreneur and youth leader. I've been hosting informal youth gatherings for 2 years and want to go to the next level.",
    category: "youth-students", weeklyEvents: 4,
    status: "pending", submittedAt: "2026-06-01",
    reason: "I want to create regular youth events, discipleship series, and marketplace conversations for 18–30s in my district.",
    socialLinks: { instagram: "@emmanuels_kingdom" },
  },
  {
    id: "app2", userId: "u3", name: "Naomi Ferreira",
    photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop",
    bio: "Creative soul and intercessor. I run a small arts ministry and host creative worship evenings from my studio.",
    category: "arts-culture", weeklyEvents: 2,
    status: "pending", submittedAt: "2026-06-03",
    reason: "I'd love to list our Creative Worship nights and Open Studio sessions publicly to grow the Kingdom creative community.",
    socialLinks: { instagram: "@naomiferreira.art" },
  },
];

// ── Seed helper ───────────────────────────────────────────────────────────────

async function seedIfEmpty() {
  const existing = await kv.getByPrefix("event:");
  if (existing.length === 0) {
    for (const e of SEED_EVENTS) await kv.set(`event:${e.id}`, e);
  }
  const existingPlaces = await kv.getByPrefix("place:");
  if (existingPlaces.length === 0) {
    for (const p of SEED_PLACES) await kv.set(`place:${p.id}`, p);
  }
  const existingApps = await kv.getByPrefix("application:");
  if (existingApps.length === 0) {
    for (const a of SEED_APPLICATIONS) await kv.set(`application:${a.id}`, a);
  }
}
seedIfEmpty().catch(console.error);

// ── Health ────────────────────────────────────────────────────────────────────
app.get(`${PREFIX}/health`, (c) => c.json({ status: "ok" }));

// ── Events ────────────────────────────────────────────────────────────────────
app.get(`${PREFIX}/events`, async (c) => {
  try {
    const items = await kv.getByPrefix("event:");
    return c.json({ events: items });
  } catch (err) {
    console.log("Error fetching events:", err);
    return c.json({ error: String(err) }, 500);
  }
});

app.get(`${PREFIX}/events/:id`, async (c) => {
  try {
    const item = await kv.get(`event:${c.req.param("id")}`);
    if (!item) return c.json({ error: "Not found" }, 404);
    return c.json({ event: item });
  } catch (err) {
    console.log("Error fetching event:", err);
    return c.json({ error: String(err) }, 500);
  }
});

app.post(`${PREFIX}/events`, async (c) => {
  try {
    const body = await c.req.json();
    const id = body.id || `event-${Date.now()}`;
    const event = { ...body, id };
    await kv.set(`event:${id}`, event);
    return c.json({ event }, 201);
  } catch (err) {
    console.log("Error creating event:", err);
    return c.json({ error: String(err) }, 500);
  }
});

app.put(`${PREFIX}/events/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    const existing = await kv.get(`event:${id}`);
    if (!existing) return c.json({ error: "Not found" }, 404);
    const body = await c.req.json();
    const updated = { ...existing, ...body, id };
    await kv.set(`event:${id}`, updated);
    return c.json({ event: updated });
  } catch (err) {
    console.log("Error updating event:", err);
    return c.json({ error: String(err) }, 500);
  }
});

// ── Places ────────────────────────────────────────────────────────────────────
app.get(`${PREFIX}/places`, async (c) => {
  try {
    const items = await kv.getByPrefix("place:");
    return c.json({ places: items });
  } catch (err) {
    console.log("Error fetching places:", err);
    return c.json({ error: String(err) }, 500);
  }
});

app.post(`${PREFIX}/places`, async (c) => {
  try {
    const body = await c.req.json();
    const id = body.id || `place-${Date.now()}`;
    const place = { ...body, id };
    await kv.set(`place:${id}`, place);
    return c.json({ place }, 201);
  } catch (err) {
    console.log("Error creating place:", err);
    return c.json({ error: String(err) }, 500);
  }
});

// ── Contributor Applications ──────────────────────────────────────────────────
app.get(`${PREFIX}/applications`, async (c) => {
  try {
    const items = await kv.getByPrefix("application:");
    return c.json({ applications: items });
  } catch (err) {
    console.log("Error fetching applications:", err);
    return c.json({ error: String(err) }, 500);
  }
});

app.post(`${PREFIX}/applications/:id/review`, async (c) => {
  try {
    const id = c.req.param("id");
    const existing = await kv.get(`application:${id}`);
    if (!existing) return c.json({ error: "Not found" }, 404);
    const { status, reviewNote } = await c.req.json();
    if (!["approved", "rejected"].includes(status)) {
      return c.json({ error: "status must be approved or rejected" }, 400);
    }
    const updated = {
      ...existing,
      status,
      reviewNote: reviewNote || null,
      reviewedAt: new Date().toISOString(),
    };
    await kv.set(`application:${id}`, updated);
    return c.json({ application: updated });
  } catch (err) {
    console.log("Error reviewing application:", err);
    return c.json({ error: String(err) }, 500);
  }
});

// ── Impact Ideas ──────────────────────────────────────────────────────────────
app.get(`${PREFIX}/ideas`, async (c) => {
  try {
    const items = await kv.getByPrefix("idea:");
    return c.json({ ideas: items });
  } catch (err) {
    console.log("Error fetching ideas:", err);
    return c.json({ error: String(err) }, 500);
  }
});

Deno.serve(app.fetch);
