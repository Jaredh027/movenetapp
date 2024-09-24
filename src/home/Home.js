import React from "react";
import { Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Upload } from "../icons/upload.svg";
import { ReactComponent as Check } from "../icons/check-square.svg";
import { ReactComponent as Layers } from "../icons/layers.svg";
import { ReactComponent as Search } from "../icons/search.svg";
import { ReactComponent as Target } from "../icons/target.svg";
import NavigationPanel from "../Components/NavigationPanel";

function Home() {
  const navigate = useNavigate();
  return (
    <>
      {/* Header */}
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          margin: 0,
          padding: 15,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
        }}
      >
        <div style={{ display: "inline-flex" }}>
          <h2 style={{ margin: 0, fontWeight: "400", marginRight: "5px" }}>
            Swing Workshop
          </h2>
          <Target
            style={{
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </div>
      </div>
      {/* Main Div */}
      <NavigationPanel />
    </>
  );
}

export default Home;
