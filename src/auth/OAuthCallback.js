import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../User_Id_Handling/UserContext";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { setUserId } = useUserContext();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("userId"); // Get the userId from the URL

      if (userId) {
        // Save the userId and token to localStorage
        localStorage.setItem("userId", userId);
        setUserId(userId); // Set userId in context

        // Redirect the user to the dashboard or home page
        navigate("/");
      } else {
        console.error("User ID not found in the URL");
      }
    };

    handleOAuthRedirect();
  }, [navigate, setUserId]);

  return <div>Processing OAuth redirect...</div>;
};

export default OAuthCallback;
