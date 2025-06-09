import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../User_Id_Handling/UserContext";
import { fetchUserData, getAllSwings } from "../backendCalls/BackendCalls";
import ProfileView from "../Components/ProfileView";

const InfoSection = ({ heading, text }) => {
  const sectionStyles = {
    marginBottom: "2rem",
  };

  const headingStyles = {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#10b981",
    marginBottom: "0.5rem",
    letterSpacing: "0.025em",
  };

  const textStyles = {
    fontSize: "0.95rem",
    color: "#6b7280",
    lineHeight: "1.6",
    fontWeight: "400",
  };

  return (
    <div style={sectionStyles}>
      <h3 style={headingStyles}>{heading}</h3>
      <p style={textStyles}>{text}</p>
    </div>
  );
};

export default function Home() {
  const { userId } = useUserContext();
  const [userInfo, setUserInfo] = useState(null);
  const [swingCount, setSwingCount] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUserData(userId).then(setUserInfo);
      getAllSwings(userId).then(setSwingCount);
    }
  }, [userId]);

  if (!userId) return <Navigate to="/login" />;

  const containerStyles = {
    minHeight: "100vh",
    padding: "2rem 1.5rem",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  };

  const gridStyles = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    maxWidth: "1400px",
    width: "100%",
  };

  const dashboardCardStyles = {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "2.5rem",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
  };

  const titleStyles = {
    fontSize: "2.25rem",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "2rem",
    letterSpacing: "-0.025em",
  };

  const imageStyles = {
    alignSelf: "center",
    maxWidth: "320px",
    width: "100%",
    marginTop: "auto",
    paddingTop: "2rem",
    opacity: "0.9",
  };

  const decorativeElementStyles = {
    position: "absolute",
    top: "-50px",
    right: "-50px",
    width: "200px",
    height: "200px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    borderRadius: "50%",
    opacity: "0.03",
    pointerEvents: "none",
  };

  return (
    <div style={containerStyles}>
      <div style={gridStyles}>
        {/* Profile Section */}
        <div style={{ gridColumn: window.innerWidth > 768 ? "1" : "span 1" }}>
          <ProfileView userInfo={userInfo} swingCount={swingCount} />
        </div>

        {/* Dashboard Section */}
        <div
          style={{ gridColumn: window.innerWidth > 768 ? "2 / -1" : "span 1" }}
        >
          <div style={dashboardCardStyles}>
            <div style={decorativeElementStyles}></div>

            <h1 style={titleStyles}>Dashboard</h1>

            <InfoSection
              heading="Pin‑point Swing Flaws"
              text="Discover precisely where your mechanics deviate and get actionable insights to tighten your form."
            />
            <InfoSection
              heading="Compare with the Pros"
              text="Place your swing alongside PGA champions and instantly spot critical differences."
            />
            <InfoSection
              heading="Deep‑Dive Metrics"
              text="Track swing plane, head stability, hip rotation, tempo and more – all in one glance."
            />

            {/* <img
              src="/golf_image.png"
              alt="Golfer silhouette"
              style={imageStyles}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
