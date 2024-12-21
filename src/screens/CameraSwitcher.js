import React, { useState, useEffect, forwardRef } from "react";
import { ReactComponent as MoreVert } from "../icons/more-vertical.svg";
import ClickableIcon from "../Components/ClickableIcon";
import { Button } from "@mui/material";
import CustomButton from "../Components/CustomButton";
import PopoverButton from "../Components/PopoverButton";

// CameraSwitcher component using forwardRef to control the video element
const CameraSwitcher = forwardRef((props, ref) => {
  const [devices, setDevices] = useState([]);
  const [camNum, setCamNum] = useState(0);
  const [currentStream, setCurrentStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  // Stop camera when user goes away from screen
  useEffect(() => {
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [currentStream]);

  useEffect(() => {
    const getVideoDevices = async () => {
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(
          (device) => device.kind === "videoinput"
        );
        console.log("Available video devices:", videoDevices);
        setDevices(videoDevices);
      } catch (error) {
        console.error("Error accessing video devices:", error);
      }
    };
    getVideoDevices();
  }, []);

  useEffect(() => {
    if (devices.length > 0) {
      startStream(devices[camNum].deviceId);
    }

    // Clean up the old stream when switching cameras
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [camNum, devices]);

  const startStream = async (deviceId) => {
    if (currentStream) {
      currentStream.getTracks().forEach((track) => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { ideal: deviceId } },
      });

      if (ref.current) {
        ref.current.srcObject = stream; // Set the video stream
        ref.current.onloadedmetadata = () => {
          ref.current.play(); // Start playback once metadata is loaded
        };
      }
      setCurrentStream(stream);
    } catch (error) {
      console.error("Error starting video stream:", error);
    }
  };

  const cycleCamera = (selectedDevice) => {
    let camNum = devices.indexOf(selectedDevice);
    setCamNum(camNum);
  };

  const startRecording = () => {
    if (currentStream) {
      const recorder = new MediaRecorder(currentStream, {
        mimeType: "video/webm",
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);

        // Create a link to download the video
        const a = document.createElement("a");
        a.href = url;
        a.download = "recorded-video.webm";
        a.click();

        // Revoke the URL to free memory
        URL.revokeObjectURL(url);
      };

      recorder.start();
      setMediaRecorder(recorder);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
  };

  return (
    <>
      <video
        ref={ref} // The ref forwarded from the parent is applied here
        autoPlay
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          right: 0,
          left: 0,
          zIndex: 5,
        }}
      ></video>
      {devices.length > 0 && (
        <ClickableIcon
          style={{
            zIndex: 15,
            position: "relative",
            float: "right",
            margin: 15,
            backgroundColor: "rgba(0,0,0,0.25)",
            borderRadius: "50%",
          }}
          onClick={cycleCamera}
          startIcon={<MoreVert />}
          popoverContent={devices.map((device, index) => {
            return (
              <PopoverButton onClick={() => cycleCamera(device)} key={index}>
                {device.label}
              </PopoverButton>
            );
          })}
        ></ClickableIcon>
      )}
    </>
  );
});

export default CameraSwitcher;
