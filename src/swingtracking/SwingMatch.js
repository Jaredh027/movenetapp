import React, { useRef, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import {
  calculateNormalizedDistance,
  getHighestPointInBackSwingIndex,
  drawMatchedFrame,
} from "./Utils";

import {
  TIGERFRAMES,
  TIGER_TOP_OF_BACKSWING_FRAME,
  TIGER_AT_IMPACT_FRAME,
} from "../progolfvideo/CONSTANTS";

const CompletedSection = styled("p")({
  color: "green",
});

function SwingMatch({ handKeypoints, prerecordedKeypoints }) {
  const canvasRef = useRef(null);
  const matchCanvasRef = useRef(null);
  const backSwingEndFrame = TIGER_TOP_OF_BACKSWING_FRAME;
  const impactOfBallFrame = TIGER_AT_IMPACT_FRAME;
  const swingStageArr = [backSwingEndFrame, impactOfBallFrame];
  const [swingStageString, setSwingStageString] = useState("back_swing");

  const [lastSwingFrame, setLastSwingFrame] = useState(prerecordedKeypoints[0]);
  const [swingStage, setSwingStage] = useState([0, swingStageArr[0]]);

  useEffect(() => {
    if (handKeypoints.length > 0 && prerecordedKeypoints.length > 0) {
      const bestMatchFrame = matchKeypoints(
        handKeypoints,
        prerecordedKeypoints
      );

      // Draw the matched frame's keypoints on the canvas
      // console.log(bestMatchFrame);
      if (prerecordedKeypoints.includes(bestMatchFrame)) {
        setLastSwingFrame(bestMatchFrame); // Only update if frame is valid
      }

      drawMatchedFrame(bestMatchFrame, canvasRef, "green", "yellow");
      drawMatchedFrame(
        prerecordedKeypoints[swingStage[1]],
        matchCanvasRef,
        "gray",
        "white"
      );
      // console.log(swingStageString);
    }
  }, [handKeypoints, prerecordedKeypoints]);

  const matchKeypoints = (currentKeypoints, prerecordedKeypoints) => {
    let bestMatchFrame = prerecordedKeypoints[swingStage[0]];
    let smallestDistance = Infinity;

    let sectionOfPrerecordedKeyPoints = prerecordedKeypoints.slice(
      swingStage[0],
      swingStage[1]
    );

    const lastFrameIndex = prerecordedKeypoints.indexOf(lastSwingFrame);
    if (lastFrameIndex < 0) {
      console.error("Last swing frame not found");
      return bestMatchFrame; // Fallback to a safe frame
    }

    let smallerRangeOfPrerecordedKeyPoints =
      sectionOfPrerecordedKeyPoints.slice(lastFrameIndex, lastFrameIndex + 5);

    smallerRangeOfPrerecordedKeyPoints.forEach((frame) => {
      const frameKeypoints = frame[0]; // Accessing the keypoints in the nested structure
      const distance = calculateNormalizedDistance(
        currentKeypoints,
        frameKeypoints,
        swingStageString
      );

      if (distance < smallestDistance) {
        smallestDistance = distance;
        bestMatchFrame = frame;
      }
    });

    const bestMatchIndex =
      sectionOfPrerecordedKeyPoints.indexOf(bestMatchFrame);
    if (
      bestMatchIndex >= swingStage[1] - 2 &&
      swingStage[1] !== prerecordedKeypoints.length
    ) {
      console.log(
        "new goal",
        swingStageArr[swingStageArr.indexOf(swingStage[1]) + 1]
      );
      setSwingStage((oldSwingStage) => [
        oldSwingStage[1],
        swingStageArr[swingStageArr.indexOf(oldSwingStage[1]) + 1],
      ]);
      if (swingStageString === "back_swing") {
        setSwingStageString("ball_strike");
      }
    }

    return bestMatchFrame;
  };

  return (
    <>
      <Box
        sx={{
          color: swingStageString === "ball_strike" ? "green" : "black",
        }}
      >
        Back Swing
      </Box>
      <p
        sx={{
          color:
            swingStageString !== "ball_strike" &&
            swingStageString !== "back_swing"
              ? "green"
              : "black",
        }}
      >
        Ballstrike
      </p>
      <p>Finished Swing</p>
      <canvas
        ref={canvasRef}
        width={1280} // Set to the desired canvas width
        height={720} // Set to the desired canvas height
        style={{
          border: "1px solid black", // Optional border for visibility
          display: "block",
          margin: "auto",
          position: "absolute",
          zIndex: 11,
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      />
      <canvas
        ref={matchCanvasRef}
        width={1280} // Set to the desired canvas width
        height={720} // Set to the desired canvas height
        style={{
          border: "1px solid black", // Optional border for visibility
          display: "block",
          margin: "auto",
          position: "absolute",
          zIndex: 10,
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      />
    </>
  );
}

export default SwingMatch;
