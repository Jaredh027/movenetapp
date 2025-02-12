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
import CustomPopover from "../Components/CustomPopover";

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
  const [processedVideo, setProcessedVideo] = useState(false);
  const [swingData, setSwingData] = useState(null);
  const [swingTitle, setSwingTitle] = useState("");
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);

  const { userId } = useUserContext();

  // allow for saving now the video is done being processed by MoveNet
  const videoDoneProcessing = (swingData) => {
    setProcessedVideo(true);
    setSwingData(swingData);
  };

  const saveSwingHandler = (swingData, swingTitle) => {
    console.log("NEW STUFF", swingData);
    setSavingVideo(false);
    setProcessedVideo(false);
    let normalizedSwing = null;
    try {
      normalizedSwing = normalizeSwingData(swingData, 15, 100);
      console.log(normalizedSwing);
      const updatedSwingData = {
        swing_name: swingTitle,
        ...normalizedSwing,
      };

      sendSwingData(updatedSwingData, userId);
    } catch (error) {
      console.log(normalizedSwing);
      setSwingData(null);
      setSwingTitle("");
      setSavingVideo(false);
      setProcessedVideo(false);
      setError(error.message);
      setOpen(true);
    }
  };

  const stopRecording = () => {
    setCountdownStarted(false);
    setSavingVideo(true);
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <NavigationPanel selectedButtonIndex={2} />
        </Grid>
        <Grid item xs={9}>
          <Container>
            {processedVideo ? (
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
                    setProcessedVideo(false);
                  }}
                >
                  Cancel
                </CancelButton>
              </Box>
            ) : (
              <RecordButton onClick={() => setCountdownStarted(true)}>
                {countdownStarted ? "Recording..." : "Start Recording"}
              </RecordButton>
            )}

            <RecordSwingVideo
              startRecording={countdownStarted}
              savingVideo={savingVideo}
              stopRecording={stopRecording}
              proccessedVideo={videoDoneProcessing}
            />
          </Container>
        </Grid>
      </Grid>
      <CustomPopover
        open={open}
        popoverContent={
          <div style={{ justifyItems: "center" }}>
            <p>{error.toString()}</p>
            <CustomButton
              style={{ width: "50%" }}
              onClick={() => setOpen(false)}
            >
              Ok
            </CustomButton>
          </div>
        }
      ></CustomPopover>
    </>
  );
};

export default CollectSwingVideo;
