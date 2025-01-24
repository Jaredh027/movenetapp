import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavigationPanel from "../Components/NavigationPanel";
import { Grid } from "@mui/material";
import { Container } from "../Components/Container";
import HeaderText from "../Components/HeaderText";
import Box from "@mui/material/Box";

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
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get("userId");
    if (userId) {
      // Fetch user data or display a personalized message
      fetchUserData(userId);
    }
  }, [location]);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/user/${userId}`);
      const data = await response.json();
      console.log(data);
      setUserInfo(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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
          <Container style={{ backgroundColor: "#242424" }}>
            <Box sx={{ alignContent: "center" }}>
              <Box>
                <p className="HText">Hello {userInfo?.name.split(" ")[0]},</p>
              </Box>
              <Box sx={{ justifyItems: "center", padding: 2 }}>
                {/* Does not work Google blocks this <img
                  crossOrigin="anonymous"
                  width="auto"
                  style={{ maxHeight: "400px" }}
                  src={userInfo?.picture}
                /> */}
                <div
                  style={{
                    backgroundColor: "green",
                    padding: "1rem",
                    borderRadius: "6rem",
                    width: "6rem",
                    height: "6rem",
                    alignContent: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "5rem",
                      margin: 0,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {userInfo?.name[0]}
                  </p>
                </div>
              </Box>
            </Box>
          </Container>
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
