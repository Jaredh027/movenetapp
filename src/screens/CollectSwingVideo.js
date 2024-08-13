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
  const [countdown, setCountdown] = useState(20);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [webKeypoints, setWebKeypoints] = useState([]);
  const [recordedFrames, setRecordedFrames] = useState([]);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runDetector = async () => {
      await tf.ready();
      await tf.setBackend("webgl");

      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER, // More accurate model
      };
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
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
          if (countdown <= 10 && countdown > 0) {
            setRecordedFrames((prevFrames) => [...prevFrames, poses]);
          }
          if (countdown === 0) {
            console.log(recordedFrames);
          }
        }
        requestAnimationFrame(detectPose);
      };

      detectPose();
    };

    runDetector();
  }, [countdown]);

  const swingCountdown = () => {
    console.log("started");
    setCountdownStarted(true);
    let intervalId = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(intervalId);
          //send to capture webcam frames
        }
        return prevCountdown - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  };

  const extractKeypoints = (poses) => {
    poses.forEach(({ keypoints }) => {
      console.log("keypoints", keypoints);
    });
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
            transform: "scaleX(-1)", // Flip the webcam feed horizontally
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
            transform: "translate(-50%, -50%) scaleX(-1)", // Flip the canvas horizontally
            zIndex: 10,
          }}
        />
        {countdownStarted && <TimerText>{countdown}</TimerText>}
      </Grid>
    </Container>
  );
};

export default CollectSwingVideo;
