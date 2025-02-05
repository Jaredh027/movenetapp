import React, { useRef, useEffect, useState, useContext } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import NavigationPanel from "../Components/NavigationPanel";
import CustomButton from "../Components/CustomButton";
import { ReactComponent as Video } from "../icons/video.svg";
import { ReactComponent as Save } from "../icons/save-svgrepo-com.svg";

import { normalizeSwingData } from "../datamanipulation/Util";
import { sendSwingData } from "../backendCalls/BackendCalls";
import RecordSwingVideo from "../Components/RecordSwingVideo";
import { Container } from "../Components/Container";
import { useUserContext } from "../User_Id_Handling/UserContext";
import TypeField from "../Components/TypeField";

// Custom RecordButton component
const RecordButton = (props) => (
  <CustomButton startIcon={<Video />} {...props}>
    {props.children}
  </CustomButton>
);

const SaveButton = (props) => (
  <CustomButton startIcon={<Save />} {...props}>
    {props.children}
  </CustomButton>
);

const CancelButton = (props) => (
  <CustomButton
    // startIcon={<Save />}
    {...props}
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
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1,
              }}
            >
              <SaveButton
                onClick={() => saveSwingHandler(swingData, swingTitle)}
              >
                {"Save"}
              </SaveButton>

              <TypeField
                value={swingTitle}
                onChange={(event) => setSwingTitle(event.target.value)}
                placeholder="Enter swing name"
              ></TypeField>
              <CancelButton
                onClick={() => {
                  setSwingData(null);
                  setSwingTitle("");
                  setSavingVideo(false);
                }}
              >
                Cancel
              </CancelButton>
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
