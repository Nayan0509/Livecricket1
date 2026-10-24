import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

const rootEl = document.getElementById("root");

// api/render.js puts the page's written content in the first HTML. Keep it as
// the loading state for that first route (RouteFallback in App.jsx) so the
// text stays on screen while the route's code downloads.
const ssrMain = rootEl.querySelector("[data-ssr-main]");
window.__SSR_PAGE__ = ssrMain ? { path: window.location.pathname, html: ssrMain.innerHTML } : null;

ReactDOM.createRoot(rootEl).render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </HelmetProvider>
);
