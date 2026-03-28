import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSeriesInfo } from "../api";
import MatchCard from "../components/MatchCard";

export default function SeriesDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["seriesInfo", id],
    queryFn: () => fetchSeriesInfo(id),
  });

  // CricketData.org series_info: { data: { info: {id,name,startdate,enddate,odi,t20,test,matches}, matchList: [...] } }
  const series = data?.data;

  if (isLoading) return <div className="container"><div className="spinner" /></div>;
  if (error || !series) return <div className="container"><div className="error-box">Series not found</div></div>;

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: 16, fontSize: 13 }}>← Back</button>
      <h1 className="page-title">{series.info?.name}</h1>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px,1fr))", gap: 16 }}>
          {[
            ["Start", series.info?.startdate],
            ["End", series.info?.enddate],
            ["Tests", series.info?.test],
            ["ODIs", series.info?.odi],
            ["T20s", series.info?.t20],
            ["Total", series.info?.matches + " matches"],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>{k}</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{v || "—"}</div>
            </div>
          ))}
        </div>
      </div>

      {series.matchList?.length > 0 && (
        <>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Matches</h2>
          <div className="grid-2">
            {series.matchList.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </>
      )}
    </div>
  );
}
