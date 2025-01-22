import { Grid, TextField } from "@mui/material";
import { Container } from "../Components/Container";
import HeaderText from "../Components/HeaderText";
import CustomButton from "../Components/CustomButton";
const Login = () => {
  return (
    <div
      style={{
        justifyItems: "center",
      }}
    >
      <Container style={{ width: "20%" }}>
        <HeaderText>Sign in</HeaderText>
        <Grid container flexDirection="column" rowGap={1}>
          <TextField placeholder="Email"></TextField>
          <TextField placeholder="Password"></TextField>
          <CustomButton>Sign in</CustomButton>
        </Grid>
      </Container>
      <HeaderText>
        New to Swing Workshop? <a href="/signup">create account</a>
      </HeaderText>
    </div>
  );
};

export default Login;
