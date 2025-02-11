import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";

let detector = null; // Store the detector globally

export const preloadMoveNetModel = async () => {
  await tf.setBackend("webgl");
  await tf.ready();

  if (!detector) {
    detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      {
        modelType: poseDetection.movenet.SINGLEPOSE_LIGHTNING,
      }
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

  if (!detector) {
    console.warn("MoveNet model not preloaded, loading now...");
    await preloadMoveNetModel();
  }

  let isCapturing = true;

  return new Promise((resolve) => {
    const detectPose = async () => {
      if (!isCapturing || videoElement.paused || videoElement.ended) {
        console.log("CAPTURING FRAMES DONE");
        handleCaptureComplete();
        resolve();
        return;
      }

      try {
        const poses = await detector.estimatePoses(videoElement);

        if (poses.length > 0 && poses[0]?.keypoints) {
          const keypoints = poses[0].keypoints;

          if (
            keypoints.every((kp) => kp?.x !== undefined && kp?.y !== undefined)
          ) {
            recordedFramesRef.current.push(keypoints);
          } else {
            console.warn("Invalid keypoints detected:", keypoints);
          }
        } else {
          console.warn("No pose detected in frame.");
        }
      } catch (error) {
        console.error("Error estimating pose:", error);
        isCapturing = false;
        resolve();
        return;
      }

      requestAnimationFrame(detectPose);
    };

    videoElement.onplay = () => {
      console.log("Video started playing, beginning pose detection...");
      detectPose();
    };

    videoElement.onended = async () => {
      isCapturing = false;
      console.log("Video ended, stopping pose detection.");
      handleCaptureComplete();
      resolve();
    };

    videoElement.playbackRate = 0.5;
  });
};
