import React from "react";
import { Grid, Button } from "@mui/material";

const CustomButton = ({ children, startIcon, ...props }) => (
  <Button
    {...props}
    startIcon={
      startIcon ? (
        <span
          style={{
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 8,
            color: "#00cc00",
          }}
        >
          {React.cloneElement(startIcon, {
            style: { width: 24, height: 24 },
          })}
        </span>
      ) : null
    }
    sx={{
      textAlign: "center",
      borderRadius: 2,
      backgroundColor: "#bddbe8",
      color: "white",
      display: "flex",
      marginBottom: 2,
      padding: "8px 15px",
      fontWeight: "bold",
      alignItems: "center",
    }}
  >
    {children}
  </Button>
);

export default CustomButton;
