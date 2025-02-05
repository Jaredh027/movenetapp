import { TextField } from "@mui/material";

const TypeField = ({ children, ...props }) => {
  return (
    <input
      {...props}
      style={{
        textAlign: "center",
        backgroundColor: "transparent",
        borderRadius: "8px",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "white",
        color: "white",
        display: "flex",
        marginBottom: "16px",
        padding: "8px 15px",
        fontWeight: "bold",
        alignItems: "center",
        "&:hover": {
          borderColor: "rgba(0,204,0,0.5)",
        },
      }}
    >
      {children}
    </input>
  );
};

export default TypeField;
