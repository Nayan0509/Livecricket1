/**
 * GA4 Analytics utility for Live Cricket Zone
 * Wraps gtag() calls with safe checks and meaningful event names
 */

const GA_ID = "G-3FB38VNBB5";

// Safe gtag wrapper — won't throw if gtag isn't loaded yet
function gtag(...args) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

// ─── Page view (call on every route change) ──────────────────────────────────
export function trackPageView(path, title) {
  gtag("config", GA_ID, {
    page_path: path,
    page_title: title || document.title,
  });
}

// ─── Match events ─────────────────────────────────────────────────────────────
export function trackMatchView(matchId, matchName, isLive) {
  gtag("event", "match_view", {
    event_category: "Match",
    event_label: matchName,
    match_id: matchId,
    is_live: isLive ? "live" : "completed",
  });
}

export function trackMatchCardClick(matchId, matchName, isLive) {
  gtag("event", "match_card_click", {
    event_category: "Match",
    event_label: matchName,
    match_id: matchId,
    is_live: isLive ? "live" : "not_live",
  });
}

// ─── Watch / YouTube events ───────────────────────────────────────────────────
export function trackWatchClick(matchId, matchName) {
  gtag("event", "watch_click", {
    event_category: "Video",
    event_label: matchName,
    match_id: matchId,
  });
}

export function trackVideoPlay(videoId, videoTitle, matchName) {
  gtag("event", "video_play", {
    event_category: "Video",
    event_label: videoTitle || matchName,
    video_id: videoId,
    match_name: matchName,
  });
}

export function trackVideoSearch(query, resultsCount) {
  gtag("event", "youtube_search", {
    event_category: "Video",
    event_label: query,
    results_count: resultsCount,
  });
}

// ─── Navigation events ────────────────────────────────────────────────────────
export function trackTournamentView(tournament) {
  gtag("event", "tournament_view", {
    event_category: "Navigation",
    event_label: tournament,
  });
}

export function trackNavClick(label, destination) {
  gtag("event", "nav_click", {
    event_category: "Navigation",
    event_label: label,
    destination,
  });
}

// ─── Search events ────────────────────────────────────────────────────────────
export function trackPlayerSearch(query) {
  gtag("event", "search", {
    search_term: query,
    event_category: "Search",
  });
}

// ─── Engagement events ────────────────────────────────────────────────────────
export function trackTabSwitch(tab, matchId) {
  gtag("event", "tab_switch", {
    event_category: "Engagement",
    event_label: tab,
    match_id: matchId,
  });
}

export function trackShareClick(matchName) {
  gtag("event", "share", {
    event_category: "Engagement",
    event_label: matchName,
    method: "copy_link",
  });
}
