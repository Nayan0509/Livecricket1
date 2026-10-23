import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { retiredArticleTarget } from "../content/retiredArticles";

// /news/:id pages were retired; see content/retiredArticles.js. The server
// answers these URLs with a 301, this covers in-app navigation.
export default function NewsDetail() {
  const { id } = useParams();
  return <Navigate to={retiredArticleTarget(id)} replace />;
}
