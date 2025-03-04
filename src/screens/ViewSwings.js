import React, { useEffect, useState } from "react";
import FindFramesHelper from "../displaykeypoints/FindFramesHelper";
import { JAREDSWING } from "../progolfvideo/CONSTANTS";
import { Grid } from "@mui/material";
import NavigationPanel from "../Components/NavigationPanel";
import { getAllSwings, getSwingData } from "../backendCalls/BackendCalls";
import CustomButton from "../Components/CustomButton";
import HeaderText from "../Components/HeaderText";
import { scaleSwingData } from "../datamanipulation/Util";
import { SelectSwing } from "../Components/SelectSwing";

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

const ViewSwings = () => {
  const [swingSelected, setSwingSelected] = useState();
  const [secondSwingSelected, setSecondSwingSelected] = useState();
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
      setSecondSwingSelected(swindData2);
    };

    fetchSwingData();
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <NavigationPanel selectedButtonIndex={3} />
      </Grid>
      <Grid item xs={9}>
        <Container>
          <SelectSwing
            swingArray={swingArray}
            handleSwingSelected={() => handleSwingSelected}
          />
          {swingSelected && (
            <FindFramesHelper
              keypointsData={swingSelected.frames}
              swingArray={secondSwingSelected.frames}
            />
          )}
        </Container>
      </Grid>
    </Grid>
  );
};

export default ViewSwings;
