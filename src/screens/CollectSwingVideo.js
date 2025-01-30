import React, { useRef, useEffect, useState, useContext } from "react";
import { Button, Grid, TextField } from "@mui/material";
import NavigationPanel from "../Components/NavigationPanel";
import CustomButton from "../Components/CustomButton";
import { ReactComponent as Video } from "../icons/video.svg";

import { normalizeSwingData } from "../datamanipulation/Util";
import { sendSwingData } from "../backendCalls/BackendCalls";
import RecordSwingVideo from "../Components/RecordSwingVideo";
import { Container } from "../Components/Container";
import { useUserContext } from "../User_Id_Handling/UserContext";

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

const CollectSwingVideo = () => {
  const [countdownStarted, setCountdownStarted] = useState(false);
  const { userId } = useUserContext();
  console.log("userId from context:", userId);

  const saveSwingHandler = (swingData, swingTitle) => {
    let normalizedSwing = normalizeSwingData(swingData, 15, 100);

    const updatedSwingData = {
      swing_name: swingTitle,
      ...normalizedSwing,
    };

    sendSwingData(updatedSwingData, userId);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <NavigationPanel selectedButtonIndex={2} />
      </Grid>
      <Grid item xs={9}>
        <Container>
          <RecordButton onClick={() => setCountdownStarted(true)}>
            Start Recording
          </RecordButton>
          <RecordSwingVideo
            startRecording={countdownStarted}
            saveSwingHandler={saveSwingHandler}
          />
        </Container>
      </Grid>
    </Grid>
  );
};

export default CollectSwingVideo;
