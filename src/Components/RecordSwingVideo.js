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
  const recordedChunksRef = useRef([]);
  const mediaRecorderRef = useRef(null);

  const [countdown, setCountdown] = useState(3);
  const [processedVideoURL, setProcessedVideoURL] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCapturingDone, setIsCapturingDone] = useState(false);
  const [swingData, setSwingData] = useState(null);

  // Making sure the MoveNet model is ready
  useEffect(() => {
    preloadMoveNetModel();
  }, []);

  // When the frames start to be captured we know to stop recording
  useEffect(() => {
    if (recordedFramesRef.current) {
      stopRecording();
    }
  }, [recordedFramesRef.current]);

  // When the playback video is playing start detection
  useEffect(() => {
    if (processedVideoURL && playbackVideoRef.current) {
      CaptureVideoMovement(
        playbackVideoRef.current,
        recordedFramesRef,
        handleCaptureComplete
      );
    }
  }, [processedVideoURL]);

  // Once swing data is set tell the screen it is done processing
  useEffect(() => {
    if (swingData) {
      console.log(swingData);
      proccessedVideo(swingData);
    }
  }, [swingData]);

  // Starting the timer
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

  // When the CaptureVideoMovement is done proccessing the video set swing data
  const handleCaptureComplete = () => {
    console.log("Capture finished!");
    if (recordedFramesRef.current) {
      console.log(recordedFramesRef.current);
      setSwingData({
        frames: recordedFramesRef.current,
      });
    } else {
      console.log(recordedFramesRef.current);
    }
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
    </Grid>
  );
};

export default RecordSwingVideo;
