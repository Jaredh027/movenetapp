import React from "react";
import { Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Upload } from "../icons/upload.svg";
import { ReactComponent as Check } from "../icons/check-square.svg";
import { ReactComponent as Layers } from "../icons/layers.svg";
import CustomButton from "./CustomButton";

const WelcomeItem = (props) => (
  <Grid
    {...props}
    sx={{
      textAlign: "left",
      display: "block",
      justifyContent: "center",
      color: "#34302D",
    }}
  >
    {props.children}
  </Grid>
);

function NavigationPanel() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        width: "fit-content",
        backgroundColor: "#6699cc",
        marginLeft: "20px",
        padding: 40,
        borderRadius: 4,
        marginTop: 20,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <WelcomeItem item>
        <h2 style={{ marginTop: 0, color: "white" }}>
          Welcome to the Swing Workshop
        </h2>
        <h3 style={{ color: "#bddbe8" }}>Let's get dialed</h3>
        <Grid sx={{ marginTop: 5 }}>
          <CustomButton>Test your swing against the champs</CustomButton>
          <CustomButton startIcon={<Check />}>
            Check your consistency
          </CustomButton>
          <CustomButton
            startIcon={<Upload />}
            onClick={() => navigate("/recordswing")}
          >
            Upload your swing
          </CustomButton>
          <CustomButton
            startIcon={<Layers />}
            onClick={() => navigate("/uploadedswings")}
          >
            Look at Uploaded Swings
          </CustomButton>
          <CustomButton onClick={() => navigate("/switchcamera")}>
            Test out switching cameras
          </CustomButton>
        </Grid>
      </WelcomeItem>
    </div>
  );
}

export default NavigationPanel;
