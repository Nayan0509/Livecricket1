import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchNews } from "../api";

export default function News() {
  const { data, isLoading, error } = useQuery({ queryKey: ["news"], queryFn: fetchNews });

  // Our /api/news returns upcoming matches shaped as news: { data: [{id, title, description, date, venue, matchType, teams, teamInfo}] }
  const items = data?.data || [];

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <h1 className="page-title">📰 Match Updates</h1>
      <p style={{ color: "var(--text2)", marginBottom: 24, fontSize: 14 }}>
        Latest upcoming matches and status updates
      </p>

      {isLoading && <div className="spinner" />}
      {error && <div className="error-box">Failed to load: {error.message}</div>}

      {!isLoading && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: 20 }}>
          {items.map((n, i) => (
            <Link key={n.id || i} to={`/match/${n.id}`} style={{ textDecoration: "none" }}>
              <div className="card" style={{ height: "100%" }}>
                {/* Team logos */}
                {n.teamInfo?.length > 0 && (
                  <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
                    {n.teamInfo.slice(0,2).map((t, ti) => (
                      <React.Fragment key={ti}>
                        {ti === 1 && <span style={{ color: "var(--text3)", fontSize: 12 }}>vs</span>}
                        {t.img && <img src={t.img} alt={t.shortname}
                          style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />}
                      </React.Fragment>
                    ))}
                  </div>
                )}
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, lineHeight: 1.4 }}>{n.title}</div>
                <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 8 }}>{n.description}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {n.matchType && <span className="badge badge-upcoming">{n.matchType.toUpperCase()}</span>}
                  <span style={{ fontSize: 11, color: "var(--text3)" }}>📅 {n.date}</span>
                </div>
                {n.venue && <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6 }}>📍 {n.venue}</div>}
              </div>
            </Link>
          ))}
          {items.length === 0 && (
            <div style={{ gridColumn:"1/-1", textAlign:"center", color:"var(--text2)", padding:40 }}>
              No updates available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
