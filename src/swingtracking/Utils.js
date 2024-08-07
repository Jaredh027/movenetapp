const getCenterOfTwoPoints = (point1, point2) => {
  return (point1 + point2) / 2;
};
const getSwingMidPointX = (leftShoulder, rightShoulder) => {
  return getCenterOfTwoPoints(leftShoulder.x, rightShoulder.x);
};

const getSwingMidPointY = (leftHip, rightHip) => {
  return getCenterOfTwoPoints(leftHip.y, rightHip.y);
};

const getDistanceBetweenTwoPoints = (coord1, coord2) => {
  return Math.sqrt(
    Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2)
  );
};

export const getHighestPointInBackSwingIndex = (prerecordedKeypoints) => {
  let highestPointInSwing = 0; // endofbackswing
  prerecordedKeypoints.forEach((frame, frameIndex) => {
    const frameKeypoints = frame[0];
    if (frameKeypoints[9] && frameKeypoints[5] && frameKeypoints[6]) {
      let centerX = getSwingMidPointX(frameKeypoints[5], frameKeypoints[6]);
      //setting end of backswing point
      if (
        centerX - frameKeypoints[9].x > 0 &&
        highestPointInSwing < frameKeypoints[9].y
      ) {
        highestPointInSwing = frameIndex;
      }
    }
  });
  return highestPointInSwing;
};

export const calculateNormalizedDistance = (
  keypoints1,
  keypoints2,
  swingStage
) => {
  if (!keypoints2 || keypoints2.length === 0) {
    // console.warn("Keypoints data is missing for comparison.");
    return Infinity; // Return a large value to indicate poor match
  }

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

  if (swingStage === "back_swing" || swingStage === "ball_strike") {
    if (
      !leftHip ||
      !leftHip2 ||
      !leftHand ||
      !leftHand2 ||
      !rightHip ||
      !rightHip2
    ) {
      return Infinity;
    } else {
      let distanceFromLeftToRightHip = getDistanceBetweenTwoPoints(
        leftHip,
        rightHip
      );
      let distanceFromLeftToRightHip2 = getDistanceBetweenTwoPoints(
        leftHip2,
        rightHip2
      );
      let distanceFromLeftHandToLeftHip = getDistanceBetweenTwoPoints(
        leftHand,
        leftHip
      );
      let distanceFromLeftHandToLeftHip2 = getDistanceBetweenTwoPoints(
        leftHand2,
        leftHip2
      );

      let proportionalDistance =
        distanceFromLeftToRightHip / distanceFromLeftHandToLeftHip;
      let proportionalDistance2 =
        distanceFromLeftToRightHip2 / distanceFromLeftHandToLeftHip2;

      return Math.sqrt(
        Math.pow(proportionalDistance - proportionalDistance2, 2)
      );
    }
  }

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

  let distanceFromLeftToRightHip = getDistanceBetweenTwoPoints(
    leftHip,
    rightHip
  );
  let distanceFromLeftToRightHip2 = getDistanceBetweenTwoPoints(
    leftHip2,
    rightHip2
  );

  let proportionLeftHandFromCenter = {
    x: (centerX - leftHand.x) / distanceFromLeftToRightHip,
    y: (centerY - leftHand.y) / distanceFromLeftToRightHip,
  };
  let proportionLeftHandFromCenter2 = {
    x: (centerX2 - leftHand2.x) / distanceFromLeftToRightHip2,
    y: (centerY2 - leftHand2.y) / distanceFromLeftToRightHip2,
  };

  if (
    centerX - leftHand.x > 0 &&
    centerY - leftHand.y > 0 &&
    centerX2 - leftHand2.x < 0 &&
    centerY2 - leftHand2.y > 0
  ) {
    // console.log("top rigth");
    return getDistanceBetweenTwoPoints(
      proportionLeftHandFromCenter,
      proportionLeftHandFromCenter2
    );
  }
  if (
    centerX - leftHand.x > 0 &&
    centerY - leftHand.y < 0 &&
    centerX2 - leftHand2.x < 0 &&
    centerY2 - leftHand2.y < 0
  ) {
    // console.log("bottom right");
    return getDistanceBetweenTwoPoints(
      proportionLeftHandFromCenter,
      proportionLeftHandFromCenter2
    );
  }
  if (
    centerX - leftHand.x < 0 &&
    centerY - leftHand.y < 0 &&
    centerX2 - leftHand2.x > 0 &&
    centerY2 - leftHand2.y < 0
  ) {
    // console.log("bottom left");
    return getDistanceBetweenTwoPoints(
      proportionLeftHandFromCenter,
      proportionLeftHandFromCenter2
    );
  }
  if (
    centerX - leftHand.x < 0 &&
    centerY - leftHand.y > 0 &&
    centerX2 - leftHand2.x > 0 &&
    centerY2 - leftHand2.y > 0
  ) {
    // console.log("top left");
    return getDistanceBetweenTwoPoints(
      proportionLeftHandFromCenter,
      proportionLeftHandFromCenter2
    );
  }
  return Infinity;
};

