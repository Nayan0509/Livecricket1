import axios from "axios";

const api = axios.create({ baseURL: "/api" });

// ─── Matches ──────────────────────────────────────────────────────────────────
export const fetchAllMatches      = () => api.get("/matches/all").then(r => r.data);
export const fetchLiveMatches     = () => api.get("/matches/live").then(r => r.data);
export const fetchUpcomingMatches = () => api.get("/matches/upcoming").then(r => r.data);
export const fetchSchedule        = () => api.get("/matches/schedule").then(r => r.data);

// Match detail
export const fetchMatchInfo         = (id) => api.get(`/matches/${id}`).then(r => r.data);
export const fetchMatchScore        = (id) => api.get(`/matches/${id}/score`).then(r => r.data);
export const fetchMatchScorecard    = (id) => api.get(`/matches/${id}/scorecard`).then(r => r.data);
export const fetchMatchCommentary   = (id, page = 0) => api.get(`/matches/${id}/commentary`, { params: { page } }).then(r => r.data);
export const fetchMatchLiveData     = (id) => api.get(`/matches/${id}/live-data`).then(r => r.data);
export const fetchMatchSquad        = (id) => api.get(`/matches/${id}/squad`).then(r => r.data);

// ─── Series ───────────────────────────────────────────────────────────────────
export const fetchSeries            = () => api.get("/series").then(r => r.data);
export const fetchSeriesInfo        = (id) => api.get(`/series/${id}`).then(r => r.data);
export const fetchSeriesSchedule    = (id) => api.get(`/series/${id}/schedule`).then(r => r.data);
export const fetchSeriesStandings   = (id) => api.get(`/series/${id}/standings`).then(r => r.data);
export const fetchSeriesStats       = (id) => api.get(`/series/${id}/stats`).then(r => r.data);

// ─── Players ─────────────────────────────────────────────────────────────────
export const fetchPlayers           = (search = "india") => api.get(`/players`, { params: { search } }).then(r => r.data);
export const fetchPlayerInfo        = (id) => api.get(`/players/${id}`).then(r => r.data);

// ─── Static data ─────────────────────────────────────────────────────────────
export const fetchNews              = () => api.get("/news").then(r => r.data);
export const fetchTeams             = () => api.get("/teams").then(r => r.data);
export const fetchRankings          = (type = "batting", format = "tests", category = "men") =>
  api.get("/rankings", { params: { type, format, category } }).then(r => r.data);
export const fetchIPLStandings      = () => api.get("/matches/standings").then(r => r.data);
export const fetchVenueInfo         = (id) => api.get(`/venues/${id}`).then(r => r.data);
export const fetchSeriesArchive     = (year) => api.get(`/series/archive/${year}`).then(r => r.data);
export const fetchDetailedSchedule  = (type, month, year) => api.get("/schedule", { params: { type, month, year } }).then(r => r.data);

// ─── YouTube ─────────────────────────────────────────────────────────────────
export const fetchYouTubeSearch     = (q) => api.get("/youtube/search", { params: { q } }).then(r => r.data);
