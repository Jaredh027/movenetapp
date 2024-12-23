import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";

export const CaptureVideoMovement = async (videoURL, recordedFramesRef) => {
  // Initialize TensorFlow.js
  await tf.setBackend("webgl");
  await tf.ready();

  // Load the MoveNet detector
  const detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
    }
  );

  // Create a video element
  const video = document.createElement("video");
  video.src = videoURL;
  video.crossOrigin = "anonymous"; // For cross-origin video
  video.muted = true; // Mute for autoplay compatibility
  await video.play(); // Ensure the video starts playing

  const detectPose = async () => {
    if (video.paused || video.ended) {
      return; // Stop if video is not playing
    }

    // Estimate poses
    const poses = await detector.estimatePoses(video);

    if (poses.length > 0) {
      const keypoints = [poses[0].keypoints];
      recordedFramesRef.current.push(keypoints); // Save keypoints to reference
    }

    // Continue detection on the next animation frame
    requestAnimationFrame(detectPose);
  };

  // Start pose detection
  detectPose();
};
