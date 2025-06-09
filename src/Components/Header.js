import { ReactComponent as Target } from "../icons/target.svg";

export const Header = () => {
  const headerStyles = {
    position: "relative",
    background: "linear-gradient(90deg, #059669 0%, #16a34a 50%, #0d9488 100%)",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
  };

  const backgroundOverlayStyles = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    opacity: 0.4,
  };

  const containerStyles = {
    position: "relative",
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "2rem 1.5rem",
  };

  const centerFlexStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const groupStyles = {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  };

  const iconContainerStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(4px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  const iconStyles = {
    width: "1.25rem",
    height: "1.25rem",
    color: "white",
    filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
  };

  const titleStyles = {
    fontSize: "1.875rem",
    fontWeight: "300",
    color: "white",
    letterSpacing: "0.025em",
    margin: 0,
  };

  const taglineStyles = {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "0.875rem",
    fontWeight: "300",
    marginTop: "0.5rem",
    letterSpacing: "0.025em",
  };

  const accentLineStyles = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "2px",
    background:
      "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
  };

  return (
    <header style={headerStyles}>
      {/* Background pattern overlay */}
      <div style={backgroundOverlayStyles}></div>

      <div style={containerStyles}>
        <div style={centerFlexStyles}>
          <div style={groupStyles}>
            {/* Icon container */}
            <div
              style={iconContainerStyles}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
              }}
            >
              <Target style={iconStyles} />
            </div>

            {/* Title */}
            <h1 style={titleStyles}>
              <span style={{ fontWeight: "500" }}>Swing</span>{" "}
              <span style={{ fontWeight: "200" }}>Workshop</span>
            </h1>
          </div>
        </div>

        {/* Tagline */}
        <p style={taglineStyles}>Professional Golf Analysis</p>
      </div>

      {/* Bottom accent line */}
      <div style={accentLineStyles}></div>
    </header>
  );
};
