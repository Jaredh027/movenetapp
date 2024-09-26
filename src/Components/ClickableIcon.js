import React from "react";
import { Button } from "@mui/material";
import Popover from "@mui/material/Popover";

const ClickableIcon = ({ children, startIcon, popoverContent, ...props }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <>
      <Button
        {...props}
        onClick={handleClick}
        startIcon={
          startIcon ? (
            <span
              style={{
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                marginRight: 0,
                marginLeft: 0,
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
          backgroundColor: "transparent",
          color: "white",
          display: "flex",
          marginBottom: 2,
          fontWeight: "bold",
          alignItems: "center",
          minWidth: 0,
          "& .MuiButton-startIcon": {
            marginRight: 0,
            marginLeft: 0,
          },
        }}
      >
        {children}
      </Button>
      {popoverContent && (
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          sx={{
            left: -30,
            marginTop: 1,
            "& .MuiPaper-root": {
              backgroundColor: "rgba(0,0,0,0.25)", // Change to your desired color
              width: "10%",
              "& .MuiButton-root": {
                fontSize: 10,
                width: "100%",
              },
            },
          }}
        >
          {popoverContent}
        </Popover>
      )}
    </>
  );
};

export default ClickableIcon;
