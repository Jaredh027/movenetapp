import { Grid } from "@mui/material";
import React, { useState } from "react";
import CustomButton from "./CustomButton";
import HeaderText from "./HeaderText";

const PanelContainer = (props) => (
  <Grid
    {...props}
    sx={{
      textAlign: "center",
      display: "flex",
      color: "#34302D",
      alignItems: "center",
      flexDirection: "column",
    }}
  >
    {props.children}
  </Grid>
);

function EvaluationPointsPanel({
  pointsOfEvaluationArr,
  handleHeadEvaluationSelected,
  handlePathEvaluationSelected,
}) {
  const [selectedArr, setSelectedArr] = useState([false, false]);
  let functionArr = [
    handleHeadEvaluationSelected,
    handlePathEvaluationSelected,
  ];
  return (
    <PanelContainer>
      {pointsOfEvaluationArr.length > 0 ? (
        <>
          <HeaderText>Analyze</HeaderText>
          {pointsOfEvaluationArr.map((evaluation, index) => (
            <CustomButton
              key={evaluation}
              onClick={() => {
                functionArr[index](evaluation);
                let tempSelectedArr = selectedArr;
                tempSelectedArr[index] = !tempSelectedArr[index];
                setSelectedArr(tempSelectedArr);
              }}
              selected={selectedArr[index]}
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
