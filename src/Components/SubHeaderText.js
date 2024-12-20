import React from "react";
import { Typography } from "@mui/material";

const SubHeaderText = ({ children }) => {
  return (
    <Typography
      sx={{
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        marginTop: 0,
        color: "white",
        fontSize: "1em",
        fontWeight: "bold",
      }}
    >
      {children}
    </Typography>
  );
};

export default SubHeaderText;
