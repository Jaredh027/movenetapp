import { ReactComponent as Target } from "../icons/target.svg";
export const Header = () => {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "transparent",
        margin: 0,
        padding: 15,
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
