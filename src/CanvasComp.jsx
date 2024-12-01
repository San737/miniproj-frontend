import { useState, useEffect, useRef } from "react";
import { Canvas, Rect, Circle } from "fabric";
import { CircleIcon, SquareIcon, TrashIcon } from "lucide-react";

export default function CanvasComp() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 500,
        height: 500,
      });

      initCanvas.backgroundColor = "#fff";
      initCanvas.renderAll();

      setCanvas(initCanvas);

      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  const addRectangle = () => {
    if (canvas) {
      const rect = new Rect({
        top: 100,
        left: 50,
        width: 100,
        height: 60,
        fill: "#ff0000",
        selectable: true,
      });

      canvas.add(rect);
    }
  };

  const addCircle = () => {
    if (canvas) {
      const circle = new Circle({
        top: 150,
        left: 150,
        radius: 50,
        fill: "#ff0000",
      });

      canvas.add(circle);
    }
  };

  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = "#F7F7F7";
      canvas.renderAll();
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 p-4">
      <div className="absolute left-0 top-0 m-4 flex flex-col space-y-4 bg-white p-2 rounded-lg shadow-md">
        <div className="flex flex-col space-y-2">
          <SquareIcon
            onClick={addRectangle}
            className="cursor-pointer hover:text-blue-500 transition-colors"
            size={24}
          />
          <CircleIcon
            onClick={addCircle}
            className="cursor-pointer hover:text-green-500 transition-colors"
            size={24}
          />
          <TrashIcon
            onClick={clearCanvas}
            className="cursor-pointer hover:text-red-500 transition-colors"
            size={24}
          />
        </div>
      </div>

      <div className="flex justify-center items-center min-h-screen">
        <canvas
          ref={canvasRef}
          className="border-4 border-white rounded-lg shadow-xl"
        />
      </div>
    </div>
  );
}
