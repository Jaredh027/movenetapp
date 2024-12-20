import { Container, Grid } from "@mui/material";
import React from "react";
import HeaderText from "./HeaderText";
import CustomButton from "./CustomButton";
import SubHeaderText from "./SubHeaderText";

const PanelContainer = (props) => (
  <Grid
    {...props}
    sx={{
      textAlign: "center",
      display: "flex",
      color: "#34302D",
      alignItems: "center",
      flexDirection: "column",
      marginRight: "20px",
      marginTop: "20px",
    }}
  >
    {props.children}
  </Grid>
);

// Should be Scrollable
const SwingSelectionContainer = (props) => (
  <Grid
    {...props}
    sx={{
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      color: "#34302D",
      alignItems: "center",
      flexDirection: "column",
      marginTop: "20px",
      backgroundColor: "white",
      padding: "20px",
      borderRadius: 2,
    }}
  >
    {props.children}
  </Grid>
);

function SwingSelectionPanel({ swingArray, handleSwingSelected }) {
  return (
    <PanelContainer>
      <SubHeaderText>Select Swing</SubHeaderText>
      <SwingSelectionContainer>
        {swingArray.length > 0 ? (
          <>
            {swingArray.map((swing) => (
              <CustomButton
                key={swing.swing_id}
                onClick={() => handleSwingSelected(swing.swing_name)}
              >
                {swing.swing_name}
              </CustomButton>
            ))}
          </>
        ) : (
          <h2>Upload a Swing First</h2>
        )}
      </SwingSelectionContainer>
    </PanelContainer>
  );
}

export default SwingSelectionPanel;
