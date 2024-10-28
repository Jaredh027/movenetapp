import React, { useRef, useEffect, useState } from "react";
import Slider from "@mui/material/Slider";

function FindFramesHelper({ keypointsData, swingArray }) {
  const canvasRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const videoWidth = 1280;
    const videoHeight = 720;
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    const keypointConnections = {
      0: [1, 2], // Nose to eyes
      1: [3], // Left eye to left ear
      2: [4], // Right eye to right ear
      5: [6, 7, 11], // Left shoulder to right shoulder, left elbow, left hip
      6: [8, 12], // Right shoulder to right elbow, right hip
      7: [9], // Left elbow to left wrist
      8: [10], // Right elbow to right wrist
      11: [12, 13], // Left hip to right hip, left knee
      12: [14], // Right hip to right knee
      13: [15], // Left knee to left ankle
      14: [16], // Right knee to right ankle
    };

    const drawKeypoints = (keypoints, color) => {
      keypoints.forEach((keypointsArray) => {
        keypointsArray.forEach(({ x, y, score }, index) => {
          if (score > 0.3) {
            const scaledX = (x / 800) * videoWidth + videoWidth / 2;
            const scaledY = videoHeight - (y / 450) * videoHeight;

            // Adjust keypoint size and color based on index
            ctx.beginPath();
            ctx.arc(scaledX, scaledY, 4, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();

            if (keypointConnections[index]) {
              keypointConnections[index].forEach((j) => {
                const kp2 = keypointsArray[j];
                if (kp2 && kp2.score > 0.3) {
                  const scaledX2 = (kp2.x / 800) * videoWidth + videoWidth / 2;
                  const scaledY2 = videoHeight - (kp2.y / 450) * videoHeight;
                  ctx.beginPath();
                  ctx.moveTo(scaledX, scaledY);
                  ctx.lineTo(scaledX2, scaledY2);
                  ctx.strokeStyle = "darkgray"; // Color for connections
                  ctx.lineWidth = 2;
                  ctx.stroke();
                }
              });
            }
          }
        });
      });
    };

    // Clear canvas before each draw
    ctx.clearRect(0, 0, videoWidth, videoHeight);

    // Draw the keypoints for the first swing (keypointsData)
    const frameKeypoints1 = keypointsData[currentFrame];
    if (frameKeypoints1) {
      drawKeypoints(frameKeypoints1, "red"); // Use a distinct color for the first swing
    }

    // Draw the keypoints for the second swing (swingArray)
    if (swingArray) {
      console.log("swingArray[1]", swingArray[1]);
      const frameKeypoints2 = swingArray[currentFrame];
      if (frameKeypoints2) {
        drawKeypoints(frameKeypoints2, "blue"); // Use a different color for the second swing
      } else {
        console.log(
          "FrameKeypoints2 is undefined for currentFrame:",
          currentFrame
        );
      }
    } else {
      console.log("swingArray[1] is undefined");
    }

    // Handle keyboard events for navigating frames
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

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keypointsData, swingArray, currentFrame]);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    setCurrentFrame(newValue);
  };

  return (
    <div>
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
    </div>
  );
}

export default FindFramesHelper;
