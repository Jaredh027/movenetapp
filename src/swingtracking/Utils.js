const getCenterOfTwoPoints = (point1, point2) => {
  return (point1 + point2) / 2;
};
const getSwingMidPointX = (leftShoulder, rightShoulder) => {
  return getCenterOfTwoPoints(leftShoulder.x, rightShoulder.x);
};

const getSwingMidPointY = (leftHip, rightHip) => {
  return getCenterOfTwoPoints(leftHip.y, rightHip.y);
};

const getHighestPointsInSwingIndexes = (prerecordedKeypoints) => {
  let highestPointInSwing = [0, 0]; // [endofbackswing, endofswing]
  prerecordedKeypoints.forEach((frame, frameIndex) => {
    const frameKeypoints = frame[0];
    if (frameKeypoints[9] && frameKeypoints[5] && frameKeypoints[6]) {
      let centerX = getSwingMidPointX(frameKeypoints[5], frameKeypoints[6]);
      //setting end of backswing point
      if (
        centerX - frameKeypoints[9].x > 0 &&
        highestPointInSwing[0] < frameKeypoints[9].y
      ) {
        highestPointInSwing[0] = frameIndex;
        //setting end of swing point
      } else if (
        centerX - frameKeypoints[9].x < 0 &&
        highestPointInSwing[1] < frameKeypoints[9].y
      ) {
        highestPointInSwing[1] = frameIndex;
      }
    }
  });
  return highestPointInSwing;
};

const calculateNormalizedDistance = (keypoints1, keypoints2) => {
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

  let distanceFromCenterX = centerX - leftHand.x;
  let distanceFromCenterY = centerY - leftHand.y;

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
};

export default calculateNormalizedDistance;
