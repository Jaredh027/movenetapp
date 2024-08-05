import React, { useRef, useEffect } from "react";

function SwingMatch({ handKeypoints, prerecordedKeypoints }) {
  // console.log(handKeypoints);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (handKeypoints.length > 0 && prerecordedKeypoints.length > 0) {
      const bestMatchFrame = matchKeypoints(
        handKeypoints,
        prerecordedKeypoints
      );
      // console.log("Best match frame:", bestMatchFrame);

      // Draw the matched frame's keypoints on the canvas
      drawMatchedFrame(bestMatchFrame);
    }
  }, [handKeypoints, prerecordedKeypoints]);

  const matchKeypoints = (currentKeypoints, prerecordedKeypoints) => {
    let bestMatchFrame = 0;
    let smallestDistance = Infinity;

    // console.log("Current Keypoints:", currentKeypoints);
    // console.log(
    //   "Prerecorded Keypoints (total frames):",
    //   prerecordedKeypoints.length
    // );

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

    // console.log("Best Frame", bestMatchFrame);
    // console.log("Smallest Distance", smallestDistance);
    return bestMatchFrame;
  };

  const calculateNormalizedDistance = (keypoints1, keypoints2) => {
    if (!keypoints2 || keypoints2.length === 0) {
      // console.warn("Keypoints data is missing for comparison.");
      return Infinity; // Return a large value to indicate poor match
    }

    // const normalize = (keypoints, useNames = false) => {
    //   const keypointsMap = keypoints.reduce((acc, kp, index) => {
    //     const name = useNames ? kp.name : index;
    //     acc[name] = kp;
    //     return acc;
    //   }, {});

    //   const leftShoulder = keypointsMap["left_shoulder"] || keypointsMap[5];
    //   const rightShoulder = keypointsMap["right_shoulder"] || keypointsMap[6];

    //   if (!leftShoulder || !rightShoulder) {
    //     // console.warn("Missing keypoints for shoulders. Data:", keypoints);
    //     return keypoints.map((kp) => kp || { x: 0, y: 0, score: 0 });
    //   }

    //   const centerX = (leftShoulder.x + rightShoulder.x) / 2;
    //   const centerY = (leftShoulder.y + rightShoulder.y) / 2;

    //   const normKeypoints = keypoints.map((kp) => ({
    //     x: (kp.x || 0) - centerX,
    //     y: (kp.y || 0) - centerY,
    //     score: kp.score || 0,
    //   }));
    //   return normKeypoints;
    // };

    // const norm1 = normalize(keypoints1, true);
    // const norm2 = normalize(keypoints2);

    let leftHand = keypoints1[0];
    let leftShoulder = keypoints1[1];
    let rightShoulder = keypoints1[2];
    let leftHip = keypoints1[3];
    let rightHip = keypoints1[4];

    let leftHand2 = keypoints2[9];
    let leftShoulder2 = keypoints2[5];
    let rightShoulder2 = keypoints2[6];
    let leftHip2 = keypoints2[11];
    let rightHip2 = keypoints2[12];

    if (!leftHand || !leftShoulder || !rightShoulder || !leftHip || !rightHip) {
      return Infinity;
    }
    if (
      !leftHand2 ||
      !leftShoulder2 ||
      !rightShoulder2 ||
      !leftHip2 ||
      !rightHip2
    ) {
      return Infinity;
    }

    let centerX = (leftShoulder.x + rightShoulder.x) / 2;
    let centerX2 = (leftShoulder2.x + rightShoulder2.x) / 2;
    let centerY = (leftHip.y + rightHip.y) / 2;
    let centerY2 = (leftHip2.y + rightHip2.y) / 2;

    // let distanceX = leftHand.x - middleOfShouldersX;
    // let distanceX2 = leftHand2.x - middleOfShouldersX2;

    // let distanceY = leftHand.y - middleOfShouldersY;
    // let distanceY2 = leftHand2.y - middleOfShouldersY2;

    let distanceFromCenterX = centerX - leftHand.x;
    let distanceFromCenterY = centerY - leftHand.y;

    // console.log("distanceFromCenterX", distanceFromCenterX);
    // console.log("distanceFromCenterY", distanceFromCenterY);

    if (
      centerX - leftHand.x > 0 &&
      centerY - leftHand.y > 0 &&
      centerX2 - leftHand2.x < 0 &&
      centerY2 - leftHand2.y > 0
    ) {
      console.log("top rigth");
      return Math.sqrt(
        Math.pow(centerX - leftHand.x - (centerX2 - leftHand2.x), 2) +
          Math.pow(centerY - leftHand.y - (centerY2 - leftHand2.y), 2)
      );
    }
    if (
      centerX - leftHand.x > 0 &&
      centerY - leftHand.y < 0 &&
      centerX2 - leftHand2.x < 0 &&
      centerY2 - leftHand2.y < 0
    ) {
      console.log("bottom right");
      return Math.sqrt(
        Math.pow(centerX - leftHand.x - (centerX2 - leftHand2.x), 2) +
          Math.pow(centerY - leftHand.y - (centerY2 - leftHand2.y), 2)
      );
    }
    if (
      centerX - leftHand.x < 0 &&
      centerY - leftHand.y < 0 &&
      centerX2 - leftHand2.x > 0 &&
      centerY2 - leftHand2.y < 0
    ) {
      console.log("bottom left");
      return Math.sqrt(
        Math.pow(centerX - leftHand.x - (centerX2 - leftHand2.x), 2) +
          Math.pow(centerY - leftHand.y - (centerY2 - leftHand2.y), 2)
      );
    }
    if (
      centerX - leftHand.x < 0 &&
      centerY - leftHand.y > 0 &&
      centerX2 - leftHand2.x > 0 &&
      centerY2 - leftHand2.y > 0
    ) {
      console.log("top left");
      return Math.sqrt(
        Math.pow(centerX - leftHand.x - (centerX2 - leftHand2.x), 2) +
          Math.pow(centerY - leftHand.y - (centerY2 - leftHand2.y), 2)
      );
    }
    return Infinity;

    // if (distanceX < 0) {
    //   distanceX = distanceX * -1;
    // }
    // if (distanceX2 < 0) {
    //   distanceX2 = distanceX2 * -1;
    // }
    // if (distanceY < 0) {
    //   distanceY = distanceY * -1;
    // }
    // if (distanceY2 < 0) {
    //   distanceY2 = distanceY2 * -1;
    // }
    // let totalDistanceX = 0;
    // let totalDistanceY = 0;
    // if (distanceX - distanceX2 < 0) {
    //   totalDistanceX = (distanceX - distanceX2) * -1;
    // } else {
    //   totalDistanceX = distanceX - distanceX2;
    // }
    // if (distanceY - distanceY2 < 0) {
    //   totalDistanceY = (distanceY - distanceY2) * -1;
    // } else {
    //   totalDistanceY = distanceY - distanceY2;
    // }

    // return (totalDistanceX + totalDistanceY) / 2;

    // return norm1.reduce((sum, kp1, index) => {
    //   const kp2 = norm2[index];
    //   if (kp1 && kp2) {
    //     const dx = kp1.x - kp2.x;
    //     const dy = kp1.y - kp2.y;
    //     return sum + Math.sqrt(dx * dx + dy * dy);
    //   }
    //   return sum; // Return the accumulated sum if kp1 or kp2 is undefined
    // }, 0);
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
