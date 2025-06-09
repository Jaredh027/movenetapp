const CancelButton = ({ onClick, children }) => {
  const buttonStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.875rem 1.5rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    borderRadius: "10px",
    border: "2px solid #e5e7eb",
    background: "white",
    color: "#6b7280",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
  };

  return (
    <button
      style={buttonStyles}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.target.style.borderColor = "#dc2626";
        e.target.style.color = "#dc2626";
        e.target.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.target.style.borderColor = "#e5e7eb";
        e.target.style.color = "#6b7280";
        e.target.style.transform = "translateY(0)";
      }}
    >
      {children}
    </button>
  );
};

export default CancelButton;
