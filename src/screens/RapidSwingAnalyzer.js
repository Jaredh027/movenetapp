import React, { useRef, useEffect, useState } from "react";
import { Button, Grid, TextField } from "@mui/material";
import NavigationPanel from "../Components/NavigationPanel";
import CustomButton from "../Components/CustomButton";
import { ReactComponent as Video } from "../icons/video.svg";

import RecordSwing from "../Components/RecordSwing";
import { normalizeSwingData } from "../datamanipulation/Util";
import { sendSwingData } from "../backendCalls/BackendCalls";

// Custom RecordButton component
const RecordButton = (props) => (
  <CustomButton
    startIcon={<Video />}
    {...props}
    sx={{
      textAlign: "center",
      borderRadius: 2,
      backgroundColor: "#34302D",
      color: "#DC7B19",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
      padding: 2,
      fontWeight: "bold",
    }}
  >
    {props.children}
  </CustomButton>
);

// Custom Container component
const Container = (props) => (
  <Grid
    {...props}
    sx={{
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      color: "#34302D",
      alignItems: "center",
      flexDirection: "column",
      marginRight: "20px",
      marginTop: "20px",
      backgroundColor: "#6699cc",
      padding: "20px",
      borderRadius: 2,
    }}
  >
    {props.children}
  </Grid>
);

const RapidSwingAnalyzer = () => {
  const [countdownStarted, setCountdownStarted] = useState(false);

  const saveSwingHandler = (swingData, swingTitle) => {
    let normalizedSwing = normalizeSwingData(swingData, 15, 100);

    const updatedSwingData = {
      swing_name: swingTitle,
      ...normalizedSwing,
    };

    sendSwingData(updatedSwingData);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <NavigationPanel selectedButtonIndex={3} />
      </Grid>
      <Grid item xs={9}>
        <Container>
          <RecordButton onClick={() => setCountdownStarted(true)}>
            Start Rapid Analysis
          </RecordButton>
          <RecordSwing
            startRecording={countdownStarted}
            saveSwingHandler={saveSwingHandler}
          />
        </Container>
      </Grid>
    </Grid>
  );
};

export default RapidSwingAnalyzer;
