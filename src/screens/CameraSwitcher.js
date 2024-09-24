import React, { useState, useRef, useEffect } from "react";

// To get continuity camera working plug in iphone into computer and trust device
// Then lay face back camera towards you with the volume button facing down and the power button facing up
// making your iphone lay in landscape mode
// make sure the device is off and not obstructed
// make sure device is close to macbook (within 30ft)

function CameraSwitcher() {
  const videoRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [camNum, setCamNum] = useState(0);
  const [currentStream, setCurrentStream] = useState(null);

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
        video: {
          deviceId: { exact: deviceId },
        },
      });
      videoRef.current.srcObject = stream;
      setCurrentStream(stream);
    } catch (error) {
      console.error("Error starting video stream:", error);
    }
  };

  const cycleCamera = () => {
    if (devices.length > 0) {
      const nextCamNum = (camNum + 1) % devices.length;
      setCamNum(nextCamNum);
    }
  };

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        style={{ width: "640px", height: "480px" }}
      ></video>

      {devices.length > 0 && (
        <button onClick={cycleCamera}>Switch Camera</button>
      )}
    </div>
  );
}

export default CameraSwitcher;
