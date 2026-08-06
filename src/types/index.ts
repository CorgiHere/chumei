export type ActivityStatus =
  | "draft"
  | "announced"
  | "registration_open"
  | "registration_closing"
  | "waitlist"
  | "full"
  | "upcoming"
  | "ongoing"
  | "finished"
  | "postponed"
  | "cancelled";

export type Campus = "NTHU" | "NYCU" | "OTHER";

export type Venue = {
  id: string;
  name: string;
  campus: Campus;
  address?: string;
  description?: string;
  mapUrl?: string;
  latitude?: number;
  longitude?: number;
  meetingPoint?: string;
  accessibilityNotes?: string;
};

export type RuleSection = {
  title: string;
  content: string;
};

export type Ranking = {
  rank: number;
  school: "NTHU" | "NYCU" | "OTHER";
  teamName: string;
  score?: string;
};

export type ActivityResult = {
  status: "unpublished" | "provisional" | "official";
  publishedAt?: string;
  nthuScore?: number;
  nycuScore?: number;
  winner?: "NTHU" | "NYCU" | "DRAW" | "NONE";
  rankings?: Ranking[];
  summary?: string;
};

export type SocialLink = {
  platform: string;
  url: string;
};

export type Activity = {
  id: string;
  slug: string;
  year: number;
  index?: number;
  title: string;
  shortTitle?: string;
  subtitle?: string;
  description: string;
  tagline?: string;
  heroImage: string;
  cardImage?: string;
  startAt: string;
  endAt?: string;
  registrationStartAt?: string;
  registrationEndAt?: string;
  status: ActivityStatus;
  venue: Venue;
  categories: string[];
  format: "individual" | "team";
  teamSizeMin?: number;
  teamSizeMax?: number;
  participantLimit?: number;
  registrationFee?: number;
  registrationUrl?: string;
  waitlistUrl?: string;
  rules: RuleSection[];
  safetyNotes?: string[];
  audienceNotes?: string[];
  isScored: boolean;
  scoreWeight?: number;
  organizerIds: string[];
  partnerIds?: string[];
  result?: ActivityResult;
  galleryIds?: string[];
  relatedNewsIds?: string[];
  socialLinks?: SocialLink[];
};

export type NewsCategory =
  | "important"
  | "registration"
  | "rules"
  | "change"
  | "result"
  | "pickup"
  | "partner"
  | "behind_the_scenes";

export type NewsPost = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: NewsCategory;
  publishedAt: string;
  updatedAt?: string;
  coverImage?: string;
  content: string;
  relatedActivityIds?: string[];
  pinned?: boolean;
};

export type Partner = {
  id: string;
  name: string;
  type: "sponsor" | "club" | "venue" | "equipment" | "media";
  logo?: string;
  url?: string;
  /** If true, appear in homepage partners strip */
  showOnHome?: boolean;
  /** Short note for partners page / activity context */
  note?: string;
};

export type HistoryYear = {
  year: number;
  name: string;
  tagline: string;
  nthuScore: number;
  nycuScore: number;
  activityCount: number;
  highlights: string[];
  summary: string;
};

export type GalleryItem = {
  id: string;
  year: number;
  activityId?: string;
  title: string;
  type: "photo" | "video";
  imageUrl: string;
  instagramUrl?: string;
  alt: string;
};

export type SiteConfig = {
  year: number;
  yearName: string;
  tagline: string;
  description: string;
  nthuScore: number;
  nycuScore: number;
  instagramUrl: string;
  facebookUrl: string;
  threadsUrl: string;
  linktreeUrl: string;
  galagaUrl: string;
  merchFormUrl: string;
  rpsFormUrl: string;
  contactEmail: string;
};
