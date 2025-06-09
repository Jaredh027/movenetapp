import {
  Avatar,
  Paper,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import NavigationPanel from "./NavigationPanel";

const ProfileView = ({ userInfo, swingCount }) => {
  const cardStyles = {
    backgroundColor: "#1f2937",
    color: "#f9fafb",
    borderRadius: "16px",
    padding: "2.5rem",
    textAlign: "center",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    position: "relative",
    overflow: "hidden",
  };

  const loadingStyles = {
    ...cardStyles,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "200px",
  };

  const stackStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
  };

  const avatarStyles = {
    width: "96px",
    height: "96px",
    backgroundColor: "#10b981",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.5rem",
    fontWeight: "600",
    color: "white",
    border: "4px solid rgba(16, 185, 129, 0.2)",
    boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.1)",
  };

  const nameStyles = {
    fontSize: "1.5rem",
    fontWeight: "600",
    margin: 0,
    color: "#f9fafb",
  };

  const statsStyles = {
    fontSize: "0.875rem",
    color: "#9ca3af",
    margin: 0,
  };

  const shimmerStyles = {
    width: "28px",
    height: "28px",
    border: "3px solid rgba(16, 185, 129, 0.3)",
    borderTop: "3px solid #10b981",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  if (!userInfo) {
    return (
      <div style={loadingStyles}>
        <div style={shimmerStyles}></div>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  const firstName = userInfo.name.split(" ")[0];

  return (
    <div style={cardStyles}>
      <div style={stackStyles}>
        <div style={avatarStyles}>{userInfo.name[0]}</div>
        <h2 style={nameStyles}>Hello {firstName},</h2>
        <p style={statsStyles}>Uploaded Swings • {swingCount?.length ?? 0}</p>
        <NavigationPanel />
      </div>
    </div>
  );
};

export default ProfileView;
