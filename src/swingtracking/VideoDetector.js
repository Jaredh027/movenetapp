import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import { drawCanvasFromLiveVideo } from "../swingtracking/Utils";

export const VideoDetector = async (
  webcamRef,
  canvasRef,
  isRecordingRef,
  recordedFramesRef
) => {
  await tf.ready();
  await tf.setBackend("webgl");

  const detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
    }
  );

  const detectPose = async () => {
    if (webcamRef.current && webcamRef.current.readyState === 4) {
      const video = webcamRef.current;

      // Ensure canvas and video maintain the correct aspect ratio (1280x720) and match
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Get canvas reference
      const canvas = canvasRef.current;

      // Set canvas dimensions to match the video dimensions
      canvas.width = videoWidth; // Use the actual video dimensions
      canvas.height = videoHeight;

      // Estimate poses and draw them on the canvas
      const poses = await detector.estimatePoses(video);
      drawCanvasFromLiveVideo(
        poses,
        video,
        canvas.width,
        canvas.height,
        canvasRef
      );

      // If recording, save pose keypoints
      if (isRecordingRef.current) {
        recordedFramesRef.current.push([poses[0].keypoints]);
      }
    }
    requestAnimationFrame(detectPose); // Continue detection on each animation frame
  };

  detectPose();
};
