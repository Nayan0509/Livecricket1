import React from "react";
import { Link } from "react-router-dom";
import { NOT_FOUND } from "../content/pages";

export default function NotFound() {
  return (
    <div className="container" style={{ maxWidth: 720, paddingTop: 48, paddingBottom: 80 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", marginBottom: 10 }}>{NOT_FOUND.h1}</h1>
      <p style={{ fontSize: 16, color: "var(--text2)", lineHeight: 1.7, marginBottom: 24 }}>{NOT_FOUND.text}</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link to="/live" className="btn btn-primary">Live scores</Link>
        <Link to="/schedule" className="btn btn-secondary">Schedule</Link>
        <Link to="/guides" className="btn btn-secondary">Guides</Link>
      </div>
    </div>
  );
}
