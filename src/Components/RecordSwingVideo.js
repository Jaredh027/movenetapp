import React, { useRef, useEffect, useState } from "react";
import { Button, Grid, TextField } from "@mui/material";
import CameraSwitcher from "../screens/CameraSwitcher";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import {
  CaptureVideoMovement,
  preloadMoveNetModel,
} from "../swingtracking/CaptureVideoMovement";
import CustomPopover from "./CustomPopover";

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

const RecordSwingVideo = ({
  startRecording,
  stopRecording,
  savingVideo,
  proccessedVideo,
}) => {
  const webcamRef = useRef(null);
  const playbackVideoRef = useRef(null);
  const recordedFramesRef = useRef([]);
  const ffmpegRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const mediaRecorderRef = useRef(null);

  const [countdown, setCountdown] = useState(3);
  const [processedVideoURL, setProcessedVideoURL] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCapturingDone, setIsCapturingDone] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [swingTitle, setSwingTitle] = React.useState("");
  const [swingData, setSwingData] = useState(null);

  useEffect(() => {
    if (processedVideoURL && playbackVideoRef.current) {
      CaptureVideoMovement(
        playbackVideoRef.current,
        recordedFramesRef,
        handleCaptureComplete
      );
    }
  }, [processedVideoURL]);

  useEffect(() => {
    preloadMoveNetModel();
  }, []);

  useEffect(() => {
    if (recordedFramesRef.current) {
      // console.log("Updated processedVideoURL:", processedVideoURL);
      // const analyzeVideo = async () => {
      //   try {
      //     await CaptureVideoMovement(processedVideoURL, recordedFramesRef);
      //   } catch (error) {
      //     console.error("Error in pose detection:", error);
      //   }
      // };
      // console.log("setting swing data");
      // analyzeVideo();

      console.log(recordedFramesRef.current);
      setSwingData({
        frames: recordedFramesRef.current,
      });
      console.log(swingData);
      stopRecording(swingData);
    }
  }, [recordedFramesRef.current]);

  useEffect(() => {
    if (startRecording) {
      setCountdown(3);
      console.log("unsetting proccessed video url");
      setProcessedVideoURL("");
      console.log(startRecording);
      const intervalId = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(intervalId);
            startRecordingVideo();
            console.log("Starting timer");
            setCountdown("Start");

            setTimeout(() => {
              console.log("Stopping timer");
              setCountdown("Stop");
              stopRecordingVideo();
            }, 2000);
          }
          return prevCountdown - 1;
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [startRecording]);

  const handleCaptureComplete = () => {
    console.log("Capture finished!");
    setIsCapturingDone(true);
  };

  const startRecordingVideo = () => {
    if (webcamRef.current && webcamRef.current.srcObject) {
      console.log("Recording Video");
      const stream = webcamRef.current.srcObject;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
        videoBitsPerSecond: 2500000, // 2.5 Mbps for better quality
      });

      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          setIsProcessing(true);
          const blob = new Blob(recordedChunksRef.current, {
            type: "video/webm",
          });

          const slowURL = URL.createObjectURL(blob);

          // Clean up previous URL if it exists
          if (processedVideoURL) {
            URL.revokeObjectURL(processedVideoURL);
          }
          console.log("setting proccessed video url");
          await setProcessedVideoURL(slowURL);
        } catch (error) {
          console.error("Error processing video:", error);
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
    } else {
      console.error("Webcam stream is not available.");
    }
  };

  const stopRecordingVideo = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      recordedChunksRef.current = [];
      recordedFramesRef.current = [];
      setCountdown(3);
    }
  };

  const handleInputChange = (event) => {
    setSwingTitle(event.target.value);
  };

  const handleClosePopover = () => {
    setIsOpen(false);
    setAnchorEl(null);
  };

  return (
    <Grid
      container
      style={{
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "1280px",
        aspectRatio: "16 / 9",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {processedVideoURL && savingVideo ? (
          <video
            ref={playbackVideoRef}
            src={processedVideoURL}
            autoPlay
            crossOrigin="anonymous"
            style={{
              height: "100%",

              backgroundColor: "black",
              position: "relative",
            }}
            onLoadedData={async () => {
              if (playbackVideoRef.current) {
                try {
                  // REMOVE the CaptureVideoMovement call here
                  // It is no longer necessary because we handle it in the useEffect
                  console.log("VIDEO PROCESSED");
                  proccessedVideo(true);
                } catch (error) {
                  console.error("Error capturing video movement:", error);
                }
              }
            }}
            onClick={(e) => e.stopPropagation()}
            onError={(e) => console.error("Video playback error:", e)}
          />
        ) : (
          <CameraSwitcher
            ref={webcamRef}
            style={{
              transform: "scaleX(-1)",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
      </div>
      {startRecording && <TimerText>{countdown}</TimerText>}
      {isProcessing && <TimerText>Processing...</TimerText>}

      {/* {isOpen && (
        // <CustomPopover
        //   anchorEl={webcamRef.current}
        //   open={isOpen}
        //   popoverContent={
        //     <>
        //       <TextField
        //         id="outlined-basic"
        //         label="Swing Title"
        //         variant="outlined"
        //         value={swingTitle}
        //         onChange={handleInputChange}
        //       />
        //       <Button
        //         onClick={() => {
        //           let swingData = {
        //             frames: recordedFramesRef.current,
        //           };
        //           saveSwingHandler(swingData, swingTitle);
        //           handleClosePopover();
        //         }}
        //       >
        //         Save
        //       </Button>
        //     </>
        //   }
        //   handleClose={handleClosePopover}
        // />
      )} */}
    </Grid>
  );
};

export default RecordSwingVideo;
