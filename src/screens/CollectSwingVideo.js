import React, { useRef, useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import Webcam from "react-webcam";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import { drawCanvasFromLiveVideo } from "../swingtracking/Utils";

const RecordButton = (props) => (
  <Button
    {...props}
    sx={{
      textAlign: "center",
      borderRadius: 2,
      backgroundColor: "#34302D",
      color: "#DC7B19",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
      marginBottom: 2,
      padding: 2,
      fontWeight: "bold",
    }}
  >
    {props.children}
  </Button>
);

const Container = (props) => (
  <Grid
    {...props}
    sx={{
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      color: "#34302D",
      alignItems: "center",
      height: "100vh",
      flexDirection: "column",
    }}
  >
    {props.children}
  </Grid>
);

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

const CollectSwingVideo = () => {
  const [countdown, setCountdown] = useState(10);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const isRecordingRef = useRef(false); // Use ref instead of state for recording flag
  const recordedFramesRef = useRef([]);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runDetector = async () => {
      await tf.ready();
      await tf.setBackend("webgl");

      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
        }
      );

      const detectPose = async () => {
        if (webcamRef.current && webcamRef.current.video.readyState === 4) {
          const video = webcamRef.current.video;
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;

          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;

          const poses = await detector.estimatePoses(video);

          drawCanvasFromLiveVideo(
            poses,
            video,
            videoWidth,
            videoHeight,
            canvasRef
          );

          if (isRecordingRef.current) {
            console.log("OMG ITS RECORDING");
            recordedFramesRef.current.push([poses[0].keypoints]);
          }
        }
        requestAnimationFrame(detectPose);
      };

      detectPose();
    };

    runDetector();
  }, []);

  useEffect(() => {
    if (countdownStarted && countdown > 0) {
      const intervalId = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(intervalId);
            isRecordingRef.current = true;
            setCountdown("Start");

            setTimeout(() => {
              isRecordingRef.current = false;
              setCountdown("Stop");
              console.log("Recorded Frames:", recordedFramesRef.current);
            }, 2000);
          }
          return prevCountdown - 1;
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [countdownStarted, countdown]);

  const swingCountdown = () => {
    console.log("started");
    setCountdownStarted(true);
  };

  return (
    <Container>
      <RecordButton onClick={swingCountdown}>Start Recording</RecordButton>
      <Grid
        container
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          style={{
            transform: "scaleX(-1)",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 5,
            width: 1280,
            height: 720,
          }}
          videoConstraints={{ width: 1280, height: 720 }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scaleX(-1)",
            zIndex: 10,
          }}
        />
        {countdownStarted && <TimerText>{countdown}</TimerText>}
      </Grid>
    </Container>
  );
};

export default CollectSwingVideo;
