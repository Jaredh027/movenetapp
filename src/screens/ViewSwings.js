import React, { useEffect, useState } from "react";
import FindFramesHelper from "../displaykeypoints/FindFramesHelper";
import { JAREDSWING } from "../progolfvideo/CONSTANTS";
import { Grid } from "@mui/material";
import NavigationPanel from "../Components/NavigationPanel";
import {
  deleteSwing,
  getAllSwings,
  getSwingData,
} from "../backendCalls/BackendCalls";
import CustomButton from "../Components/CustomButton";
import HeaderText from "../Components/HeaderText";
import { scaleSwingData } from "../datamanipulation/Util";
import { SelectSwing } from "../Components/SelectSwing";
import { useUserContext } from "../User_Id_Handling/UserContext";

const Container = (props) => (
  <Grid
    {...props}
    sx={{
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      color: "#34302D",
      alignItems: "center",
      flexDirection: "row",
      columnGap: 2,
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
      const swindData2 = await getSwingData(swingArray[0].swing_name, userId);
      console.log(swingData);
      setSwingSelected(swingData);
      setSecondSwingSelected(swindData2);
    };

    fetchSwingData();
  };

  const handleSwingDeleted = (swingName) => {
    // NOT WORKING LOOK AT LARGE VIEW SWING
    const fetchSwingData = async () => {
      deleteSwing(swingName, userId);
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
            handleSwingSelected={handleSwingSelected}
            deleteSwingHandler={handleSwingDeleted}
          />
          {swingSelected && (
            <FindFramesHelper
              keypointsData={swingSelected.frames}
              keypointsData2={secondSwingSelected.frames}
            />
          )}
        </Container>
      </Grid>
    </Grid>
  );
};

export default ViewSwings;
