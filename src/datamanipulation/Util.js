// centers and flips swing data so it is stored consistently
export const normalizeSwingData = (swingData, equilizerJointIndex) => {
  let frames = swingData.frames;
  const offsetFromJoint = offCenterValueFromJoint(
    frames[0],
    equilizerJointIndex
  );
  // lets subtract everything by the offset and then change its sign currently the grid is down is higher and left is higher so we need to flip
  frames.forEach((frame) => {
    frame[0].forEach((joint) => {
      joint.x = (joint.x - offsetFromJoint.x) * -1;
      joint.y = (joint.y - offsetFromJoint.y) * -1;
    });
  });
  swingData.frames = frames;
  return swingData;
};

export const scaleSwingData = (swingData, desiredScaleLength) => {
  let frames = swingData.frames;
  let leftAnkleIndex = 15;
  let leftKneeIndex = 13;

  let leftAnkleY = frames[0][0][leftAnkleIndex].y;
  let leftKneeY = frames[0][0][leftKneeIndex].y;

  console.log(leftAnkleY);
  console.log(leftKneeY);
  console.log("Length From Knee to Ankle", leftKneeY - leftAnkleY);
};

const offCenterValueFromJoint = (frame, jointIndex) => {
  // get the off set of joint from 0
  return { "x": frame[0][jointIndex].x, "y": frame[0][jointIndex].y };
};

//   return {
//     "x": -1 * ((frames[0][jointIndex].x / 800) * videoWidth - 150),
//     "y": -1 * ((frames[0][jointIndex].y / 450) * videoHeight - 150),
//   };
