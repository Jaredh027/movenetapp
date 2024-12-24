import { Grid } from "@mui/material";

export const Container = (props) => (
  <Grid
    {...props}
    sx={{
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      color: "#34302D",
      alignItems: "center",
      flexDirection: "column",
      backgroundColor: "#6699cc",
      padding: "20px",
      borderRadius: 2,
    }}
  >
    {props.children}
  </Grid>
);