export const drawMatchedFrame = (
  frameToDraw,
  canvasRef,
  lineColor,
  dotColor
) => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  const videoWidth = canvas.width;
  const videoHeight = canvas.height;

  ctx.clearRect(0, 0, videoWidth, videoHeight);

  const frameKeypoints = frameToDraw[0] || [];

  // Define connections between keypoints
  const connections = {
    5: [6, 11], // Left shoulder to right shoulder, left hip
    6: [12], // Right shoulder to right hip
    11: [12, 13], // Left hip to right hip, left knee
    12: [14], // Right hip to right knee
    13: [15], // Left knee to left ankle
    14: [16], // Right knee to right ankle
  };

  // Define connections for arms including wrists
  const armConnections = {
    5: [7], // Left shoulder to left elbow
    7: [9], // Left elbow to left wrist
    6: [8], // Right shoulder to right elbow
    8: [10], // Right elbow to right wrist
  };

  // Draw body lines first (excluding arms)
  frameKeypoints.forEach(({ x, y, score }, index) => {
    if (score > 0.3) {
      const originalVideoWidth = 1920; // Example dimensions, adjust as needed
      const originalVideoHeight = 1080;

      // Scale keypoints to fit the canvas
      const scaledX = (x / originalVideoWidth) * videoWidth;
      const scaledY = (y / originalVideoHeight) * videoHeight;

      if (connections[index]) {
        connections[index].forEach((j) => {
          const kp2 = frameKeypoints[j];
          if (kp2 && kp2.score > 0.3) {
            const scaledX2 = (kp2.x / originalVideoWidth) * videoWidth;
            const scaledY2 = (kp2.y / originalVideoHeight) * videoHeight;
            ctx.beginPath();
            ctx.moveTo(scaledX, scaledY);
            ctx.lineTo(scaledX2, scaledY2);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 4;
            ctx.stroke();
          }
        });
      }
    }
  });

  // Draw arms on top of the body
  frameKeypoints.forEach(({ x, y, score }, index) => {
    if (score > 0.3) {
      const originalVideoWidth = 1920;
      const originalVideoHeight = 1080;

      // Scale keypoints to fit the canvas
      const scaledX = (x / originalVideoWidth) * videoWidth;
      const scaledY = (y / originalVideoHeight) * videoHeight;

      if (armConnections[index]) {
        armConnections[index].forEach((j) => {
          const kp2 = frameKeypoints[j];
          if (kp2 && kp2.score > 0.3) {
            const scaledX2 = (kp2.x / originalVideoWidth) * videoWidth;
            const scaledY2 = (kp2.y / originalVideoHeight) * videoHeight;
            ctx.beginPath();
            ctx.moveTo(scaledX, scaledY);
            ctx.lineTo(scaledX2, scaledY2);
            ctx.strokeStyle = "purple"; // Different color for arms
            ctx.lineWidth = 4;
            ctx.stroke();
          }
        });
      }
    }
  });

  // Draw circles for keypoints
  frameKeypoints.forEach(({ x, y, score }) => {
    if (score > 0.3) {
      const originalVideoWidth = 1920;
      const originalVideoHeight = 1080;

      // Scale keypoints to fit the canvas
      const scaledX = (x / originalVideoWidth) * videoWidth;
      const scaledY = (y / originalVideoHeight) * videoHeight;

      ctx.beginPath();
      ctx.arc(scaledX, scaledY, 4, 0, 2 * Math.PI);
      ctx.fillStyle = dotColor;
      ctx.fill();
    }
  });
};

// const swingStageToMatch = (frame) => {};
