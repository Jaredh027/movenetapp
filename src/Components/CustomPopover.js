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

export default CustomPopover;
