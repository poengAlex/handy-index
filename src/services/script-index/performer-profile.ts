// Reading a performer profile (`/performers/{id}`). The record is a scrape of
// the performer's page on some partner site, so every field is that site's
// free text — this is where it is cleaned into something worth printing.
// Language-free like the rest of services/: it returns values and codes, and
// the message layer supplies the labels and the sentences around them.
import type { PerformerProfile } from "./types";

/** Placeholders the scrapes use for "nothing here". */
const EMPTY_VALUES = new Set(["none", "n/a", "na", "-", "unknown", "null"]);

/** A free-text field worth showing, or undefined. Drops placeholders and the
 * one-letter fragments some scrapes leave behind (34 countries read "N"),
 * spells multi-values ("Blonde|Brunette") as a list, and capitalises the
 * first letter, since the same site writes "caucasian" and "Caucasian". */
export function profileText(raw?: string): string | undefined {
  const value = raw?.trim().replace(/\s*\|\s*/g, ", ");
  if (!value || value.length < 2 || EMPTY_VALUES.has(value.toLowerCase())) {
    return undefined;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Where they are from — a country, a state, a city, whatever the site had.
 * Short values are codes ("USA", "CA", "us") and print in capitals; a short
 * one in mixed case is a scrape cut off mid-name ("St", "New", "Sao"). */
export function profilePlace(raw?: string): string | undefined {
  const value = profileText(raw);
  if (!value || value.length > 3) return value;
  const code = raw?.trim() ?? "";
  const mixed = code !== code.toUpperCase() && code !== code.toLowerCase();
  return mixed ? undefined : code.toUpperCase();
}

/** Outside these the number is junk ("5\"/13cm"), not a person. The weight
 * floor sits just above "73lbs. (33kg)", which is some site's default: it is
 * on nine profiles, most of them couples standing 182 cm tall. */
const HEIGHT_CM = { min: 120, max: 215 };
const WEIGHT_KG = { min: 35, max: 200 };

const CM_PER_INCH = 2.54;
const KG_PER_LB = 0.45359237;

function inRange(value: number, range: { min: number; max: number }) {
  return value >= range.min && value <= range.max
    ? Math.round(value)
    : undefined;
}

/** Height in whole centimetres, from whichever of the scrapes' shapes it
 * came in: "5'5\"/165cm", "5 ft 6 in (168 cm)", "5' 5\"", "165 cm", a bare
 * "164". A centimetre figure wins when there is one; across the catalog it
 * never disagrees with the feet and inches beside it by more than 3 cm. */
export function profileHeight(raw?: string): number | undefined {
  const value = raw?.trim() ?? "";
  const cm = /(\d+(?:\.\d+)?)\s*cm/i.exec(value);
  if (cm) return inRange(Number(cm[1]), HEIGHT_CM);
  // 5' / 5 ft, then optional inches as ", '' (the odd ''' too) or in
  const imperial =
    /(\d+)\s*(?:'(?!')|ft)\s*(?:(\d+(?:\.\d+)?)\s*(?:"|'+|in))?/i.exec(value);
  if (imperial) {
    const inches = Number(imperial[1]) * 12 + Number(imperial[2] ?? 0);
    return inRange(inches * CM_PER_INCH, HEIGHT_CM);
  }
  // a bare number is centimetres: every one in the catalog is 153–175
  if (/^\d+$/.test(value)) return inRange(Number(value), HEIGHT_CM);
  return undefined;
}

/** Weight in whole kilograms: "115lbs/52kg", "108 lbs (49 kg)", "124lbs.
 * (56kg)", "52 Kg", "121 lbs", a bare "54". A kilogram figure wins. */
export function profileWeight(raw?: string): number | undefined {
  const value = raw?.trim() ?? "";
  const kg = /(\d+(?:\.\d+)?)\s*kg/i.exec(value);
  if (kg) return inRange(Number(kg[1]), WEIGHT_KG);
  const lb = /(\d+(?:\.\d+)?)\s*lbs?\b/i.exec(value);
  if (lb) return inRange(Number(lb[1]) * KG_PER_LB, WEIGHT_KG);
  // a bare number is kilograms: every one in the catalog is 49–69
  if (/^\d+$/.test(value)) return inRange(Number(value), WEIGHT_KG);
  return undefined;
}

/** Outside this the height and weight don't belong to one adult: a 185 cm
 * man at 36 kg (10.5), and three identical 160 cm / 150 kg profiles (58.6)
 * that read like some site's default. Real profiles run 14–37. */
const BMI = { min: 13, max: 45 };

/** Body mass index — kilograms over metres squared — to one decimal, from
 * the height and weight as read above. Undefined unless both are there and
 * the pair is plausible. */
export function profileBmi(
  height: number | undefined,
  weight: number | undefined
): number | undefined {
  if (!height || !weight) return undefined;
  const bmi = Math.round((weight / (height / 100) ** 2) * 10) / 10;
  return bmi >= BMI.min && bmi <= BMI.max ? bmi : undefined;
}

/** The same height in feet and inches, for the messages that print it so. */
export function feetAndInches(cm: number): { feet: number; inches: number } {
  const total = Math.round(cm / CM_PER_INCH);
  return { feet: Math.floor(total / 12), inches: total % 12 };
}

/** The same weight in pounds. */
export function pounds(kg: number): number {
  return Math.round(kg / KG_PER_LB);
}

/** Tattoos and piercings: mostly yes/no in any casing ("None" is a no), now
 * and then a description ("Navel, clitoris"), which is kept as written. */
export function profileYesNo(raw?: string): boolean | string | undefined {
  const value = raw?.trim().toLowerCase();
  if (!value) return undefined;
  if (value === "yes" || value === "y") return true;
  if (value === "no" || value === "n" || value === "none") return false;
  return profileText(raw);
}

export interface ProfileBirth {
  /** midnight UTC on the birthday — format it in UTC, or it slips a day
   * west of Greenwich */
  date: Date;
  age: number;
}

/** Below this the date is junk, not a birthday: a handful of scrapes carry
 * a date of birth in 2019–2024. */
const MIN_AGE = 18;
const MAX_AGE = 99;

/** Birthday and today's age, from `dateOfBirth` only. The `age` field is
 * deliberately ignored: it froze on the day of the scrape, and is wrong for
 * three in four of the performers whose birthday says otherwise. */
export function profileBirth(
  profile: PerformerProfile,
  now = new Date()
): ProfileBirth | undefined {
  if (!profile.dateOfBirth) return undefined;
  const date = new Date(profile.dateOfBirth);
  if (Number.isNaN(date.getTime())) return undefined;
  let age = now.getUTCFullYear() - date.getUTCFullYear();
  const beforeBirthday =
    now.getUTCMonth() < date.getUTCMonth() ||
    (now.getUTCMonth() === date.getUTCMonth() &&
      now.getUTCDate() < date.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age >= MIN_AGE && age <= MAX_AGE ? { date, age } : undefined;
}

/** What the career fields add up to, most specific first: a span of years,
 * an open-ended start, or only whether they are still working. */
export type ProfileCareer =
  | { kind: "span"; start: number; end: number }
  | { kind: "since"; start: number }
  | { kind: "active" }
  | { kind: "inactive" };

function careerYear(raw: string | undefined, now: Date): number | undefined {
  // "2019" or "2019-01-01"
  const year = Number.parseInt(raw?.trim().slice(0, 4) ?? "", 10);
  return year >= 1950 && year <= now.getUTCFullYear() ? year : undefined;
}

export function profileCareer(
  profile: PerformerProfile,
  now = new Date()
): ProfileCareer | undefined {
  const start = careerYear(profile.careerStart, now);
  const end = careerYear(profile.careerEnd, now);
  // "Active" and "Acting" mean working; "Inactive" and "No active" do not
  const status = profile.careerStatus?.trim().toLowerCase();
  const inactive = Boolean(status && /inactive|no active|retired/.test(status));
  if (start !== undefined && end !== undefined && end >= start) {
    return { kind: "span", start, end };
  }
  // an inactive performer with no end year has no "since" worth printing
  if (inactive) return { kind: "inactive" };
  if (start !== undefined) return { kind: "since", start };
  if (status) return { kind: "active" };
  return undefined;
}

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  hellip: "…",
  ndash: "–",
  mdash: "—"
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    const name = String(code).toLowerCase();
    if (name.startsWith("#")) {
      const point = name.startsWith("#x")
        ? Number.parseInt(name.slice(2), 16)
        : Number.parseInt(name.slice(1), 10);
      return point > 0 && point <= 0x10ffff
        ? String.fromCodePoint(point)
        : match;
    }
    return ENTITIES[name] ?? match;
  });
}

/** The bio as plain paragraphs. A few arrive as `<p>`-wrapped HTML with
 * entities in them (`&#039;`, `&rsquo;`); the markup is dropped rather than
 * rendered, so a scraped page can never put markup of its own on ours. Some
 * were encoded as many as four times over ("I&amp;amp;amp;#039;m"), hence
 * the repeat — it stops as soon as a pass changes nothing. */
export function profileBio(profile: PerformerProfile): string[] {
  const html = profile.description ?? "";
  if (!html.trim()) return [];
  let text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p\s*>/gi, "\n")
    .replace(/<[^>]*>/g, "");
  for (let pass = 0; pass < 5; pass += 1) {
    const decoded = decodeEntities(text);
    if (decoded === text) break;
    text = decoded;
  }
  return text
    .split(/\n+/)
    .map(paragraph => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

export interface ProfileLink {
  /** the site's own name ("Instagram"), or its bare domain */
  label: string;
  url: string;
}

/** Proper names by domain. The scrape's own `name` is unreliable — often the
 * performer's handle, or a fragment like "hoo" or "lnk" — so the label comes
 * from where the link actually goes. */
const SITE_NAMES: [RegExp, string][] = [
  [/(^|\.)(twitter|x)\.com$/, "X"],
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)tiktok\.com$/, "TikTok"],
  [/(^|\.)onlyfans\.com$/, "OnlyFans"],
  [/(^|\.)(fansly\.com|fans\.ly)$/, "Fansly"],
  [/(^|\.)manyvids\.com$/, "ManyVids"],
  [/(^|\.)clips4sale\.com$/, "Clips4Sale"],
  [/(^|\.)modelhub\.com$/, "Modelhub"],
  [/(^|\.)pornhub\.com$/, "Pornhub"],
  [/(^|\.)xhamsterlive\.com$/, "xHamster Live"],
  [/(^|\.)fancentro\.com$/, "FanCentro"],
  [/(^|\.)subscribestar\.adult$/, "SubscribeStar"],
  [/(^|\.)patreon\.com$/, "Patreon"],
  [/(^|\.)beacons\.ai$/, "Beacons"],
  [/(^|\.)t\.me$/, "Telegram"],
  [/(^|\.)facebook\.com$/, "Facebook"],
  [/(^|\.)snapchat\.com$/, "Snapchat"],
  [/(^|\.)youtube\.com$/, "YouTube"],
  [/(^|\.)reddit\.com$/, "Reddit"],
  [/(^|\.)(amazon\.[a-z.]+|amzn\.to|a\.co)$/, "Amazon"],
  [/(^|\.)linktr\.ee$/, "Linktree"],
  [/(^|\.)allmylinks\.com$/, "AllMyLinks"],
  [/(^|\.)chaturbate\.com$/, "Chaturbate"],
  [/(^|\.)faphouse\.com$/, "FapHouse"],
  [/(^|\.)throne\.com$/, "Throne"]
];

