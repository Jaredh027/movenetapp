import React from "react";
import { Typography } from "@mui/material";

const HeaderText = ({ children }) => {
  return (
    <Typography
      sx={{
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        marginTop: 0,
        color: "white",
        fontSize: "1.5em",
        fontWeight: "bold",
      }}
    >
      {children}
    </Typography>
  );
};

export default HeaderText;
