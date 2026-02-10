import { useState, useRef } from "react";
import { ReactComponent as Upload } from "../icons/upload.svg";

const UploadButton = ({ handleUploadedData, onClick, children, disabled }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const buttonStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    padding: "1rem 2rem",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "12px",
    border: "none",
    background: disabled
      ? "linear-gradient(135deg, #9ca3af, #6b7280)"
      : "linear-gradient(135deg,rgb(38, 150, 220), rgb(32, 126, 185))",
    color: "white",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    outline: "none",
    width: "100%",
    maxWidth: "300px",
    opacity: disabled ? 0.7 : 1,
  };

  const hiddenInputStyles = {
    display: "none",
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      handleUploadedData(files);
    }
  };

  const handleButtonClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
      if (onClick) {
        onClick();
      }
    }
  };

  return (
    <>
      <button
        style={buttonStyles}
        onClick={handleButtonClick}
        disabled={disabled}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.target.style.transform = "translateY(-1px)";
            e.target.style.boxShadow =
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow =
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
          }
        }}
      >
        <Upload style={{ width: "20px", height: "20px" }} />
        {children}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        style={hiddenInputStyles}
      />
    </>
  );
};

export default UploadButton;
