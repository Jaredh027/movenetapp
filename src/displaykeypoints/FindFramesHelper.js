import React, { useRef, useEffect, useState } from "react";
import Slider from "@mui/material/Slider";

function FindFramesHelper({
  keypointsData,
  keypointsData2,
  showHeadData,
  showPathData,
}) {
  const canvasRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [value, setValue] = useState(0);
  const [headPath, setHeadPath] = useState([]);
  const [pathPath, setPathPath] = useState([]);

  // This is for tracking when a new swing is chosen so we can reset the headPath
  useEffect(() => {
    setHeadPath([]);
  }, [keypointsData]);

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

    const drawHeadPath = () => {
      if (headPath.length > 1) {
        ctx.beginPath();
        ctx.moveTo(headPath[0].scaledX, headPath[0].scaledY);
        for (let i = 1; i < headPath.length; i++) {
          ctx.lineTo(headPath[i].scaledX, headPath[i].scaledY);
        }
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    };

    const drawPathPath = () => {
      if (pathPath.length > 1) {
        ctx.beginPath();
        ctx.moveTo(pathPath[0].scaledX, pathPath[0].scaledY);
        for (let i = 1; i < pathPath.length; i++) {
          ctx.lineTo(pathPath[i].scaledX, pathPath[i].scaledY);
        }
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    };

    // Clear canvas before each draw
    ctx.clearRect(0, 0, videoWidth, videoHeight);

    const frameKeypoints1 = keypointsData[currentFrame];
    if (frameKeypoints1) {
      drawKeypoints(frameKeypoints1, "red");
    }

    if (keypointsData2) {
      const frameKeypoints2 = keypointsData2[currentFrame];
      if (frameKeypoints2) {
        drawKeypoints(frameKeypoints2, "blue");
      }
    }

    // Update head path if showHeadData is true
    if (showHeadData && frameKeypoints1) {
      const headKeypoint = frameKeypoints1[0][0];
      if (headKeypoint && headKeypoint.score > 0.3) {
        const scaledX = (headKeypoint.x / 800) * videoWidth + videoWidth / 2;
        const scaledY = videoHeight - (headKeypoint.y / 450) * videoHeight;
        setHeadPath((prevHeadPath) => [...prevHeadPath, { scaledX, scaledY }]);
      }
    }

    if (showPathData && frameKeypoints1) {
      console.log(frameKeypoints1);
      const pathKeypoint = frameKeypoints1[0][9];
      if (pathKeypoint) {
        const scaledX = (pathKeypoint.x / 800) * videoWidth + videoWidth / 2;
        const scaledY = videoHeight - (pathKeypoint.y / 450) * videoHeight;
        setPathPath((prevPathPath) => [...prevPathPath, { scaledX, scaledY }]);
      }
    }

    // Draw the entire head path
    drawHeadPath();
    drawPathPath();

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
  }, [keypointsData, keypointsData2, currentFrame, showHeadData]);

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
          display: "block",
          margin: "0 auto",
          borderRadius: 2,
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
