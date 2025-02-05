import React, { useEffect, useState } from "react";
import FindFramesHelper from "../displaykeypoints/FindFramesHelper";
import { Grid } from "@mui/material";
import NavigationPanel from "../Components/NavigationPanel";
import { getAllSwings, getSwingData } from "../backendCalls/BackendCalls";
import EvaluationPointsPanel from "../Components/EvaluationPointsPanel";
import { SelectSwing } from "../Components/SelectSwing";
import { Container } from "../Components/Container";
import { useUserContext } from "../User_Id_Handling/UserContext";

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
  const [showPathData, setShowPathData] = useState(false);
  const [swingArray, setSwingArray] = useState([]);

  const { userId } = useUserContext();

  useEffect(() => {
    const fetchAllSwings = async () => {
      const swings = await getAllSwings(userId);
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

  const getSwingDataPercentages = () => {
    let headStartValue = swingSelected.frames[0][0][0].x;
    let headTotalValue = 0;
    let usedFramesCount = 0;
    swingSelected.frames.forEach((frame) => {
      if (frame[0][0].score > 0.3) {
        usedFramesCount++;
        headTotalValue += frame[0][0].x;
      }
    });
    let percentErrorHead = Math.abs(
      headStartValue - headTotalValue / usedFramesCount
    );
    console.log(percentErrorHead);
  };
  if (swingSelected) {
    getSwingDataPercentages();
  }
  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <NavigationPanel selectedButtonIndex={5} />
      </Grid>
      <Grid item xs={9}>
        <Container>
          <SwingContainer>
            <SelectSwing
              swingArray={swingArray}
              handleSwingSelected={handleSwingSelected}
            />
            {swingSelected && (
              <>
                <FindFramesHelper
                  keypointsData={swingSelected.frames}
                  showHeadData={showHeadData}
                  showPathData={showPathData}
                />
                {/* <CustomButton onClick={() => setShowHeadData(true)}>
                  Head Evaluation
                </CustomButton> */}
                <EvaluationPointsPanel
                  pointsOfEvaluationArr={["Head Evaluation", "Path Evaluation"]}
                  handleHeadEvaluationSelected={() =>
                    setShowHeadData((prevBool) => !prevBool)
                  }
                  handlePathEvaluationSelected={() =>
                    setShowPathData((prevBool) => !prevBool)
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
