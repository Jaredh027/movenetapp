import React, { useRef, useEffect, useState } from "react";

function FindFramesHelper({ keypointsData }) {
  //   console.log(keypointsData);
  const canvasRef = useRef(null);
  const [countDown, setCountDown] = useState(3);
  const [currentFrame, setCurrentFrame] = useState(0); // State for current frame index

  useEffect(() => {
    // Countdown logic
    const timer = setInterval(() => {
      setCountDown((prevCountDown) => {
        if (prevCountDown > 0) {
          return prevCountDown - 1;
        } else {
          clearInterval(timer); // Clear the interval once countdown is complete
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup the interval on component unmount
  }, []);

  useEffect(() => {
    if (keypointsData.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const videoWidth = canvas.width; // Use canvas width
      const videoHeight = canvas.height; // Use canvas height

      const drawKeypoints = (frameIndex) => {
        ctx.clearRect(0, 0, videoWidth, videoHeight);

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

        const frameKeypoints = keypointsData[frameIndex];

        const offCenterValueFromLeftAnkle = {
          "x": -1 * ((frameKeypoints[0][15].x / 1280) * videoWidth - 150),
          "y": -1 * ((frameKeypoints[0][15].y / 720) * videoHeight - 150),
        };

        console.log(
          "left ankle",
          (frameKeypoints[0][15].x / 1280) * videoWidth
        );
        console.log(
          "eyes or nose",
          (frameKeypoints[0][1].x / 1280) * videoWidth
        );
        console.log("Right Hip", (frameKeypoints[0][14].x / 1280) * videoWidth);
        console.log(offCenterValueFromLeftAnkle.x);

        frameKeypoints.forEach((keypoints) => {
          keypoints.forEach(({ x, y, score }, index) => {
            if (score > 0.3) {
              // Adjust these values to your video dimensions
              const originalVideoWidth = 1280; // Example: set this to your video's actual width
              const originalVideoHeight = 720; // Example: set this to your video's actual height

              // Scale keypoints to fit the canvas
              const scaledX = (x / originalVideoWidth) * videoWidth;
              const scaledY = (y / originalVideoHeight) * videoHeight;

              const centeredX = offCenterValueFromLeftAnkle.x + scaledX;
              const centeredY = offCenterValueFromLeftAnkle.y + scaledY;

              // Get the swing centered on the canvas
              ctx.beginPath();
              ctx.arc(centeredX, centeredY, 5, 0, 2 * Math.PI);
              ctx.arc(150, 150, 5, 0, 2 * Math.PI);
              ctx.fillStyle = "red";
              ctx.fill();

              if (keypointConnections[index]) {
                keypointConnections[index].forEach((j) => {
                  const kp2 = keypoints[j];

                  if (kp2 && kp2.score > 0.3) {
                    const scaledX2 = (kp2.x / originalVideoWidth) * videoWidth;
                    const scaledY2 =
                      (kp2.y / originalVideoHeight) * videoHeight;

                    const centeredKp2X =
                      offCenterValueFromLeftAnkle.x + scaledX2;
                    const centeredKp2Y =
                      offCenterValueFromLeftAnkle.y + scaledY2;
                    ctx.beginPath();
                    ctx.moveTo(centeredX, centeredY);
                    ctx.lineTo(centeredKp2X, centeredKp2Y);
                    ctx.strokeStyle = "lime";
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
        drawKeypoints(currentFrame); // Draw the initial frame
      }

      const handleKeyDown = (event) => {
        if (countDown === 0) {
          const frameCount = keypointsData.length;

          if (event.key === "ArrowRight") {
            setCurrentFrame((prevFrame) => (prevFrame + 1) % frameCount);
          } else if (event.key === "ArrowLeft") {
            setCurrentFrame((prevFrame) =>
              prevFrame === 0 ? frameCount - 1 : prevFrame - 1
            );
          } else if (event.key === "Enter") {
            console.log(`Current Frame Index: ${currentFrame}`);
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [countDown, keypointsData, currentFrame]);

  return (
    <>
      <p>{countDown}</p>
      <canvas
        ref={canvasRef}
        style={{
          transform: "scaleX(-1)", // Flip the feed horizontally
          position: "relative",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          border: "1px solid black", // Optional: to visualize the canvas border
          aspectRatio: "16 / 9",
          maxWidth: "1280px",
          width: "100%",
        }}
      />
    </>
  );
}

export default FindFramesHelper;
