import React, { useState } from "react";
import { Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Upload } from "../icons/upload.svg";
import { ReactComponent as Check } from "../icons/check-square.svg";
import { ReactComponent as Layers } from "../icons/layers.svg";
import CustomButton from "./CustomButton";
import HeaderText from "./HeaderText";

const WelcomeItem = (props) => (
  <Grid
    {...props}
    sx={{
      textAlign: "left",
      display: "block",
      justifyContent: "center",
      color: "#34302D",
    }}
  >
    {props.children}
  </Grid>
);

function NavigationPanel({ selectedButtonIndex }) {
  const navigate = useNavigate();

  const buttonTextArr = [
    { text: "Test your swing against the champs" },
    { text: "Check your consistency", icon: <Check /> },
    { text: "Upload your swing", icon: <Upload />, nav: "/recordswing" },
    {
      text: "Look at Uploaded Swings",
      icon: <Layers />,
      nav: "/uploadedswings",
    },
    { text: "Test out switching cameras", nav: "/switchcamera" },
    { text: "Evaluate Your Swing", nav: "/swingevaluation" },
  ];

  return (
    <div
      style={{
        width: "fit-content",
        backgroundColor: "#6699cc",
        marginLeft: "20px",
        padding: 40,
        borderRadius: 4,
        marginTop: 20,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <WelcomeItem item>
        <HeaderText>Welcome to the Swing Workshop</HeaderText>
        <h3 style={{ color: "#bddbe8" }}>Let's get dialed</h3>
        <Grid sx={{ marginTop: 5 }}>
          {buttonTextArr.map((buttonObj, index) => {
            return (
              <CustomButton
                key={buttonObj.text}
                onClick={() => {
                  navigate(buttonObj.nav);
                }}
                selected={index === selectedButtonIndex ? true : false}
                startIcon={buttonObj?.icon}
              >
                {buttonObj.text}{" "}
              </CustomButton>
            );
          })}
        </Grid>
      </WelcomeItem>
    </div>
  );
}

export default NavigationPanel;
