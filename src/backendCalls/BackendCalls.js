import axios from "axios";

export const sendSwingData = async (swingData) => {
  const swingDataAndUserId = { ...swingData };
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

export const getSwingData = async (swingName) => {
  try {
    const response = await axios.get("http://127.0.0.1:5001/api/swing-data", {
      params: {
        swing_name: swingName,
      },
    });

    console.log("Swing Data", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching swing data:", error);

    return null;
  }
};

export const getAllSwings = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:5001/api/swings");

    return response.data;
  } catch (error) {
    console.error("Error fetching all swings:", error);
    return [];
  }
};

export const deleteSwing = async (id) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:5001/api/delete-swing",
      { id }
    );

    console.log("Response from server:", response.data);
  } catch (error) {
    console.error("Error deleting swing:", error);
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post("http://127.0.0.1:5001/api/register", {
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
    });

    console.log("Response from server:", response.data);
  } catch (error) {
    console.error("Error registering user:", error);
  }
};
