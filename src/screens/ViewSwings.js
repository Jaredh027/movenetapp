import React, { useRef, useEffect, useState } from "react";
import FindFramesHelper from "../displaykeypoints/FindFramesHelper";
import { JAREDSWING } from "../progolfvideo/CONSTANTS";
import { Container, Grid } from "@mui/material";
import NavigationPanel from "../Components/NavigationPanel";

const ViewSwings = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <NavigationPanel />
      </Grid>
      <Grid item xs={9}>
        <Container>
          <FindFramesHelper keypointsData={JAREDSWING} />
        </Container>
      </Grid>
    </Grid>
  );
};

export default ViewSwings;
