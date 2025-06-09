import React, { useRef, useEffect, useState } from "react";
import Slider from "@mui/material/Slider";

function FindFramesHelper({
  keypointsData,
  keypointsData2,
  showHeadData,
  showPathData,
}) {
  const canvasRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [value, setValue] = useState(0);

  // ── path refs buffer points without triggering renders ──
  const headPathRef = useRef([]); // ← updated
  const pathPathRef = useRef([]); // ← updated

  const [smoothingLevel, setSmoothingLevel] = useState(0);
  const [interpolatedData, setInterpolatedData] = useState(null);
  const [interpolatedData2, setInterpolatedData2] = useState(null);

  // reset paths when a new swing is chosen
  useEffect(() => {
    headPathRef.current = []; // ← updated
    pathPathRef.current = []; // ← updated

    if (keypointsData && keypointsData.length > 1) {
      setInterpolatedData(interpolateFrames(keypointsData, 2));
    }
    if (keypointsData2 && keypointsData2.length > 1) {
      setInterpolatedData2(interpolateFrames(keypointsData2, 2));
    }
  }, [keypointsData, keypointsData2]);

  // ── frame interpolation helper ──
  const interpolateFrames = (frames, numIntermediateFrames) => {
    if (!frames || frames.length < 2) return frames;
    const result = [];

    for (let i = 0; i < frames.length - 1; i++) {
      result.push(frames[i]);
      const a = frames[i][0];
      const b = frames[i + 1][0];

      for (let j = 1; j <= numIntermediateFrames; j++) {
        const r = j / (numIntermediateFrames + 1);
        result.push([
          a.map((p, k) =>
            !b[k]
              ? p
              : {
                  joint_index: p.joint_index,
                  x: p.x + (b[k].x - p.x) * r,
                  y: p.y + (b[k].y - p.y) * r,
                  score: p.score + (b[k].score - p.score) * r,
                }
          ),
        ]);
      }
    }
    result.push(frames[frames.length - 1]);
    return result;
  };

  // ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const videoWidth = 1280;
    const videoHeight = 720;
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    const keypointConnections = {
      0: [1, 2],
      1: [3],
      2: [4],
      5: [6, 7, 11],
      6: [8, 12],
      7: [9],
      8: [10],
      11: [12, 13],
      12: [14],
      13: [15],
      14: [16],
    };

    const drawKeypoints = (keypoints, color) => {
      if (!keypoints) return;
      keypoints.forEach(({ x, y, score }, idx) => {
        if (score > 0.2) {
          const sx = (x / 800) * videoWidth + videoWidth / 2;
          const sy = videoHeight - (y / 450) * videoHeight;

          ctx.beginPath();
          ctx.arc(sx, sy, 4, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();

          keypointConnections[idx]?.forEach((j) => {
            const k2 = keypoints[j];
            if (k2 && k2.score > 0.2) {
              const sx2 = (k2.x / 800) * videoWidth + videoWidth / 2;
              const sy2 = videoHeight - (k2.y / 450) * videoHeight;
              ctx.beginPath();
              ctx.moveTo(sx, sy);
              ctx.lineTo(sx2, sy2);
              ctx.strokeStyle = "darkgray";
              ctx.lineWidth = 2;
              ctx.stroke();
            }
          });
        }
      });
    };

    const drawSmoothCurve = (ctx, pts, colour) => {
      if (pts.length < 3) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].scaledX, pts[0].scaledY);
      for (let i = 1; i < pts.length - 2; i++) {
        const xc = (pts[i].scaledX + pts[i + 1].scaledX) / 2;
        const yc = (pts[i].scaledY + pts[i + 1].scaledY) / 2;
        ctx.quadraticCurveTo(pts[i].scaledX, pts[i].scaledY, xc, yc);
      }
      ctx.quadraticCurveTo(
        pts[pts.length - 2].scaledX,
        pts[pts.length - 2].scaledY,
        pts[pts.length - 1].scaledX,
        pts[pts.length - 1].scaledY
      );
      ctx.lineWidth = 3;
      ctx.strokeStyle = colour;
      ctx.stroke();
    };

    // ── start of draw cycle ──
    ctx.clearRect(0, 0, videoWidth, videoHeight);

    const data1 = interpolatedData || keypointsData;
    const data2 = interpolatedData2 || keypointsData2;
    const kpFrame1 = data1?.[currentFrame]?.[0];

    if (kpFrame1) drawKeypoints(kpFrame1, "red");
    if (data2) {
      const kpFrame2 = data2[currentFrame]?.[0];
      if (kpFrame2) drawKeypoints(kpFrame2, "blue");
    }

    // ── collect path points without triggering React renders ──
    if (showHeadData && kpFrame1) {
      const h = kpFrame1[0];
      if (h?.score > 0.3) {
        headPathRef.current.push({
          scaledX: (h.x / 800) * videoWidth + videoWidth / 2,
          scaledY: videoHeight - (h.y / 450) * videoHeight,
        });
      }
    }

    if (showPathData && kpFrame1) {
      const p = kpFrame1[9];
      if (p) {
        pathPathRef.current.push({
          scaledX: (p.x / 800) * videoWidth + videoWidth / 2,
          scaledY: videoHeight - (p.y / 450) * videoHeight,
        });
      }
    }

    // ── draw the full paths from the refs ──
    drawSmoothCurve(ctx, headPathRef.current, "green");
    drawSmoothCurve(ctx, pathPathRef.current, "blue");

    // ── keyboard controls ──
    const handleKeyDown = (e) => {
      const max = data1.length;
      if (e.key === "ArrowRight") {
        setCurrentFrame((f) => (f + 1) % max);
        setValue((v) => (v + 1) % max);
      } else if (e.key === "ArrowLeft") {
        setCurrentFrame((f) => (f === 0 ? max - 1 : f - 1));
        setValue((v) => (v === 0 ? max - 1 : v - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // ───────────────────────
  }, [
    keypointsData,
    keypointsData2,
    interpolatedData,
    interpolatedData2,
    currentFrame,
    showHeadData,
    showPathData, // ← head/path refs don’t need to be in deps
  ]);

  const handleSliderChange = (_, newVal) => {
    setValue(newVal);
    setCurrentFrame(newVal);
  };

  const maxVal = (interpolatedData || keypointsData || []).length - 1;

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          maxWidth: "1280px",
          display: "block",
          margin: "0 auto",
          borderRadius: 2,
          backgroundColor: "lightblue",
        }}
      />
      <Slider
        value={value}
        onChange={handleSliderChange}
        max={maxVal}
        sx={{ mt: 3, width: "80%", mx: "auto" }}
      />
    </div>
  );
}

export default FindFramesHelper;
