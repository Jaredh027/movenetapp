import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UserProvider } from "./User_Id_Handling/UserContext";
import { Header } from "./Components/Header";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <Header />
      <div
        style={{
          position: "absolute",
          margin: "1.5rem",
          justifyItems: "center",
          width: "100%",
        }}
      >
        <App />
      </div>
    </UserProvider>
  </React.StrictMode>
);

reportWebVitals();
