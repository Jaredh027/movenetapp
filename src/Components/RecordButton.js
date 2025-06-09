import { ReactComponent as Video } from "../icons/video.svg";

const RecordButton = ({ onClick, children, disabled }) => {
  const buttonStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    padding: "1rem 2rem",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "12px",
    border: "none",
    background: disabled
      ? "linear-gradient(135deg, #9ca3af, #6b7280)"
      : "linear-gradient(135deg, #dc2626, #b91c1c)",
    color: "white",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    outline: "none",
    width: "100%",
    maxWidth: "300px",
    opacity: disabled ? 0.7 : 1,
  };

  return (
    <button
      style={buttonStyles}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.transform = "translateY(-1px)";
          e.target.style.boxShadow =
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow =
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
        }
      }}
    >
      <Video style={{ width: "20px", height: "20px" }} />
      {children}
    </button>
  );
};

export default RecordButton;
