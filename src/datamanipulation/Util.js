// centers and flips swing data so it is stored consistently
const jointNames = {
  0: "Nose",
  1: "Left Eye",
  2: "Right Eye",
  3: "Left Ear",
  4: "Right Ear",
  5: "Left Shoulder",
  6: "Right Shoulder",
  7: "Left Elbow",
  8: "Right Elbow",
  9: "Left Wrist",
  10: "Right Wrist",
  11: "Left Hip",
  12: "Right Hip",
  13: "Left Knee",
  14: "Right Knee",
  15: "Left Ankle",
  16: "Right Ankle",
};

export const normalizeSwingData = (
  swingData,
  equilizerJointIndex,
  desiredScaleLength
) => {
  let frames = swingData.frames;
  console.log(swingData);
  console.log(frames);
  console.log(frames[0]);

  let offsetFromJoint = null;

  try {
    offsetFromJoint = offCenterValueFromJoint(frames, equilizerJointIndex);
  } catch (error) {
    throw new Error(error);
  }

  let leftAnkleIndex = 15;
  let leftKneeIndex = 13;

  let leftAnkleY = frames[0][leftAnkleIndex].y * -1;
  let leftKneeY = frames[0][leftKneeIndex].y * -1;

  let heightFromAnkleToKnee = leftKneeY - leftAnkleY;

  console.log("heightFromAnkleToKnee", heightFromAnkleToKnee);

  let scaleY = desiredScaleLength / heightFromAnkleToKnee;
  let scaleX = scaleY;

  console.log("scaleY", scaleY);
  console.log("scaleX", scaleX);

  // lets subtract everything by the offset and then change its sign currently the grid is down is higher and left is higher so we need to flip
  frames.forEach((frame) => {
    frame.forEach((joint) => {
      joint.x = (joint.x - offsetFromJoint.x) * -1 * scaleX;
      joint.y = (joint.y - offsetFromJoint.y) * -1 * scaleY;
    });
  });
  swingData.frames = frames;
  return swingData;
};

const offCenterValueFromJoint = (frame, jointIndex) => {
  if (!frame[0] || !frame[0][jointIndex] || frame[0][jointIndex].x == null) {
    const jointName = jointNames[jointIndex] || `Joint ${jointIndex}`;
    console.log(frame);
    console.log(frame[0]);
    console.log(jointIndex);
    console.log(frame[0][jointIndex].x);
    console.log("WHY IS THIS HAPPENING");
    throw new Error(`${jointName} is not captured`);
  }

  return { x: frame[0][jointIndex].x, y: frame[0][jointIndex].y };
};

//   return {
//     "x": -1 * ((frames[0][jointIndex].x / 800) * videoWidth - 150),
//     "y": -1 * ((frames[0][jointIndex].y / 450) * videoHeight - 150),
//   };
