import React, { useRef, useEffect, useState } from "react";
import SwingCompare from "../swingtracking/SwingCompare";
import { TIGERFRAMES } from "../progolfvideo/CONSTANTS";
const SwingConsistency = () => {
  return (
    <SwingCompare
      goalSwingKeypoints={TIGERFRAMES}
      attemptSwingKeypoints={TIGERFRAMES}
    />
  );
};

export default SwingConsistency;
