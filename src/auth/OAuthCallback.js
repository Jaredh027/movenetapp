import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        try {
          // Send the authorization code to your backend
          const response = await axios.post(
            "http://localhost:5001/api/oauth/callback",
            {
              code,
            }
          );

          // Handle the response (e.g., save the token, log in user)
          const { token } = response.data;
          localStorage.setItem("authToken", token);

          // Redirect the user to the home/dashboard page
          navigate("/dashboard");
        } catch (error) {
          console.error("OAuth callback failed:", error);
        }
      } else {
        console.error("Authorization code not found in the URL");
      }
    };

    handleOAuthRedirect();
  }, [navigate]);

  return <div>Processing OAuth redirect...</div>;
};

export default OAuthCallback;