const MAX_LINKS = 8;

/** A web address worth making a link of, or undefined: anything but http(s)
 * (javascript:, data:) never becomes an href. */
function webUrl(raw: string | undefined): URL | undefined {
  try {
    const url = new URL(raw?.trim() ?? "");
    return url.protocol === "https:" || url.protocol === "http:"
      ? url
      : undefined;
  } catch {
    return undefined;
  }
}

/** Their own links, web addresses only, one per site. Two X accounts would
 * print as two identical pills, so the first of each wins. */
export function profileLinks(profile: PerformerProfile): ProfileLink[] {
  const links: ProfileLink[] = [];
  const seen = new Set<string>();
  for (const entry of profile.some ?? []) {
    const url = webUrl(entry.url);
    if (!url) continue;
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const label =
      SITE_NAMES.find(([pattern]) => pattern.test(host))?.[1] ?? host;
    if (seen.has(label)) continue;
    seen.add(label);
    links.push({ label, url: url.href });
    if (links.length === MAX_LINKS) break;
  }
  return links;
}

/** Their profile on the partner sites that carry them — where there are more
 * of their videos than the index has scripts for. Labelled with the site's
 * domain, as the rest of the app names partners ("pornhub.com"), and one per
 * site: a site listed twice would print as two identical pills. */
export function profilePartnerLinks(profile: PerformerProfile): ProfileLink[] {
  const links: ProfileLink[] = [];
  const seen = new Set<string>();
  for (const ref of profile.partnerSiteRefs ?? []) {
    const url = webUrl(ref.url);
    if (!url) continue;
    const label = (ref.partner_name?.trim() || url.hostname)
      .toLowerCase()
      .replace(/^www\./, "");
    if (seen.has(label)) continue;
    seen.add(label);
    links.push({ label, url: url.href });
  }
  return links;
}
