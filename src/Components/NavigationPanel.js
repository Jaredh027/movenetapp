import { Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Upload } from "../icons/upload.svg";
import { ReactComponent as Check } from "../icons/check-square.svg";
import { ReactComponent as Layers } from "../icons/layers.svg";
import CustomButton from "./CustomButton";

const NavigationPanel = ({ selectedButtonIndex }) => {
  const navigate = useNavigate();

  const routes = [
    { label: "Test your swing against the champs" },
    { label: "Compare your swings", icon: <Check />, nav: "/consistency" },
    { label: "Upload your swing", icon: <Upload />, nav: "/recordswing" },
    { label: "Rapid Swing Analysis", nav: "/rapidswinganalysis" },
    {
      label: "Look at Uploaded Swings",
      icon: <Layers />,
      nav: "/uploadedswings",
    },
    { label: "Evaluate Your Swing", nav: "/swingevaluation" },
  ];

  const containerStyles = {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    width: "100%",
    marginTop: "1rem",
  };

  const getButtonStyles = (isSelected) => ({
    width: "100%",
    padding: "0.875rem 1.25rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    borderRadius: "12px",
    border: isSelected ? "none" : "1px solid rgba(255, 255, 255, 0.2)",
    backgroundColor: isSelected ? "#10b981" : "transparent",
    color: isSelected ? "white" : "#d1d5db",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    textTransform: "none",
    outline: "none",
  });

  return (
    <div style={containerStyles}>
      {routes.map(({ label, icon, nav }, i) => (
        <button
          key={label}
          style={getButtonStyles(i === selectedButtonIndex)}
          onClick={() => nav && navigate(nav)}
          onMouseEnter={(e) => {
            if (i !== selectedButtonIndex) {
              e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
              e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
            }
          }}
          onMouseLeave={(e) => {
            if (i !== selectedButtonIndex) {
              e.target.style.backgroundColor = "transparent";
              e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
            }
          }}
        >
          {icon && (
            <span style={{ fontSize: "1rem", opacity: 0.8 }}>{icon}</span>
          )}
          {label}
        </button>
      ))}
    </div>
  );
};

export default NavigationPanel;
