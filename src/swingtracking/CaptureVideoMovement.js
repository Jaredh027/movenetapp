import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";

let detector = null; // keep a single MoveNet instance

export const preloadMoveNetModel = async () => {
  await tf.setBackend("webgl");
  await tf.ready();

  if (!detector) {
    detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      { modelType: poseDetection.movenet.SINGLEPOSE_LIGHTNING }
    );
  }
  console.log("MoveNet model preloaded");
};

export const CaptureVideoMovement = async (
  videoElement,
  recordedFramesRef,
  handleCaptureComplete
) => {
  if (!videoElement) return;
  if (!detector) await preloadMoveNetModel();

  // ───────── 1. wrist-sanity constants & helpers ─────────  ← NEW
  const WRIST = 9; // MoveNet right-wrist index
  const MIN_CONF = 0.35;
  const MAX_JUMP = 120; // px² distance limit
  let lastGoodWrist = null;

  const acceptWrist = (kp) => {
    if (!kp || kp.score < MIN_CONF) return false;
    if (lastGoodWrist) {
      const dx = kp.x - lastGoodWrist.x;
      const dy = kp.y - lastGoodWrist.y;
      if (dx * dx + dy * dy > MAX_JUMP * MAX_JUMP) return false;
    }
    return true;
  };
  // ────────────────────────────────────────────────────────

  let capturing = true;

  return new Promise((resolve) => {
    const detectPose = async () => {
      try {
        const poses = await detector.estimatePoses(videoElement);
        if (poses.length && poses[0]?.keypoints) {
          const kp = poses[0].keypoints;

          // ───────── 2. gate the frame by wrist validity ─────────  ← NEW
          const wrist = kp[WRIST];
          if (acceptWrist(wrist)) {
            lastGoodWrist = wrist;
            recordedFramesRef.current.push(kp); // keep full keypoints
          } else {
            recordedFramesRef.current.push(null); // mark as “gap”
          }
          // ────────────────────────────────────────────────────────
        }
      } catch (err) {
        console.error("Error estimating pose:", err);
        capturing = false;
        resolve();
        return;
      }
      if (capturing) requestAnimationFrame(detectPose);
    };

    videoElement.onplay = () => detectPose();

    videoElement.onended = () => {
      capturing = false;
      handleCaptureComplete(); // parent will do gap-fill later
      resolve();
    };

    videoElement.playbackRate = 0.5; // slow-mo for clarity
  });
};
