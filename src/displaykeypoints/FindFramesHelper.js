import React, { useRef, useEffect, useState } from "react";
import Slider from "@mui/material/Slider";

function FindFramesHelper({ keypointsData }) {
  const canvasRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [value, setValue] = useState(0); // Set initial state to 0 for controlled behavior

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const videoWidth = 1280;
    const videoHeight = 720;
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    const drawKeypoints = (frameIndex) => {
      ctx.clearRect(0, 0, videoWidth, videoHeight);

      const keypointConnections = {
        0: [1, 2],
        1: [3],
        2: [4],
        5: [6, 7, 11],
        6: [8, 12],
        7: [9],
        8: [10],
        11: [12, 13],
        12: [14],
        13: [15],
        14: [16],
      };

      const frameKeypoints = keypointsData[frameIndex];

      frameKeypoints.forEach((keypoints) => {
        keypoints.forEach(({ x, y, score }, index) => {
          if (score > 0.3) {
            const scaledX = (x / 800) * videoWidth + videoWidth / 2;
            const scaledY = videoHeight - (y / 450) * videoHeight;

            ctx.beginPath();
            ctx.arc(scaledX, scaledY, 4, 0, 2 * Math.PI);
            ctx.fillStyle = index < 5 ? "red" : index < 13 ? "blue" : "green";
            ctx.fill();

            if (keypointConnections[index]) {
              keypointConnections[index].forEach((j) => {
                const kp2 = keypoints[j];
                if (kp2 && kp2.score > 0.3) {
                  const scaledX2 = (kp2.x / 800) * videoWidth + videoWidth / 2;
                  const scaledY2 = videoHeight - (kp2.y / 450) * videoHeight;
                  ctx.beginPath();
                  ctx.moveTo(scaledX, scaledY);
                  ctx.lineTo(scaledX2, scaledY2);
                  ctx.strokeStyle = "darkgray";
                  ctx.lineWidth = 2;
                  ctx.stroke();
                }
              });
            }
          }
        });
      });
    };

    if (keypointsData.length > 0) {
      drawKeypoints(currentFrame);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keypointsData, currentFrame]);

  const handleKeyDown = (event) => {
    const frameCount = keypointsData.length;
    if (event.key === "ArrowRight") {
      setCurrentFrame((prevFrame) => (prevFrame + 1) % frameCount);
      setValue((prevValue) => (prevValue + 1) % frameCount);
    } else if (event.key === "ArrowLeft") {
      setCurrentFrame((prevFrame) =>
        prevFrame === 0 ? frameCount - 1 : prevFrame - 1
      );
      setValue((prevValue) =>
        prevValue === 0 ? frameCount - 1 : prevValue - 1
      );
    }
  };

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    setCurrentFrame(newValue);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          maxWidth: "640px",
          display: "block",
          margin: "0 auto",
          border: "1px solid black",
          backgroundColor: "lightblue",
        }}
      />
      <Slider
        value={value}
        onChange={handleSliderChange}
        max={keypointsData.length - 1}
        style={{ marginTop: "20px", width: "80%", margin: "auto" }}
      />
    </>
  );
}

export default FindFramesHelper;
