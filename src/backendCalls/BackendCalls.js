import axios from "axios";

export const sendSwingData = async (swingData) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:5001/api/swing-data",
      swingData
    );
    console.log("Response from server:", response.data);
  } catch (error) {
    console.error("Error sending swing data:", error);
  }
};
