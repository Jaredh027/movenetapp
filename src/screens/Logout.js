import React, { useContext } from "react";
import { UserContext } from "../User_Id_Handling/UserContext";

const LogoutButton = () => {
  const { setUserId } = useContext(UserContext);

  const handleLogout = () => {
    setUserId(null);
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
