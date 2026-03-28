import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: "center", paddingTop: 80, paddingBottom: 80 }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🏏</div>
      <h1 style={{ fontSize: 48, fontWeight: 800, color: "var(--green)", marginBottom: 8 }}>404</h1>
      <p style={{ fontSize: 18, color: "var(--text2)", marginBottom: 32 }}>
        Looks like this page got bowled out.
      </p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}
