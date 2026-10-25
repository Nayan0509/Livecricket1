import axios from "axios";

const api = axios.create({ baseURL: "/api" });

// ─── Matches ──────────────────────────────────────────────────────────────────
export const fetchAllMatches      = () => api.get("/matches/all").then(r => r.data);
export const fetchLiveMatches     = () => api.get("/matches/live").then(r => r.data);
export const fetchUpcomingMatches = () => api.get("/matches/upcoming").then(r => r.data);
export const fetchSchedule        = () => api.get("/matches/schedule").then(r => r.data);

// Real-Time Server-Sent Events (SSE) stream subscriber
export const subscribeLiveMatchStream = (onData, onError) => {
  if (typeof window === "undefined" || !("EventSource" in window)) return () => {};
  try {
    const es = new EventSource("/api/matches/live-stream");
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onData) onData(data);
      } catch (e) {
        if (onError) onError(e);
      }
    };
    es.onerror = (err) => {
      if (onError) onError(err);
    };
    return () => es.close();
  } catch (err) {
    if (onError) onError(err);
    return () => {};
  }
};

// Match detail
export const fetchMatchInfo         = (id) => api.get(`/matches/${id}`).then(r => r.data);
export const fetchMatchScore        = (id) => api.get(`/matches/${id}/score`).then(r => r.data);
export const fetchMatchScorecard    = (id) => api.get(`/matches/${id}/scorecard`).then(r => r.data);
export const fetchMatchCommentary   = (id, page = 0) => api.get(`/matches/${id}/commentary`, { params: { page } }).then(r => r.data);
export const fetchMatchLiveData     = (id) => api.get(`/matches/${id}/live-data`).then(r => r.data);
export const fetchMatchSquad        = (id) => api.get(`/matches/${id}/squad`).then(r => r.data);
export const fetchMatchH2H          = (id) => api.get(`/matches/${id}/h2h`).then(r => r.data);
export const fetchMatchFullInfo     = (id) => api.get(`/matches/${id}/info`).then(r => r.data);
export const fetchMatchOvers        = (id) => api.get(`/matches/${id}/overs`).then(r => r.data);

// ─── Series ───────────────────────────────────────────────────────────────────
export const fetchSeries            = () => api.get("/series").then(r => r.data);
export const fetchSeriesInfo        = (id) => api.get(`/series/${id}`).then(r => r.data);
export const fetchSeriesSchedule    = (id) => api.get(`/series/${id}/schedule`).then(r => r.data);
export const fetchSeriesStandings   = (id) => api.get(`/series/${id}/standings`).then(r => r.data);
export const fetchSeriesStats       = (id) => api.get(`/series/${id}/stats`).then(r => r.data);
export const fetchSeriesSquads      = (id) => api.get(`/series/${id}/squads`).then(r => r.data);

// ─── Players ─────────────────────────────────────────────────────────────────
export const fetchPlayers           = (search = "india") => api.get(`/players`, { params: { search } }).then(r => r.data);
export const fetchPlayerInfo        = (id) => api.get(`/players/${id}`).then(r => r.data);

// ─── Static data ─────────────────────────────────────────────────────────────
export const fetchNews              = () => api.get("/news").then(r => r.data);
export const fetchNewsEnhanced      = () => api.get("/news?enhanced=1").then(r => r.data);
export const fetchTeams             = () => api.get("/teams").then(r => r.data);
export const fetchTeamDetail        = (id) => api.get(`/teams/${id}`).then(r => r.data);
export const fetchRankings          = (type = "batting", format = "tests", category = "men") =>
  api.get("/rankings", { params: { type, format, category } }).then(r => r.data);
export const fetchIPLStandings      = () => api.get("/matches/standings").then(r => r.data);
export const fetchVenueInfo         = (id) => api.get(`/venues/${id}`).then(r => r.data);
export const fetchSeriesArchive     = (year) => api.get(`/series/archive/${year}`).then(r => r.data);
export const fetchDetailedSchedule  = (type, month, year) => api.get("/schedule", { params: { type, month, year } }).then(r => r.data);
// International records computed from Cricsheet data (format: test|odi|t20i, gender: men|women)
export const fetchRecords          = (format, gender) => api.get("/stats", { params: { format, gender } }).then(r => r.data);

// ─── YouTube ─────────────────────────────────────────────────────────────────
export const fetchYouTubeSearch     = (q) => api.get("/youtube/search", { params: { q } }).then(r => r.data);

// ─── Kachuful Multiplayer Rooms ───────────────────────────────────────────
export const createKachufulRoom    = (hostName) => api.post("/games/kachuful/rooms", { action: "create", hostName }).then(r => r.data);
export const joinKachufulRoom      = (roomId, playerName) => api.post("/games/kachuful/rooms", { action: "join", roomId, playerName }).then(r => r.data);
export const fetchKachufulRoom     = (roomId, playerName) => api.get(`/games/kachuful/rooms/${roomId}`, { params: { player: playerName } }).then(r => r.data);
export const sendKachufulAction    = (roomId, playerName, data) => api.post(`/games/kachuful/rooms/${roomId}/action`, { playerName, ...data }).then(r => r.data);

// ─── Other sports (football, basketball, tennis) ──────────────────────────────
export const fetchSportMatches      = (sport) => api.get(`/sports/${sport}/matches`).then(r => r.data);
export const fetchSportNews         = (sport) => api.get(`/sports/${sport}/news`).then(r => r.data);
