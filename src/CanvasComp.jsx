import { useState, useEffect, useRef } from "react";
import * as fabric from "fabric";
import { Canvas, Rect, Circle } from "fabric";
import { CircleIcon, SquareIcon, TrashIcon, Image } from "lucide-react";
import Settings from "./Settings";
import CanvasSettings from "./CanvasSettings";
import { HandleObjectMoving, clearGuidelines } from "./SnappingHelpers";

export default function CanvasComp() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [guidelines, setGuidelines] = useState([]);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 500,
        height: 500,
      });

      initCanvas.backgroundColor = "#fff";
      initCanvas.renderAll();

      setCanvas(initCanvas);

      initCanvas.on("object:moving", (e) =>
        HandleObjectMoving(initCanvas, e.target, guidelines, setGuidelines)
      );

      initCanvas.on("selection:modified", () =>
        clearGuidelines(initCanvas, guidelines, setGuidelines)
      );

      initCanvas.on("selection:cleared", () =>
        clearGuidelines(initCanvas, guidelines, setGuidelines)
        );

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

  const deleteComponent = () => {
    if (canvas) {
      const activeObjects = canvas.getActiveObjects();
      if (activeObjects.length) {
        activeObjects.forEach((obj) => {
          canvas.remove(obj);
        });
        canvas.discardActiveObject();
      }
    }
  };

  const handleAddImage = (e) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const imageElement = new window.Image();
      imageElement.src = event.target.result;
      imageElement.onload = function () {
        const image = new fabric.Image(imageElement);
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        const scaleX = canvasWidth / imageElement.width;
        const scaleY = canvasHeight / imageElement.height;
        const scale = Math.min(scaleX, scaleY);

        image.set({
          scaleX: scale,
          scaleY: scale,
        });

        canvas.add(image);
        canvas.centerObject(image);
        canvas.renderAll();
      };
    };
    reader.readAsDataURL(e.target.files[0]);
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
            onClick={deleteComponent}
            className="cursor-pointer hover:text-red-500 transition-colors"
            size={24}
          />
          <Image
            onClick={() => document.getElementById('imageInput').click()}
            className="cursor-pointer hover:text-blue-500 transition-colors"
            size={24}
          />
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleAddImage}
            className="hidden"
          />
        </div>
      </div>

      <div className="flex justify-center items-center min-h-screen">
        <canvas
          ref={canvasRef}
          className="border-4 border-white rounded-lg shadow-xl"
        />
        <Settings canvas={canvas} />
        <CanvasSettings canvas={canvas} />
      </div>
    </div>
  );
}
