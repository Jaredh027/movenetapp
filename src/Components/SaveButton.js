import { ReactComponent as Save } from "../icons/save-svgrepo-com.svg";

const SaveButton = ({ onClick, children, disabled }) => {
  const buttonStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.875rem 1.5rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    borderRadius: "10px",
    border: "none",
    background: disabled
      ? "#9ca3af"
      : "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    outline: "none",
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
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.transform = "translateY(0)";
        }
      }}
    >
      <Save style={{ width: "16px", height: "16px" }} />
      {children}
    </button>
  );
};

export default SaveButton;
