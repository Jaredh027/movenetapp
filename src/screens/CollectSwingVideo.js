import React, { useRef, useEffect, useState, useContext } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
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
  const [savingVideo, setSavingVideo] = useState(false);
  const [swingData, setSwingData] = useState(null);
  const [swingTitle, setSwingTitle] = useState("");

  const { userId } = useUserContext();

  const saveSwingHandler = (swingData, swingTitle) => {
    setSavingVideo(false);
    let normalizedSwing = normalizeSwingData(swingData, 15, 100);

    const updatedSwingData = {
      swing_name: swingTitle,
      ...normalizedSwing,
    };

    sendSwingData(updatedSwingData, userId);
  };

  const stopRecording = (swingData) => {
    setCountdownStarted(false);
    setSavingVideo(true);
    setSwingData(swingData);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <NavigationPanel selectedButtonIndex={2} />
      </Grid>
      <Grid item xs={9}>
        <Container>
          {savingVideo ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
              }}
            >
              <RecordButton
                onClick={() => {
                  console.log(swingData);
                  saveSwingHandler(swingData, swingTitle);
                }}
              >
                {"Save As"}
              </RecordButton>
              <TextField
                value={swingTitle}
                onChange={(event) => setSwingTitle(event.target.value)}
                placeholder="Swing name"
              ></TextField>
            </Box>
          ) : (
            <RecordButton onClick={() => setCountdownStarted(true)}>
              {savingVideo
                ? "Save As"
                : countdownStarted
                ? "Recording..."
                : "Start Recording"}
            </RecordButton>
          )}

          <RecordSwingVideo
            startRecording={countdownStarted}
            savingVideo={savingVideo}
            stopRecording={stopRecording}
          />
        </Container>
      </Grid>
    </Grid>
  );
};

export default CollectSwingVideo;
