// Single source of truth for static institutional content.
// Swapping this for a Supabase-backed fetch later (Phase B) should not
// require touching any component markup.

export const DIRECTOR = {
  name: 'Trevor Museti',
  title: 'Founder & Director-General',
  bio: 'Trevor Museti leads the Institute for Strategic Diplomacy, setting its research agenda across the six Statecraft and Academic desks and directing its engagement with policymakers, scholars, and international partners.',
  photo: '/assets/director.jpg',
};

export const HERO_SLIDES = [
  {
    id: 'slide-1',
    eyebrow: 'Strategic Focus',
    title: 'Great-Power Competition in the Indo-Pacific',
    excerpt: 'A cross-desk assessment of shifting alliances, maritime security, and economic statecraft in the region.',
    cta: { label: 'Read the Brief', href: '#briefs' },
  },
  {
    id: 'slide-2',
    eyebrow: 'Institutional Offering',
    title: 'The ISD Fellowship Programme',
    excerpt: 'A year-long placement for early-career analysts across our six research desks, working directly with desk heads.',
    cta: { label: 'Apply for Fellowship', href: '#fellowship' },
  },
  {
    id: 'slide-3',
    eyebrow: 'Recent Publication',
    title: 'Cyber Diplomacy: Norms Without Enforcement',
    excerpt: 'An examination of the widening gap between agreed international cyber norms and state-level accountability.',
    cta: { label: 'View Publication', href: '#briefs' },
  },
];

// Unified color coding: every desk uses the SAME accent (bronze) and the
// SAME surface treatment. Differentiation comes from label and icon,
// not from a different color per card.
export const DESKS = [
  { id: 'foreign-policy', name: 'Foreign Policy', head: 'Rebecca Wanjiku', category: 'Statecraft' },
  { id: 'global-security', name: 'Global Security', head: 'George Ndungu', category: 'Statecraft' },
  { id: 'ipe-development', name: 'IPE & Development', head: 'Derick Abuti', category: 'Academic' },
  { id: 'multilateralism', name: 'Multilateralism', head: 'Penina Maina', category: 'Academic' },
  { id: 'cyber-diplomacy', name: 'Cyber Diplomacy', head: 'Lordin Maangi', category: 'Statecraft' },
  { id: 'diplomatic-practice', name: 'Diplomatic Practice', head: 'Stanley Kasuti', category: 'Academic' },
];

export const NAV_LINKS = [
  { label: 'Research Desks', href: '#desks' },
  { label: 'Publications', href: '#briefs' },
  { label: 'Leadership', href: '#director' },
  { label: 'Fellowship', href: '#fellowship' },
  { label: 'Member Portal', href: '#portal' },
];
