import React, { useState, useEffect } from "react";
import Input from "./Input";

function CanvasSettings({ canvas }) {
  const [canvasHeight, setCanvasHeight] = useState("500");
  const [canvasWidth, setCanvasWidth] = useState("500");

  useEffect(() => {
    if (canvas) {
      const width = canvasWidth === "" ? 0 : parseInt(canvasWidth, 10);
      const height = canvasHeight === "" ? 0 : parseInt(canvasHeight, 10);

      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.renderAll();
    }
  }, [canvasHeight, canvasWidth, canvas]);

  const handleCanvasWidthChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    if (value === "" || parseInt(value, 10) >= 0) {
      setCanvasWidth(value);
    }
  };

  const handleCanvasHeightChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    if (value === "" || parseInt(value, 10) >= 0) {
      setCanvasHeight(value);
    }
  };

  return (
    <div className="settings darkmode p-4">
      <div className="w-48 space-y-4">
        <Input
          label="Canvas Width"
          value={String(canvasWidth)}
          onChange={handleCanvasWidthChange}
          className="w-full"
        />
        <Input
          label="Canvas Height" 
          value={String(canvasHeight)}
          onChange={handleCanvasHeightChange}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default CanvasSettings;