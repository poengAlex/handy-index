// Pure selectors over the request board, mirroring queries.ts for the
// catalog. The votable endpoint takes take/skip and nothing else — no filter,
// no sort, and the order it serves is neither — so every control on the board
// is a composition of these over the whole loaded set.
//
// Deliberately absent: status and domain filters. The live set is 1,080
// requests, every one of them `registered` and all but two from the same
// domain; both controls would sit there filtering nothing.
import type { TagSummary } from "./queries";
import type { VideoRequest } from "./types";

export function votesOf(request: VideoRequest): number {
  return request.votes ?? 0;
}

/** Title first, then the domain — the two things a request row shows. */
export function searchRequests(
  requests: readonly VideoRequest[],
  query: string
): VideoRequest[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [...requests];
  return requests.filter(
    request =>
      request.title?.toLowerCase().includes(needle) ||
      request.domain?.toLowerCase().includes(needle)
  );
}

/** AND-match: the request must carry every requested tag. */
export function byRequestTags(
  requests: readonly VideoRequest[],
  tags: readonly string[]
): VideoRequest[] {
  if (!tags.length) return [...requests];
  return requests.filter(request =>
    tags.every(tag => request.tags?.includes(tag))
  );
}

/** Every tag on the board with its request count, most-used first. Requests
 * carry the partner's raw tag list, which repeats within one request — count
 * each tag once per request or the picker's numbers overstate. */
export function requestTagsOf(requests: readonly VideoRequest[]): TagSummary[] {
  const counts = new Map<string, number>();
  for (const request of requests) {
    for (const tag of new Set(request.tags ?? [])) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/** Requests featuring one performer, matched on the exact name.
 *
 * The catalog's byPerformer matches on performerId, which is the right
 * identity there — two people can share a stage name. The board has no such
 * id to match on: a request is scraped from the source page before it is
 * registered, and not one of the 1,351 performer entries on the live board
 * carries a performerId (see RequestPerformer). The name is the identity, so
 * the name is what filters. */
export function byRequestPerformer(
  requests: readonly VideoRequest[],
  name: string
): VideoRequest[] {
  if (!name) return [...requests];
  // trimmed on both sides: the tally keys on the trimmed name, so an entry
  // padded by the source page must still match the option it produced
  return requests.filter(request =>
    request.performers?.some(performer => performer.name?.trim() === name)
  );
}

export interface RequestPerformerSummary {
  name: string;
  count: number;
}

/** Every performer on the board with their request count, most-requested
 * first — what the performer picker offers. Keyed by name for the reason
 * byRequestPerformer is; like the tag tally, a performer counts once per
 * request even if the source page listed them twice, and nameless entries are
 * dropped since there would be nothing to print or match on. */
export function requestPerformersOf(
  requests: readonly VideoRequest[]
): RequestPerformerSummary[] {
  const counts = new Map<string, number>();
  for (const request of requests) {
    const seen = new Set<string>();
    for (const performer of request.performers ?? []) {
      const name = performer.name?.trim();
      if (!name || seen.has(name)) continue;
      seen.add(name);
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Requests the user hasn't voted on yet — "what still needs me". */
export function withoutVoted(
  requests: readonly VideoRequest[],
  votedIds: readonly string[]
): VideoRequest[] {
  const voted = new Set(votedIds);
  return requests.filter(request => !voted.has(request.requestId));
}

function time(value?: string): number {
  return value ? Date.parse(value) : 0;
}

export function mostVoted(requests: readonly VideoRequest[]): VideoRequest[] {
  // ties broken by age: of two requests on 3 votes, the one that has been
  // waiting longer is genuinely ahead in the queue
  return [...requests].sort(
    (a, b) => votesOf(b) - votesOf(a) || time(a.createdAt) - time(b.createdAt)
  );
}

export function newestRequests(
  requests: readonly VideoRequest[]
): VideoRequest[] {
  return [...requests].sort((a, b) => time(b.createdAt) - time(a.createdAt));
}

export function longestRequests(
  requests: readonly VideoRequest[]
): VideoRequest[] {
  return [...requests].sort((a, b) => (b.duration ?? 0) - (a.duration ?? 0));
}

/** The row's title falls back to the domain (5 of the live 1,080 requests
 * have no title), so A–Z sorts on what is actually printed — otherwise the
 * untitled ones all pile up at the top under an empty string. */
function displayName(request: VideoRequest): string {
  return request.title ?? request.domain ?? "";
}

export function alphabeticalRequests(
  requests: readonly VideoRequest[]
): VideoRequest[] {
  return [...requests].sort((a, b) =>
    displayName(a).localeCompare(displayName(b))
  );
}

/** requestId → its 1-based place in the scripting order. Built from the whole
 * set, so a filtered or re-sorted queue still shows true queue positions
 * instead of renumbering rows 1..n. */
export function rankByVotes(
  requests: readonly VideoRequest[]
): Map<string, number> {
  const ranks = new Map<string, number>();
  mostVoted(requests).forEach((request, index) => {
    ranks.set(request.requestId, index + 1);
  });
  return ranks;
}
