import axios from "axios";

export const sendSwingData = async (swingData, userId) => {
  const swingDataAndUserId = { ...swingData, userId };
  console.log(swingDataAndUserId);
  try {
    const response = await axios.post(
      "http://127.0.0.1:5001/api/swing-data",
      swingDataAndUserId
    );
    console.log("Response from server:", response.data);
  } catch (error) {
    console.error("Error sending swing data:", error);
  }
};

export const getSwingData = async (swingName, userId) => {
  try {
    const response = await axios.get("http://127.0.0.1:5001/api/swing-data", {
      params: {
        swing_name: swingName,
        userId: userId,
      },
    });

    console.log("Swing Data", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching swing data:", error);

    return null;
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

// export const registerUser = async (userData) => {
//   try {
//     const response = await axios.post("http://127.0.0.1:5001/api/register", {
//       email: userData.email,
//       password: userData.password,
//       firstName: userData.firstName,
//     });

//     console.log("Response from server:", response.data);
//   } catch (error) {
//     console.error("Error registering user:", error);
//   }
// };

export const fetchUserData = async (userId) => {
  try {
    const response = await fetch(`http://localhost:5001/api/user/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export const getAllSwings = async (userId) => {
  try {
    console.log(userId);
    const response = await fetch(`http://127.0.0.1:5001/api/swings/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all swings:", error);
    return [];
  }
};
