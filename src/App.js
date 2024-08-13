import React, { useRef, useEffect, useState } from "react";
import WebcamRender from "./webcamfeed/WebcamRender";
import { Grid, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./home/Home";
import SwingConsistency from "./screens/SwingConsistency";
import CollectSwingVideo from "./screens/CollectSwingVideo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/consistency" element={<SwingConsistency />} />
        <Route path="/recordswing" element={<CollectSwingVideo />} />
      </Routes>
    </Router>
  );
}

export default App;
