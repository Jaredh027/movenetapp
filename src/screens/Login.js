import { Grid, TextField } from "@mui/material";
import { Container } from "../Components/Container";
import HeaderText from "../Components/HeaderText";
import CustomButton from "../Components/CustomButton";
const Login = () => {
  const handleOAuthLogin = () => {
    window.location.href = "http://localhost:5001/auth/google";
  };

  return (
    <div
      style={{
        justifyItems: "center",
      }}
    >
      <Container style={{ width: "20%" }}>
        <HeaderText>Sign in</HeaderText>
        <Grid container flexDirection="column" rowGap={1}>
          <CustomButton onClick={handleOAuthLogin}>
            Login with Google
          </CustomButton>
        </Grid>
      </Container>
      <HeaderText>
        New to Swing Workshop? <a href="/signup">create account</a>
      </HeaderText>
    </div>
  );
};

export default Login;
