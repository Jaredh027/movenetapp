// centers and flips swing data so it is stored consistently
export const normalizeSwingData = (
  swingData,
  equilizerJointIndex,
  desiredScaleLength
) => {
  let frames = swingData.frames;
  console.log(swingData);
  console.log(frames);
  console.log(frames[0]);
  const offsetFromJoint = offCenterValueFromJoint(
    frames[0],
    equilizerJointIndex
  );

  let leftAnkleIndex = 15;
  let leftKneeIndex = 13;

  let leftAnkleY = frames[0][0][leftAnkleIndex].y * -1;
  let leftKneeY = frames[0][0][leftKneeIndex].y * -1;

  let heightFromAnkleToKnee = leftKneeY - leftAnkleY;

  console.log("heightFromAnkleToKnee", heightFromAnkleToKnee);

  let scaleY = desiredScaleLength / heightFromAnkleToKnee;
  let scaleX = scaleY;

  console.log("scaleY", scaleY);
  console.log("scaleX", scaleX);

  // lets subtract everything by the offset and then change its sign currently the grid is down is higher and left is higher so we need to flip
  frames.forEach((frame) => {
    frame[0].forEach((joint) => {
      joint.x = (joint.x - offsetFromJoint.x) * -1 * scaleX;
      joint.y = (joint.y - offsetFromJoint.y) * -1 * scaleY;
    });
  });
  swingData.frames = frames;
  return swingData;
};

const offCenterValueFromJoint = (frame, jointIndex) => {
  // get the off set of joint from 0
  return { "x": frame[0][jointIndex].x, "y": frame[0][jointIndex].y };
};

//   return {
//     "x": -1 * ((frames[0][jointIndex].x / 800) * videoWidth - 150),
//     "y": -1 * ((frames[0][jointIndex].y / 450) * videoHeight - 150),
//   };
