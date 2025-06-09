import React, { useEffect, useState } from "react";
import FindFramesHelper from "../displaykeypoints/FindFramesHelper";
import { Box, Grid } from "@mui/material";
import NavigationPanel from "../Components/NavigationPanel";
import {
  deleteSwing,
  getAllSwings,
  getSwingData,
} from "../backendCalls/BackendCalls";
import EvaluationPointsPanel from "../Components/EvaluationPointsPanel";
import { SelectSwing } from "../Components/SelectSwing";
import { Container } from "../Components/Container";
import { useUserContext } from "../User_Id_Handling/UserContext";
import { SelectSwingLarge } from "../Components/SelectSwingLarge";

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

function fillMissing(frames, thresh = 0.15) {
  // walk every joint separately
  const J = frames[0][0].length;
  for (let j = 0; j < J; j++) {
    // gather valid indices
    const validIdx = frames
      .map((f, i) => (f[0][j].score > thresh ? i : -1))
      .filter((i) => i !== -1);

    for (let k = 0; k < validIdx.length - 1; k++) {
      const a = validIdx[k],
        b = validIdx[k + 1];
      const dx = (frames[b][0][j].x - frames[a][0][j].x) / (b - a);
      const dy = (frames[b][0][j].y - frames[a][0][j].y) / (b - a);
      const ds = (frames[b][0][j].score - frames[a][0][j].score) / (b - a);

      for (let t = a + 1; t < b; t++) {
        frames[t][0][j] = {
          ...frames[a][0][j],
          x: frames[a][0][j].x + dx * (t - a),
          y: frames[a][0][j].y + dy * (t - a),
          score: frames[a][0][j].score + ds * (t - a),
        };
      }
    }
  }
  return frames;
}

function smoothFrames(frames, window = 3) {
  const half = Math.floor(window / 2);
  return frames.map((frame, i) => {
    return [
      frame[0].map((kp, j) => {
        // collect neighbours that exist & have confidence
        const neighbours = [];
        for (let k = i - half; k <= i + half; k++) {
          const f = frames[k];
          if (f && f[0][j]?.score > 0.15) neighbours.push(f[0][j]);
        }
        // average x & y
        const mean = (prop) =>
          neighbours.reduce((s, n) => s + n[prop], 0) / neighbours.length;
        return {
          ...kp,
          x: mean("x"),
          y: mean("y"),
          // blend score so we keep some notion of confidence
          score: mean("score"),
        };
      }),
    ];
  });
}

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
  }, [userId]);

  const handleSwingSelected = (swingName) => {
    const fetchSwingData = async () => {
      const swingData = await getSwingData(swingName, userId);
      const cleaned = smoothFrames(fillMissing(swingData.frames));
      const swindData2 = await getSwingData(swingArray[0].swing_name, userId);
      setSwingSelected({ ...swingData, frames: cleaned });
    };

    fetchSwingData();
  };

  const deleteSwingHandler = async (dblClickSwing) => {
    if (dblClickSwing) {
      await deleteSwing(dblClickSwing.id);
      setSwingArray((prevSwings) =>
        prevSwings.filter((swing) => swing.id !== dblClickSwing.id)
      );

      if (swingSelected?.id === dblClickSwing.id) {
        setSwingSelected(null);
      }
    }
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
      <Grid item xs={9} sx={{ height: "100%" }}>
        <Container>
          <Box
            sx={{
              width: "100%",
            }}
          >
            {swingSelected ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 6fr",
                  width: "100%",
                  maxHeight: "80vh",
                  columnGap: 5,
                }}
              >
                <SelectSwing
                  swingArray={swingArray}
                  handleSwingSelected={handleSwingSelected}
                  deleteSwingHandler={deleteSwingHandler}
                />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "6fr 1fr",

                    columnGap: 5,
                  }}
                >
                  <FindFramesHelper
                    keypointsData={swingSelected.frames}
                    showHeadData={showHeadData}
                    showPathData={showPathData}
                  />
                  {/* <CustomButton onClick={() => setShowHeadData(true)}>
                  Head Evaluation
                </CustomButton> */}
                  <EvaluationPointsPanel
                    pointsOfEvaluationArr={[
                      "Head Evaluation",
                      "Path Evaluation",
                    ]}
                    handleHeadEvaluationSelected={() =>
                      setShowHeadData((prevBool) => !prevBool)
                    }
                    handlePathEvaluationSelected={() =>
                      setShowPathData((prevBool) => !prevBool)
                    }
                  />
                </Box>
              </Box>
            ) : (
              <SelectSwingLarge
                swingArray={swingArray}
                handleSwingSelected={handleSwingSelected}
                deleteSwingHandler={deleteSwingHandler}
              ></SelectSwingLarge>
            )}
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default SwingEvaluation;
