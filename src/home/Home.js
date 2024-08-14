import React, { useRef, useEffect, useState } from "react";
import WebcamRender from "../webcamfeed/WebcamRender";
import { Grid, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const WelcomeItem = (props) => (
  <Grid
    {...props}
    sx={{
      textAlign: "center",
      display: "block",
      justifyContent: "center",
      color: "#34302D",
    }}
  >
    {props.children}
  </Grid>
);

const WelcomeButton = (props) => (
  <Button
    {...props}
    sx={{
      textAlign: "center",
      borderRadius: 2,
      backgroundColor: "#34302D",
      color: "#DC7B19",
      //textTransform: "none",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
      marginBottom: 5,
      padding: 2,
      fontWeight: "bold",
    }}
  >
    {props.children}
  </Button>
);

function Home() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        width: "fit-content",
        backgroundColor: "white",
        marginLeft: "auto",
        marginRight: "auto",
        padding: 40,
        borderRadius: 2,
        marginTop: 20,
      }}
    >
      <WelcomeItem item>
        <h1 style={{ marginTop: 0 }}>Welcome to the Swing Workshop</h1>
        <h3>Let's get dialed</h3>
        <Grid sx={{ marginTop: 5 }}>
          <WelcomeButton>Test your swing against the champs</WelcomeButton>
          <WelcomeButton>Check your consistency</WelcomeButton>
          <WelcomeButton onClick={() => navigate("/recordswing")}>
            Upload your swing
          </WelcomeButton>
          <WelcomeButton onClick={() => navigate("/uploadedswings")}>
            Look at Uploaded Swings
          </WelcomeButton>
        </Grid>
      </WelcomeItem>
    </div>
  );
}

export default Home;
