import { Grid } from "@mui/material";
import React from "react";
import CustomButton from "./CustomButton";

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

function EvaluationPointsPanel({
  pointsOfEvaluationArr,
  handleEvaluationSelected,
}) {
  return (
    <PanelContainer>
      {pointsOfEvaluationArr.length > 0 ? (
        <>
          {pointsOfEvaluationArr.map((evaluation) => (
            <CustomButton
              key={evaluation}
              onClick={() => handleEvaluationSelected(evaluation)}
            >
              {evaluation}
            </CustomButton>
          ))}
        </>
      ) : (
        <h2>Upload a Swing First</h2>
      )}
    </PanelContainer>
  );
}

export default EvaluationPointsPanel;
