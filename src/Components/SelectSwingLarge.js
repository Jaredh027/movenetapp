import CustomButton from "./CustomButton";
import HeaderText from "./HeaderText";
import CustomPopover from "./CustomPopover";
import { useState } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { deleteSwing } from "../backendCalls/BackendCalls";
import Grid2 from "@mui/material/Unstable_Grid2";

export const SelectSwingLarge = ({ swingArray, handleSwingSelected }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dblClickSwing, setdblClickSwing] = useState(null);

  const handleSwingDoubleClick = (swing, event) => {
    setIsOpen(true);
    setdblClickSwing(swing);
  };

  const deleteSwingHandler = () => {
    if (dblClickSwing) {
      // Delete the swing
      deleteSwing(dblClickSwing.id);
    }
  };

  const handleClosePopover = () => {
    setIsOpen(false);
    setAnchorEl(null);
  };

  return (
    <div>
      {swingArray?.length > 0 ? (
        <>
          <HeaderText>Select a swing below</HeaderText>
          <Box sx={{ flexGrow: 1, marginTop: 6 }}>
            <Grid2
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
              justifyContent="center"
            >
              {swingArray.map((swing) => (
                <Grid2 key={swing.id} size={{ xs: 2, sm: 4, md: 4 }}>
                  <CustomButton
                    style={{ minWidth: "20rem" }}
                    onClick={() => handleSwingSelected(swing.swing_name)}
                    onContextMenu={(e) => {
                      e.preventDefault(); // Prevent the default browser context menu
                      handleSwingDoubleClick(swing);
                    }}
                  >
                    {swing.swing_name}
                  </CustomButton>
                </Grid2>
              ))}
            </Grid2>
          </Box>
        </>
      ) : (
        <h2>Upload a Swing First</h2>
      )}
      {isOpen && (
        <CustomPopover
          open={isOpen}
          popoverContent={
            <>
              <p>{dblClickSwing?.swing_name || "No swing selected"}</p>
              <Button
                onClick={() => {
                  handleClosePopover();
                  deleteSwingHandler(dblClickSwing);
                }}
              >
                Delete
              </Button>
            </>
          }
          handleClose={handleClosePopover}
        />
      )}
    </div>
  );
};
