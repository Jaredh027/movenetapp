import React, { useState } from "react";
import { Grid, Button } from "@mui/material";
import Box from "@mui/material/Box";

import { useNavigate } from "react-router-dom";
import { ReactComponent as Upload } from "../icons/upload.svg";
import { ReactComponent as Check } from "../icons/check-square.svg";
import { ReactComponent as Layers } from "../icons/layers.svg";
import CustomButton from "./CustomButton";
import HeaderText from "./HeaderText";
import { Container } from "./Container";
import "../App.css";

function NavigationPanel({ selectedButtonIndex }) {
  const navigate = useNavigate();

  const buttonTextArr = [
    { text: "Test your swing against the champs" },
    { text: "Compare your swings", icon: <Check />, nav: "/consistency" },
    { text: "Upload your swing", icon: <Upload />, nav: "/recordswing" },
    {
      text: "Rapid Swing Analysis",
      nav: "/rapidswinganalysis",
    },
    {
      text: "Look at Uploaded Swings",
      icon: <Layers />,
      nav: "/uploadedswings",
    },
    { text: "Evaluate Your Swing", nav: "/swingevaluation" },
  ];

  return (
    <div
      style={{
        width: "100%",
        justifyItems: "left",
      }}
    >
      <p className="SHText">Let's get dialed</p>
      <Box
        sx={{
          display: "grid",
          columnGap: 1,
          width: "100%",
          gridTemplateColumns: `repeat(${buttonTextArr.length}, 1fr)`,
        }}
      >
        {buttonTextArr.map((buttonObj, index) => {
          return (
            <CustomButton
              style={{ width: "-webkit-fill-available" }}
              onClick={() => {
                navigate(buttonObj.nav);
              }}
              key={buttonObj.text}
              selected={index === selectedButtonIndex ? true : false}
              startIcon={buttonObj?.icon}
            >
              <p className="PText">{buttonObj.text} </p>
            </CustomButton>
          );
        })}
      </Box>
    </div>
  );
}

export default NavigationPanel;
