import axios from "axios";

// On Vercel: frontend + API are same domain → /api/... works directly
// Locally: React proxy in package.json forwards /api → localhost:5000
const api = axios.create({ baseURL: "/api" });

export const fetchLiveMatches     = () => api.get("/matches/live").then(r => r.data);
export const fetchUpcomingMatches = () => api.get("/matches/upcoming").then(r => r.data);
export const fetchSchedule        = () => api.get("/matches/schedule").then(r => r.data);
export const fetchMatchInfo       = (id) => api.get(`/matches/${id}`).then(r => r.data);
export const fetchMatchScore      = (id) => api.get(`/matches/${id}?action=score`).then(r => r.data);
export const fetchMatchScorecard  = (id) => api.get(`/matches/${id}?action=scorecard`).then(r => r.data);
export const fetchSeries          = () => api.get("/series").then(r => r.data);
export const fetchSeriesInfo      = (id) => api.get(`/series/${id}`).then(r => r.data);
export const fetchPlayers         = (search = "india") => api.get(`/players?search=${search}`).then(r => r.data);
export const fetchPlayerInfo      = (id) => api.get(`/players/${id}`).then(r => r.data);
export const fetchNews            = () => api.get("/news").then(r => r.data);
export const fetchTeams           = () => api.get("/teams").then(r => r.data);
export const fetchRankings        = () => api.get("/rankings").then(r => r.data);
