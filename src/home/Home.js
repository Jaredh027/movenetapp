import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useUserContext } from "../User_Id_Handling/UserContext";
import NavigationPanel from "../Components/NavigationPanel";
import { Grid } from "@mui/material";
import { Container } from "../Components/Container";
import HeaderText from "../Components/HeaderText";
import Box from "@mui/material/Box";
import ProfileView from "../Components/ProfileView";
import { fetchUserData, getAllSwings } from "../backendCalls/BackendCalls";

const WelcomeItem = (props) => (
  <Grid
    {...props}
    sx={{
      textAlign: "left",
      display: "block",
      justifyContent: "center",
      color: "#34302D",
    }}
  >
    {props.children}
  </Grid>
);

const PText = (props) => (
  <p
    {...props}
    style={{ color: "white", fontSize: "1rem", lineHeight: "1.6rem" }}
  >
    {props.children}
  </p>
);

const SubHeaderText = (props) => (
  <h3
    {...props}
    style={{ color: "white", fontSize: "2rem", lineHeight: "1.2rem" }}
  >
    {props.children}
  </h3>
);

function Home() {
  const { userId } = useUserContext();
  const [userInfo, setUserInfo] = useState(null);
  const [swingCount, setSwingCount] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (userId) {
      fetchUserData(userId).then((data) => setUserInfo(data));
      getAllSwings(userId).then((data) => setSwingCount(data));
    }
  }, [userId]);

  return (
    <Box sx={{ justifyContent: "center", width: "90%" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateAreas: `"account dashboard dashboard dashboard"`,
          gridTemplateRows: "auto",
          columnGap: 3,
        }}
      >
        <Box sx={{ gridArea: "account" }}>
          <ProfileView userInfo={userInfo} swingCount={swingCount} />
        </Box>
        <Box sx={{ gridArea: "dashboard" }}>
          <Container style={{ backgroundColor: "#242424" }}>
            <Grid container>
              <Grid item xs={8}>
                <WelcomeItem>
                  <HeaderText>Dashboard</HeaderText>
                  <SubHeaderText>Some data</SubHeaderText>
                  <PText>
                    Find out where your swing is deviating, and fix your
                    inconsisties with this feature.
                  </PText>
                  <SubHeaderText>
                    Test your swing against the champs
                  </SubHeaderText>
                  <PText>
                    Uncover the secret sauce by putting your's and a pro's swing
                    side-by-side making the differences easier than ever to
                    spot.
                  </PText>
                  <SubHeaderText>Evaluate your swing</SubHeaderText>
                  <PText>
                    Hone in on key swing details such as your swing angle,
                    head-movment, hip-movement, etc.
                  </PText>
                </WelcomeItem>
              </Grid>
              <Grid item xs={4}>
                <img
                  width="auto"
                  style={{ maxHeight: "400px" }}
                  src="/golf_image.png"
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
      <div>
        <NavigationPanel />
      </div>
    </Box>
  );
}

export default Home;
