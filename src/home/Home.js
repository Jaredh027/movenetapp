import React from "react";
import { ReactComponent as Target } from "../icons/target.svg";
import NavigationPanel from "../Components/NavigationPanel";
import { Grid } from "@mui/material";
import { Container } from "../Components/Container";
import HeaderText from "../Components/HeaderText";

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
  return (
    <>
      <Grid
        container
        sx={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          width: "90%",
        }}
      >
        <Grid item sx={{ width: "20%" }}>
          <Container style={{ backgroundColor: "#242424" }}>
            <Grid container>
              <Grid item>
                <WelcomeItem>
                  <HeaderText>Welcome Back {}</HeaderText>
                  <SubHeaderText>Compare your swings</SubHeaderText>
                  <PText>
                    Find out where your swing is deviating, and fix your
                    inconsisties with this feature.
                  </PText>
                </WelcomeItem>
              </Grid>
              <Grid item>
                <img
                  width="auto"
                  style={{ maxHeight: "400px" }}
                  src="/golf_image.png"
                />
              </Grid>
            </Grid>
          </Container>
        </Grid>
        <Grid item>
          <Container style={{ backgroundColor: "#242424" }}>
            <Grid container>
              <Grid item xs={8}>
                <WelcomeItem>
                  <HeaderText>Welcome to the Swing Workshop</HeaderText>
                  <SubHeaderText>Compare your swings</SubHeaderText>
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
        </Grid>
      </Grid>
      <NavigationPanel />
    </>
  );
}

export default Home;
