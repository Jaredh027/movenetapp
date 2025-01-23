import { Grid, TextField } from "@mui/material";
import { Container } from "../Components/Container";
import HeaderText from "../Components/HeaderText";
import CustomButton from "../Components/CustomButton";
const Signup = () => {
  return (
    <div
      style={{
        justifyItems: "center",
      }}
    >
      <Container style={{ width: "20%" }}>
        <HeaderText>Create Account</HeaderText>
        <Grid container flexDirection="column" rowGap={1}>
          <TextField placeholder="Email"></TextField>
          <TextField placeholder="First Name"></TextField>
          <TextField placeholder="Password"></TextField>
          <CustomButton>Create</CustomButton>
        </Grid>
      </Container>
    </div>
  );
};

export default Signup;
