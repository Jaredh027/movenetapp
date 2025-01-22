import React, { useState } from "react";
import { Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Upload } from "../icons/upload.svg";
import { ReactComponent as Check } from "../icons/check-square.svg";
import { ReactComponent as Layers } from "../icons/layers.svg";
import CustomButton from "./CustomButton";
import HeaderText from "./HeaderText";
import { Container } from "./Container";

const WelcomeItem = (props) => (
  <Grid
    {...props}
    sx={{
      width: "90%",
      textAlign: "left",
      display: "flex",
      flexDirection: "column",
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
    <Container
      style={{
        backgroundColor: "transparent",
        backgroundImage: "none",
      }}
    >
      <div
        style={{
          width: "100%",
          justifyItems: "center",
        }}
      >
        <WelcomeItem item>
          <HeaderText>Menu</HeaderText>
          <h3 style={{ color: "#bddbe8" }}>Let's get dialed</h3>
          <Grid
            sx={{
              marginTop: 5,
              display: "flex",
              flexDirection: "row",
            }}
            columnGap={1}
          >
            {buttonTextArr.map((buttonObj, index) => {
              return (
                <CustomButton
                  style={{ width: "-webkit-fill-available" }}
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
    </Container>
  );
}

export default NavigationPanel;
