import React, { useRef, useEffect, useState } from "react";
import { Button, Grid, TextField } from "@mui/material";
import CameraSwitcher from "../screens/CameraSwitcher";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { CaptureVideoMovement } from "../swingtracking/CaptureVideoMovement";
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

const RecordSwingVideo = ({ startRecording, saveSwingHandler }) => {
  const webcamRef = useRef(null);
  const [countdown, setCountdown] = useState(3);
  const recordedChunksRef = useRef([]);
  const mediaRecorderRef = useRef(null);
  const [processedVideoURL, setProcessedVideoURL] = useState("");
  const ffmpegRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const recordedFramesRef = useRef([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [swingTitle, setSwingTitle] = React.useState("");
  const [swingData, setSwingData] = useState(null);

  // Pose detection and video processing logic
  useEffect(() => {
    console.log("Processed video URL:", processedVideoURL); // Debugging
    const analyzeVideo = async () => {
      try {
        await CaptureVideoMovement(processedVideoURL, recordedFramesRef);
      } catch (error) {
        console.error("Error in pose detection:", error);
      }
    };

    if (processedVideoURL) {
      analyzeVideo();
      setSwingData({
        frames: recordedFramesRef.current,
      });
      setIsOpen(true);
    }
  }, [processedVideoURL]);

  // Initialize FFmpeg
  useEffect(() => {
    const loadFFmpeg = async () => {
      try {
        const ffmpeg = new FFmpeg();
        ffmpegRef.current = ffmpeg;

        ffmpeg.on("log", ({ message }) => {
          if (message.includes("error")) {
            console.error(message);
          }
          // Optionally, filter out progress logs
        });

        await ffmpeg.load();
        console.log("FFmpeg loaded successfully");
      } catch (error) {
        console.error("Failed to load FFmpeg:", error);
      }
    };

    loadFFmpeg();

    // Cleanup
    return () => {
      if (ffmpegRef.current) {
        ffmpegRef.current.terminate();
      }
    };
  }, []);

  useEffect(() => {
    if (startRecording && countdown > 0) {
      const intervalId = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(intervalId);
            startRecordingVideo();
            setCountdown("Start");

            setTimeout(() => {
              setCountdown("Stop");
              stopRecordingVideo();
            }, 2000);
          }
          return prevCountdown - 1;
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [startRecording, countdown]);

  const startRecordingVideo = () => {
    if (webcamRef.current && webcamRef.current.srcObject) {
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

          const slowBlob = await slowDownVideo(blob);
          const slowURL = URL.createObjectURL(slowBlob);

          // Clean up previous URL if it exists
          if (processedVideoURL) {
            URL.revokeObjectURL(processedVideoURL);
          }

          setProcessedVideoURL(slowURL);

          //   Trigger download
          //   const a = document.createElement("a");
          //   a.href = slowURL;
          //   a.download = "recorded-video.webm";
          //   a.click();
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
    }
  };

  const slowDownVideo = async (inputBlob) => {
    if (!ffmpegRef.current?.loaded) {
      console.error("FFmpeg not loaded");
      return inputBlob;
    }

    const ffmpeg = ffmpegRef.current;

    try {
      // Convert blob to Uint8Array
      const data = await inputBlob.arrayBuffer();
      const inputData = new Uint8Array(data);

      // Write the file
      await ffmpeg.writeFile("input.webm", inputData);

      // Execute FFmpeg command with optimized parameters
      await ffmpeg.exec([
        "-i",
        "input.webm",
        "-vf",
        "setpts=2.0*PTS",
        "-c:v",
        "libvpx",
        "-b:v",
        "2500K", // Higher bitrate
        "-maxrate",
        "3000K",
        "-bufsize",
        "6000K",
        "-deadline",
        "good", // Balance between quality and speed
        "-cpu-used",
        "2", // Faster processing
        "-auto-alt-ref",
        "0",
        "-qmin",
        "4",
        "-qmax",
        "48",
        "output.webm",
      ]);

      // Read the output
      const outputData = await ffmpeg.readFile("output.webm");

      // Clean up
      await ffmpeg.deleteFile("input.webm");
      await ffmpeg.deleteFile("output.webm");

      return new Blob([outputData], { type: "video/webm" });
    } catch (error) {
      console.error("Error processing video:", error);
      if (error.message) console.error("Error message:", error.message);
      return inputBlob;
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
        {processedVideoURL ? (
          <video
            src={processedVideoURL}
            controls
            autoPlay
            crossOrigin="anonymous"
            style={{
              width: "100%",
              marginTop: "20px",
              backgroundColor: "black",
            }}
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

      {isOpen && (
        <CustomPopover
          anchorEl={webcamRef.current}
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
                  let swingData = {
                    frames: recordedFramesRef.current,
                  };
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
