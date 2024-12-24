import CustomButton from "./CustomButton";
import HeaderText from "./HeaderText";

export const SelectSwing = ({ swingArray, handleSwingSelected }) => {
  return (
    <div>
      {swingArray.length > 0 ? (
        <>
          <HeaderText>Select a Swing to Analyze</HeaderText>
          <div style={{ display: "flex", flexDirection: "row", columnGap: 10 }}>
            {swingArray.map((swing) => (
              <CustomButton
                key={swing.swing_id}
                onClick={() => handleSwingSelected(swing.swing_name)}
              >
                {swing.swing_name}
              </CustomButton>
            ))}
          </div>
        </>
      ) : (
        <h2>Upload a Swing First</h2>
      )}
    </div>
  );
};
