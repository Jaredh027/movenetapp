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
      backgroundImage: "linear-gradient(to bottom right, #484848, #242424)",
      padding: "2.5rem",
      borderRadius: 2,
      opacity: 0.9,
    }}
  >
    {props.children}
  </Grid>
);
