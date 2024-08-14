import React, { useRef, useEffect, useState } from "react";
import FindFramesHelper from "../displaykeypoints/FindFramesHelper";
import { JAREDSWING } from "../progolfvideo/CONSTANTS";

const ViewSwings = () => {
  return <FindFramesHelper keypointsData={JAREDSWING} />;
};

export default ViewSwings;
