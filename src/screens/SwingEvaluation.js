import React, { useEffect, useState } from "react";
import FindFramesHelper from "../displaykeypoints/FindFramesHelper";
import { JAREDSWING } from "../progolfvideo/CONSTANTS";
import { Grid } from "@mui/material";
import NavigationPanel from "../Components/NavigationPanel";
import { getAllSwings, getSwingData } from "../backendCalls/BackendCalls";
import CustomButton from "../Components/CustomButton";
import HeaderText from "../Components/HeaderText";
import { scaleSwingData } from "../datamanipulation/Util";
import SwingSelectionPanel from "../Components/SwingSelectionPanel";
import EvaluationPointsPanel from "../Components/EvaluationPointsPanel";

const Container = (props) => (
  <Grid
    {...props}
    sx={{
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      color: "#34302D",
      alignItems: "center",
      flexDirection: "column",
      marginRight: "20px",
      marginTop: "20px",
      backgroundColor: "#6699cc",
      padding: "20px",
      borderRadius: 2,
    }}
  >
    {props.children}
  </Grid>
);

const SwingContainer = (props) => (
  <Grid
    {...props}
    sx={{
      display: "flex",
      flexDirection: "row",
    }}
  >
    {props.children}
  </Grid>
);

const SwingEvaluation = () => {
  const [swingSelected, setSwingSelected] = useState();
  const [showHeadData, setShowHeadData] = useState(false);
  const [swingArray, setSwingArray] = useState([]);

  useEffect(() => {
    const fetchAllSwings = async () => {
      const swings = await getAllSwings();
      console.log(swings);
      setSwingArray(swings);
    };

    fetchAllSwings();
  }, []);

  const handleSwingSelected = (swingName) => {
    const fetchSwingData = async () => {
      const swingData = await getSwingData(swingName);
      const swindData2 = await getSwingData(swingArray[0].swing_name);
      console.log(swingData);
      setSwingSelected(swingData);
    };

    fetchSwingData();
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <NavigationPanel selectedButtonIndex={5} />
      </Grid>
      <Grid item xs={9}>
        <Container>
          <SwingContainer>
            <SwingSelectionPanel
              swingArray={swingArray}
              handleSwingSelected={handleSwingSelected}
            />
            {swingSelected && (
              <>
                <FindFramesHelper
                  keypointsData={swingSelected.frames}
                  showHeadData={showHeadData}
                />
                {/* <CustomButton onClick={() => setShowHeadData(true)}>
                  Head Evaluation
                </CustomButton> */}
                <EvaluationPointsPanel
                  pointsOfEvaluationArr={["Head Evaluation"]}
                  handleEvaluationSelected={() =>
                    setShowHeadData((prevBool) => !prevBool)
                  }
                />
              </>
            )}
          </SwingContainer>
        </Container>
      </Grid>
    </Grid>
  );
};

export default SwingEvaluation;
