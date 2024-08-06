import React, { useRef, useEffect } from "react";
import calculateNormalizedDistance from "./Utils";

function SwingMatch({ handKeypoints, prerecordedKeypoints }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (handKeypoints.length > 0 && prerecordedKeypoints.length > 0) {
      const bestMatchFrame = matchKeypoints(
        handKeypoints,
        prerecordedKeypoints
      );

      // Draw the matched frame's keypoints on the canvas
      drawMatchedFrame(bestMatchFrame);
    }
  }, [handKeypoints, prerecordedKeypoints]);

  const matchKeypoints = (currentKeypoints, prerecordedKeypoints) => {
    let bestMatchFrame = 0;
    let smallestDistance = Infinity;

    prerecordedKeypoints.forEach((frame, frameIndex) => {
      const frameKeypoints = frame[0]; // Accessing the keypoints in the nested structure
      const distance = calculateNormalizedDistance(
        currentKeypoints,
        frameKeypoints
      );
      console.log(`Distance for frame ${frameIndex}:`, distance);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        bestMatchFrame = frameIndex;
      }
    });
    return bestMatchFrame;
  };

  const drawMatchedFrame = (frameIndex) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const videoWidth = canvas.width;
    const videoHeight = canvas.height;

    ctx.clearRect(0, 0, videoWidth, videoHeight);

    if (frameIndex >= prerecordedKeypoints.length) {
      // console.warn("Frame index out of bounds");
      return;
    }

    const frameKeypoints = prerecordedKeypoints[frameIndex][0] || [];

    frameKeypoints.forEach(({ x, y, score }, index) => {
      if (score > 0.3) {
        const originalVideoWidth = 1920; // Example dimensions, adjust as needed
        const originalVideoHeight = 1080;

        // Scale keypoints to fit the canvas
        const scaledX = (x / originalVideoWidth) * videoWidth;
        const scaledY = (y / originalVideoHeight) * videoHeight;

        ctx.beginPath();
        ctx.arc(scaledX, scaledY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();

        const connections = {
          5: [6, 7, 11], // Left shoulder to right shoulder, left elbow, left hip
          6: [8, 12], // Right shoulder to right elbow, right hip
          7: [9], // Left elbow to left wrist
          8: [10], // Right elbow to right wrist
          11: [12, 13], // Left hip to right hip, left knee
          12: [14], // Right hip to right knee
          13: [15], // Left knee to left ankle
          14: [16], // Right knee to right ankle
        };

        if (connections[index]) {
          connections[index].forEach((j) => {
            const kp2 = frameKeypoints[j];
            if (kp2 && kp2.score > 0.3) {
              const scaledX2 = (kp2.x / originalVideoWidth) * videoWidth;
              const scaledY2 = (kp2.y / originalVideoHeight) * videoHeight;
              ctx.beginPath();
              ctx.moveTo(scaledX, scaledY);
              ctx.lineTo(scaledX2, scaledY2);
              ctx.strokeStyle = "lime";
              ctx.lineWidth = 2;
              ctx.stroke();
            }
          });
        }
      }
    });
  };

  return (
    <canvas
      ref={canvasRef}
      width={640} // Set to the desired canvas width
      height={480} // Set to the desired canvas height
      style={{
        border: "1px solid black", // Optional border for visibility
        display: "block",
        margin: "auto",
      }}
    />
  );
}

export default SwingMatch;
