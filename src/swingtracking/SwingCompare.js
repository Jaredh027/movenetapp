//Take uploaded swing an compare it with a group of swings to test consistency among them
import {
  compareSwingFrameKeypoints,
  getProportionalDistanceDivisor,
  distanceToCenterOfSwingX,
  distanceToCenterOfSwingY,
} from "./Utils";
const SwingCompare = ({ goalSwingKeypoints, attemptSwingKeypoints }) => {
  let goalProportionDivisor = getProportionDivisor(goalSwingKeypoints);
  let attemptProportionDivisor = getProportionDivisor(attemptSwingKeypoints);
  console.log("goalProportionDivisor", goalProportionDivisor);
  console.log("attemptProportionDivisor", attemptProportionDivisor);
  let goalOffsetCoord = getOffSetCoord(goalSwingKeypoints);
  let attemptOffsetCoord = getOffSetCoord(attemptSwingKeypoints);
  console.log("goalOffsetCoord", goalOffsetCoord);
  console.log("attemptOffsetCoord", attemptOffsetCoord);

  //problem how do we align the frames of the two different swings
  //solutions:
  // a countdown to swing timer
  //lets see how this approach works may have to tweak and manually sort frames some way
  let allJointDistanceArrays = [];
  if (goalProportionDivisor && attemptProportionDivisor) {
    goalSwingKeypoints.forEach((frame) => {
      allJointDistanceArrays.push({ x: 0, y: 0 });
    });
    goalSwingKeypoints.forEach((goalFrame) => {
      let attemptFrame =
        attemptSwingKeypoints[goalSwingKeypoints.indexOf(goalFrame)];
      let jointDistanceArr = compareSwingFrameKeypoints(
        goalFrame,
        attemptFrame,
        goalProportionDivisor,
        attemptProportionDivisor,
        goalOffsetCoord,
        attemptOffsetCoord
      );
      console.log(jointDistanceArr);
      jointDistanceArr.forEach((jointObj) => {
        let index = jointDistanceArr.indexOf(jointObj);
        allJointDistanceArrays[index].x += jointObj.x;
        allJointDistanceArrays[index].y += jointObj.y;
      });
    });
  }
  console.log("Final Data: ", allJointDistanceArrays);
};

const getProportionDivisor = (swingKeypoints) => {
  for (const frame of swingKeypoints) {
    let proportionDivisor = getProportionalDistanceDivisor(frame);
    if (proportionDivisor) {
      return proportionDivisor;
    }
  }
  //could not find valid frame :(
  return null;
};

const getOffSetCoord = (swingKeypoints) => {
  for (const frameHolder of swingKeypoints) {
    let frame = frameHolder[0];
    if (frame[6] && frame[5] && frame[11] && frame[12]) {
      let xOffset = distanceToCenterOfSwingX(frame[6], frame[5]);
      let yOffset = distanceToCenterOfSwingY(frame[11], frame[12]);
      if (xOffset && yOffset) {
        console.log("xOffset", xOffset);
        console.log("yOffset", yOffset);
        return { x: xOffset, y: yOffset };
      }
    }
  }
  //could not find valid frame :(
  return null;
};

export default SwingCompare;
