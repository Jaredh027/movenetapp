import React, { useRef, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import NavigationPanel from "../Components/NavigationPanel";

import { normalizeSwingData } from "../datamanipulation/Util";
import { sendSwingData } from "../backendCalls/BackendCalls";
import RecordSwingVideo from "../Components/RecordSwingVideo";
import { useUserContext } from "../User_Id_Handling/UserContext";
import RecordButton from "../Components/RecordButton";
import SaveButton from "../Components/SaveButton";
import CancelButton from "../Components/CancelButton";
import UploadButton from "../Components/UploadButton";
// Modern Button Components

const TypeField = ({ value, onChange, placeholder }) => {
  const inputStyles = {
    width: "100%",
    padding: "0.875rem 1rem",
    fontSize: "0.875rem",
    borderRadius: "10px",
    border: "2px solid #e5e7eb",
    backgroundColor: "white",
    color: "#1f2937",
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  };

  return (
    <input
      type="text"
      style={inputStyles}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={(e) => {
        e.target.style.borderColor = "#10b981";
        e.target.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.1)";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#e5e7eb";
        e.target.style.boxShadow = "none";
      }}
    />
  );
};

// Modern Container Component
const Container = ({ children }) => {
  const containerStyles = {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "2.5rem",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2rem",
    minHeight: "500px",
    position: "relative",
  };

  return <div style={containerStyles}>{children}</div>;
};

// Modern Modal/Popover Component
const CustomPopover = ({ open, popoverContent }) => {
  if (!open) return null;

  const overlayStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "1rem",
  };

  const modalStyles = {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "2rem",
    maxWidth: "400px",
    width: "100%",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0,x 0.25)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
  };

  return (
    <div style={overlayStyles}>
      <div style={modalStyles}>{popoverContent}</div>
    </div>
  );
};

const CollectSwingVideo = () => {
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [savingVideo, setSavingVideo] = useState(false);
  const [processedVideo, setProcessedVideo] = useState(false);
  const [swingData, setSwingData] = useState(null);
  const [swingTitle, setSwingTitle] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const { userId } = useUserContext();

  // Allow for saving now the video is done being processed by MoveNet
  const videoDoneProcessing = (swingData) => {
    setProcessedVideo(true);
    setSwingData(swingData);
  };

  const saveSwingHandler = (swingData, swingTitle) => {
    console.log("NEW STUFF", swingData);
    setSavingVideo(false);
    setProcessedVideo(false);
    let normalizedSwing = null;
    try {
      normalizedSwing = normalizeSwingData(swingData, 15, 100);
      console.log(normalizedSwing);
      const updatedSwingData = {
        swing_name: swingTitle,
        ...normalizedSwing,
      };

      sendSwingData(updatedSwingData, userId);
    } catch (error) {
      console.log(normalizedSwing);
      setSwingData(null);
      setSwingTitle("");
      setSavingVideo(false);
      setProcessedVideo(false);
      setError(error.message);
      setOpen(true);
    }
  };

  const stopRecording = () => {
    setCountdownStarted(false);
    setSavingVideo(true);
  };

  const handleUploadedData = (files) => {
    // setSavingVideo(true);
    // setProcessedVideo(true);
    // const file = files[0];
    // if (file && file.type.startsWith("video/")) {
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     const videoData = e.target.result;
    //     // Process the video data as needed
    //     // For now, we just simulate processing
    //     videoDoneProcessing(videoData);
    //   };
    //   reader.readAsDataURL(file);
    // } else {
    //   setError("Please upload a valid video file.");
    //   setOpen(true);
    // }
    console.log("Files uploaded:", files);
  };

  const pageStyles = {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "2rem",
  };

  const gridStyles = {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: "2rem",
    maxWidth: "1400px",
    margin: "0 auto",
  };

  const actionGridStyles = {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    gap: "1rem",
    alignItems: "center",
    width: "100%",
    maxWidth: "600px",
  };

  const errorModalContent = (
    <div style={{ textAlign: "center" }}>
      <h3
        style={{
          color: "#dc2626",
          marginBottom: "1rem",
          fontSize: "1.25rem",
          fontWeight: "600",
        }}
      >
        Error Processing Swing
      </h3>
      <p
        style={{ color: "#6b7280", marginBottom: "1.5rem", lineHeight: "1.6" }}
      >
        {error.toString()}
      </p>
      <button
        style={{
          padding: "0.75rem 2rem",
          fontSize: "0.875rem",
          fontWeight: "600",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#10b981",
          color: "white",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onClick={() => setOpen(false)}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#059669";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#10b981";
        }}
      >
        OK
      </button>
    </div>
  );

  return (
    <div style={pageStyles}>
      <div style={gridStyles}>
        {/* Navigation Panel */}
        <div>
          <NavigationPanel selectedButtonIndex={2} />
        </div>

        {/* Main Content */}
        <div>
          <Container>
            {processedVideo ? (
              <div style={actionGridStyles}>
                <SaveButton
                  onClick={() => saveSwingHandler(swingData, swingTitle)}
                  disabled={!swingTitle.trim()}
                >
                  Save
                </SaveButton>

                <TypeField
                  value={swingTitle}
                  onChange={(event) => setSwingTitle(event.target.value)}
                  placeholder="Enter swing name"
                />

                <CancelButton
                  onClick={() => {
                    setSwingData(null);
                    setSwingTitle("");
                    setSavingVideo(false);
                    setProcessedVideo(false);
                  }}
                >
                  Cancel
                </CancelButton>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "1rem" }}>
                <RecordButton
                  onClick={() => setCountdownStarted(true)}
                  disabled={countdownStarted}
                >
                  {countdownStarted ? "Recording..." : "Start Recording"}
                </RecordButton>
                <UploadButton handleUploadedData={handleUploadedData}>
                  Upload Video
                </UploadButton>
              </div>
            )}

            <RecordSwingVideo
              startRecording={countdownStarted}
              savingVideo={savingVideo}
              stopRecording={stopRecording}
              proccessedVideo={videoDoneProcessing}
            />
          </Container>
        </div>
      </div>

      <CustomPopover open={open} popoverContent={errorModalContent} />
    </div>
  );
};

export default CollectSwingVideo;
