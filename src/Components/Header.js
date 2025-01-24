import { ReactComponent as Target } from "../icons/target.svg";
export const Header = () => {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "rgba(0, 204, 0, 0.8)",
        margin: 0,
        padding: "2rem",
        paddingBottom: "4rem",
        textAlign: "center",
      }}
    >
      <div style={{ display: "inline-flex" }}>
        <h2
          style={{
            margin: 0,
            fontWeight: "400",
            marginRight: "5px",
            color: "white",
          }}
        >
          Swing Workshop
        </h2>
        <Target
          style={{
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        />
      </div>
    </div>
  );
};
