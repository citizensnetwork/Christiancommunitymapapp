import {
  Globe, Store, Dumbbell, Palette, Wine, HeartHandshake,
  GraduationCap, Users, User, UserRound, Flame, Candy,
  HandHeart, KeyRound, Mic, Building2, CircleDot,
  Coffee, Radio, ShoppingBag, Stethoscope, BookOpen, Heart,
} from 'lucide-react';

// ─── Event Categories (from Citizens Connect repo) ───────────────────────────

export const EVENT_CATEGORIES = [
  {
    id: 'worship-prayer',
    name: 'Worship & Prayer',
    short: 'Worship',
    hex: '#B8860B',
    bg: '#B8860B18',
    textColor: '#7a5b08',
    Icon: HeartHandshake,
  },
  {
    id: 'church-services',
    name: 'Church Services',
    short: 'Church',
    hex: '#D4AF37',
    bg: '#D4AF3718',
    textColor: '#8B6914',
    Icon: Building2,
  },
  {
    id: 'outreach-missions',
    name: 'Outreach & Missions',
    short: 'Outreach',
    hex: '#1ABC9C',
    bg: '#1ABC9C18',
    textColor: '#148f77',
    Icon: Globe,
  },
  {
    id: 'markets-expos',
    name: 'Markets & Expos',
    short: 'Markets',
    hex: '#F39C12',
    bg: '#F39C1218',
    textColor: '#b7710c',
    Icon: Store,
  },
  {
    id: 'sport-recreation',
    name: 'Sport & Recreation',
    short: 'Sport',
    hex: '#2ECC71',
    bg: '#2ECC7118',
    textColor: '#1e8449',
    Icon: CircleDot,
  },
  {
    id: 'arts-culture',
    name: 'Arts & Culture',
    short: 'Arts',
    hex: '#FF6B35',
    bg: '#FF6B3518',
    textColor: '#c44e1e',
    Icon: Palette,
  },
  {
    id: 'social-gatherings',
    name: 'Social Gatherings',
    short: 'Social',
    hex: '#E91E63',
    bg: '#E91E6318',
    textColor: '#ad1457',
    Icon: Wine,
  },
  {
    id: 'community-upliftment',
    name: 'Community Upliftment',
    short: 'Upliftment',
    hex: '#9B59B6',
    bg: '#9B59B618',
    textColor: '#7d3c98',
    Icon: HeartHandshake,
  },
  {
    id: 'education-equipping',
    name: 'Education & Equipping',
    short: 'Education',
    hex: '#3498DB',
    bg: '#3498DB18',
    textColor: '#21618c',
    Icon: GraduationCap,
  },
  {
    id: 'marriage-family',
    name: 'Marriage & Family',
    short: 'Family',
    hex: '#E74C3C',
    bg: '#E74C3C18',
    textColor: '#b03a2e',
    Icon: Users,
  },
  {
    id: 'mens-community',
    name: "Men's Community",
    short: "Men's",
    hex: '#34495E',
    bg: '#34495E18',
    textColor: '#2c3e50',
    Icon: User,
  },
  {
    id: 'womens-community',
    name: "Women's Community",
    short: "Women's",
    hex: '#C71585',
    bg: '#C7158518',
    textColor: '#8e0c5c',
    Icon: UserRound,
  },
  {
    id: 'youth-students',
    name: 'Youth & Students',
    short: 'Youth',
    hex: '#FF8C42',
    bg: '#FF8C4218',
    textColor: '#c45a18',
    Icon: Flame,
  },
  {
    id: 'kids',
    name: 'Kids',
    short: 'Kids',
    hex: '#00BCD4',
    bg: '#00BCD418',
    textColor: '#00838f',
    Icon: Candy,
  },
  {
    id: 'care-recovery',
    name: 'Care & Recovery',
    short: 'Care',
    hex: '#8E44AD',
    bg: '#8E44AD18',
    textColor: '#6c3483',
    Icon: HandHeart,
  },
  {
    id: 'members-only',
    name: 'Members Only',
    short: 'Members',
    hex: '#212121',
    bg: '#21212112',
    textColor: '#212121',
    Icon: KeyRound,
  },
  {
    id: 'conferences-summits',
    name: 'Conferences & Summits',
    short: 'Conferences',
    hex: '#5D6D7E',
    bg: '#5D6D7E18',
    textColor: '#3b4a5a',
    Icon: Mic,
  },
] as const;

// ─── Place Categories ─────────────────────────────────────────────────────────

export const PLACE_CATEGORIES = [
  { id: 'churches-ministries', name: 'Churches & Ministries', hex: '#D4AF37', bg: '#D4AF3718', Icon: Building2 },
  { id: 'hospitality-cafes', name: 'Hospitality & Cafés', hex: '#8B4513', bg: '#8B451318', Icon: Coffee },
  { id: 'recreation-sport', name: 'Recreation & Sport', hex: '#2ECC71', bg: '#2ECC7118', Icon: Dumbbell },
  { id: 'media-broadcasting', name: 'Media & Broadcasting', hex: '#9B59B6', bg: '#9B59B618', Icon: Radio },
  { id: 'retail-shopping', name: 'Retail & Shopping', hex: '#E91E63', bg: '#E91E6318', Icon: ShoppingBag },
  { id: 'health-wellness', name: 'Health & Wellness', hex: '#E74C3C', bg: '#E74C3C18', Icon: Stethoscope },
  { id: 'education-training', name: 'Education & Training', hex: '#3498DB', bg: '#3498DB18', Icon: BookOpen },
  { id: 'arts-creative', name: 'Arts & Creative', hex: '#FF6B35', bg: '#FF6B3518', Icon: Palette },
  { id: 'christian-businesses', name: 'Christian Businesses', hex: '#A67C00', bg: '#A67C0018', Icon: Store },
  { id: 'safe-spaces', name: 'Safe Spaces', hex: '#B59CD9', bg: '#B59CD918', Icon: Heart },
] as const;

export type EventCategoryId = typeof EVENT_CATEGORIES[number]['id'];
export type PlaceCategoryId = typeof PLACE_CATEGORIES[number]['id'];

export function getEventCategory(id: string) {
  return EVENT_CATEGORIES.find(c => c.id === id);
}

export function getPlaceCategory(id: string) {
  return PLACE_CATEGORIES.find(c => c.id === id);
}

// Legacy alias used across old components — maps to closest new ID
export const LEGACY_CATEGORY_MAP: Record<string, string> = {
  worship: 'worship-prayer',
  prayer: 'worship-prayer',
  youth: 'youth-students',
  outreach: 'outreach-missions',
  community: 'community-upliftment',
  arts: 'arts-culture',
  education: 'education-equipping',
  fellowship: 'social-gatherings',
  missions: 'outreach-missions',
  sports: 'sport-recreation',
};
