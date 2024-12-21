import React, { useRef, useEffect, useState } from "react";
import { Button, Grid, TextField } from "@mui/material";
import NavigationPanel from "../Components/NavigationPanel";
import { sendSwingData } from "../backendCalls/BackendCalls";
import CameraSwitcher from "../screens/CameraSwitcher";
import { VideoDetector } from "../swingtracking/VideoDetector";
import CustomPopover from "../Components/CustomPopover";
import { normalizeSwingData } from "../datamanipulation/Util";

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

// Timer display for countdown
const TimerText = (props) => (
  <p
    {...props}
    style={{
      color: "white",
      textAlign: "center",
      position: "absolute",
      zIndex: 12,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "120px",
      margin: 0,
    }}
  >
    {props.children}
  </p>
);

const RecordSwingVideo = ({ startRecording, saveSwingHandler }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [countdown, setCountdown] = useState(3);
  const isRecordingRef = useRef(false);
  const recordedFramesRef = useRef([]);
  const [swingData, setSwingData] = React.useState(null);

  // For popover
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [swingTitle, setSwingTitle] = React.useState("");

  // Pose detection and video processing logic
  useEffect(() => {
    VideoDetector(webcamRef, canvasRef, isRecordingRef, recordedFramesRef);
  }, []);

  // Countdown logic for recording
  useEffect(() => {
    if (startRecording && countdown > 0) {
      const intervalId = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(intervalId);
            isRecordingRef.current = true; // Start recording poses
            setCountdown("Start");

            setTimeout(() => {
              isRecordingRef.current = false; // Stop recording
              setCountdown("Stop");

              // Prepare the swing data and send it to the backend
              if (recordedFramesRef.current !== null) {
                setSwingData({
                  frames: recordedFramesRef.current,
                });
                setIsOpen(true);
              }
            }, 2000); // Record for an additional 2 seconds after countdown ends
          }
          return prevCountdown - 1;
        });
      }, 1000); // Decrease countdown every second
      return () => clearInterval(intervalId); // Clean up the interval
    }
  }, [startRecording, countdown]);

  const handleClosePopover = () => {
    setIsOpen(false);
    setAnchorEl(null);
  };

  const handleInputChange = (event) => {
    setSwingTitle(event.target.value);
  };

  return (
    <Grid
      container
      style={{
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "1280px", // Ensuring video and canvas stay within 1280px max
        aspectRatio: "16 / 9", // Maintain 16:9 ratio
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%", // Explicit height to fill the parent
          overflow: "hidden",
        }}
      >
        {/* Pass ref to CameraSwitcher for video stream */}
        <CameraSwitcher
          ref={webcamRef}
          style={{
            transform: "scaleX(-1)", // Mirror video
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover", // Ensure video covers the div
          }}
        />
        {/* Canvas for drawing poses */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 10,
            backgroundColor: "transparent", // Transparent background
          }}
        />
      </div>
      {/* Display the countdown timer during recording */}
      {startRecording && <TimerText>{countdown}</TimerText>}
      {isOpen && (
        <CustomPopover
          anchorEl={canvasRef.current}
          open={isOpen}
          popoverContent={
            <>
              <TextField
                id="outlined-basic"
                label="Swing Title"
                variant="outlined"
                value={swingTitle}
                onChange={handleInputChange}
              />
              <Button
                onClick={() => {
                  handleClosePopover();
                  saveSwingHandler(swingData, swingTitle);
                }}
              >
                Save
              </Button>
            </>
          }
          handleClose={handleClosePopover}
        />
      )}
    </Grid>
  );
};

export default RecordSwingVideo;
