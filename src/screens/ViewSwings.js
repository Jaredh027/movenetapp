import React, { useEffect, useState } from "react";
import FindFramesHelper from "../displaykeypoints/FindFramesHelper";
import { JAREDSWING } from "../progolfvideo/CONSTANTS";
import { Grid } from "@mui/material";
import NavigationPanel from "../Components/NavigationPanel";
import { getAllSwings, getSwingData } from "../backendCalls/BackendCalls";
import CustomButton from "../Components/CustomButton";
import HeaderText from "../Components/HeaderText";

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
      console.log(swingData);
      setSwingSelected(swingData);
    };

    fetchSwingData();
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <NavigationPanel />
      </Grid>
      <Grid item xs={9}>
        <Container>
          {swingArray.length > 0 ? (
            <>
              <HeaderText>Select a Swing to Analyze</HeaderText>
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
          {swingSelected && (
            <FindFramesHelper keypointsData={swingSelected.frames} />
          )}
        </Container>
      </Grid>
    </Grid>
  );
};

export default ViewSwings;
