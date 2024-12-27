import React from "react";
import Popover from "@mui/material/Popover";

const CustomPopover = ({ anchorEl, open, popoverContent, handleClose }) => {
  return (
    <>
      {popoverContent && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          sx={{
            left: -30,
            marginTop: 1,
            "& .MuiPaper-root": {
              backgroundImage:
                "linear-gradient(to bottom right, #484848, #242424)",
              width: "40%",
              "& .MuiButton-root": {
                fontSize: "1rem",
                width: "100%",
              },
              "& p": {
                fontSize: "1rem",
                width: "100%",
                color: "white",
                textAlign: "center",
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

export default CustomPopover;
