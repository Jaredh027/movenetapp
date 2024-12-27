import CustomButton from "./CustomButton";
import HeaderText from "./HeaderText";
import CustomPopover from "./CustomPopover";
import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { deleteSwing } from "../backendCalls/BackendCalls";

export const SelectSwing = ({ swingArray, handleSwingSelected }) => {
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
      {swingArray.length > 0 ? (
        <>
          <HeaderText>Select a Swing to Analyze</HeaderText>
          <div style={{ display: "flex", flexDirection: "row", columnGap: 10 }}>
            {swingArray.map((swing) => (
              <CustomButton
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
