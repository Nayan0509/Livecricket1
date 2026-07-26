import React from "react";
import { Navigate } from "react-router-dom";

// Retired betting guide page - redirected to fantasy strategy for AdSense compliance
export default function BettingGuide() {
  return <Navigate to="/fantasy" replace />;
}
