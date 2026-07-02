import React from "react";
import { Link } from "react-router-dom";

/**
 * Catches any render/runtime error in the page tree and shows a friendly
 * fallback instead of a blank white screen. Reset key (usually the route
 * pathname) clears the error when the user navigates elsewhere.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Surface in console for debugging; avoids a silent blank screen.
    console.error("Page render error:", error, info?.componentStack);
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          maxWidth: 560,
          margin: "0 auto",
          padding: "72px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 44, marginBottom: 16 }}>🏏</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 10 }}>
          Something went wrong on this page
        </h1>
        <p style={{ fontSize: 14, color: "var(--text3)", lineHeight: 1.7, marginBottom: 28 }}>
          We hit an unexpected error while loading this content. It's not your
          connection — try again, or head back to the live scores.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Reload page
          </button>
          <Link to="/" className="btn btn-ghost">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }
}
