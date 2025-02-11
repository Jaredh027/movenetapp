import CustomButton from "./CustomButton";
import HeaderText from "./HeaderText";
import CustomPopover from "./CustomPopover";
import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { deleteSwing } from "../backendCalls/BackendCalls";

export const SelectSwing = ({
  swingArray,
  handleSwingSelected,
  deleteSwingHandler,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dblClickSwing, setdblClickSwing] = useState(null);

  const handleSwingDoubleClick = (swing, event) => {
    setIsOpen(true);
    setdblClickSwing(swing);
  };

  const handleClosePopover = () => {
    setIsOpen(false);
    setAnchorEl(null);
  };

  return (
    <div>
      {swingArray.length > 0 ? (
        <Box sx={{ justifyItems: "center", width: "100%" }}>
          <HeaderText>Swings</HeaderText>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: 10,
              width: "100%",
              alignItems: "center",
              overflow: "auto",
              maxHeight: "60vh",
            }}
          >
            {swingArray.map((swing) => (
              <CustomButton
                style={{ width: "-webkit-fill-available" }}
                key={swing.id}
                onClick={() => handleSwingSelected(swing.swing_name)}
                onContextMenu={(e) => {
                  e.preventDefault(); // Prevent the default browser context menu
                  handleSwingDoubleClick(swing);
                }}
              >
                {swing.swing_name}
              </CustomButton>
            ))}
          </div>
        </Box>
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
