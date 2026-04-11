import axios from "axios";

// All /api/* routes are rewritten by Vercel to /api/cricket serverless function
const api = axios.create({ baseURL: "/api" });

export const fetchAllMatches      = () => api.get("/matches/all").then(r => r.data);
export const fetchLiveMatches     = () => api.get("/matches/live").then(r => r.data);
export const fetchUpcomingMatches = () => api.get("/matches/upcoming").then(r => r.data);
export const fetchSchedule        = () => api.get("/matches/schedule").then(r => r.data);
export const fetchMatchInfo       = (id) => api.get(`/matches/${id}`).then(r => r.data);
export const fetchMatchScore      = (id) => api.get(`/matches/${id}/score`).then(r => r.data);
export const fetchMatchScorecard  = (id) => api.get(`/matches/${id}/scorecard`).then(r => r.data);
export const fetchMatchCommentary = (id) => api.get(`/matches/${id}/commentary`).then(r => r.data);
export const fetchSeries          = () => api.get("/series").then(r => r.data);
export const fetchSeriesInfo      = (id) => api.get(`/series/${id}`).then(r => r.data);
export const fetchPlayers         = (search = "india") => api.get(`/players?search=${search}`).then(r => r.data);
export const fetchPlayerInfo      = (id) => api.get(`/players/${id}`).then(r => r.data);
export const fetchNews            = () => api.get("/news").then(r => r.data);
export const fetchTeams           = () => api.get("/teams").then(r => r.data);
export const fetchRankings        = (type = "batting", format = "tests", category = "men") => 
  api.get("/rankings", { params: { type, format, category } }).then(r => r.data);

export const fetchYouTubeSearch   = (q) => api.get("/youtube/search", { params: { q } }).then(r => r.data);

