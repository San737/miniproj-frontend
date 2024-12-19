import { useState, useEffect, useRef } from "react";
import * as fabric from "fabric";
import { Canvas, Rect, Circle, Textbox } from "fabric";
import {
  CircleIcon,
  SquareIcon,
  TrashIcon,
  Image,
  TypeIcon,
  DownloadIcon,
} from "lucide-react";
import Settings from "./Settings";
import CanvasSettings from "./CanvasSettings";
import { HandleObjectMoving, clearGuidelines } from "./SnappingHelpers";
import LayersList from "./LayersList";

export default function CanvasComp() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [guidelines, setGuidelines] = useState([]);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [textStyles, setTextStyles] = useState({
    bold: false,
    italic: false,
    underline: false
  });

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

      initCanvas.on('selection:created', (e) => {
        if (e.target && e.target.type === 'text') {
          setIsTextSelected(true);
          setTextStyles({
            bold: e.target.fontWeight === 'bold',
            italic: e.target.fontStyle === 'italic',
            underline: e.target.underline
          });
        }
      });

      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (canvas) {
      canvas.on('selection:created', (e) => {
        if (e.target && e.target.type === 'textbox') {
          setIsTextSelected(true);
          setTextStyles({
            bold: e.target.fontWeight === 'bold',
            italic: e.target.fontStyle === 'italic',
            underline: e.target.underline
          });
        } else {
          setIsTextSelected(false);
        }
      });

      canvas.on('selection:cleared', () => {
        setIsTextSelected(false);
      });

      canvas.on('selection:updated', (e) => {
        if (e.target && e.target.type === 'textbox') {
          setIsTextSelected(true);
        } else {
          setIsTextSelected(false);
        }
      });
    }
  }, [canvas]);

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

  const addText = () => {
    if (canvas) {
      const text = new Textbox('Type here', {
        left: 50,
        top: 100,
        width: 200,
        fontSize: 20,
        fill: '#000000',
        fontFamily: 'Arial'
      });
      canvas.add(text);
      canvas.renderAll();
    }
  };

  const updateTextStyle = (property, value) => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === 'textbox') {
        activeObject.set(property, value);
        canvas.renderAll();
      }
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

  const exportCanvasAsImage = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1.0,
      });
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas.png";
      link.click();
    }
  };

  const handleTextStyle = (style) => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'text') return;

    switch (style) {
      case 'bold':
        activeObject.set('fontWeight', textStyles.bold ? 'normal' : 'bold');
        setTextStyles(prev => ({ ...prev, bold: !prev.bold }));
        break;
      case 'italic':
        activeObject.set('fontStyle', textStyles.italic ? 'normal' : 'italic');
        setTextStyles(prev => ({ ...prev, italic: !prev.italic }));
        break;
      case 'underline':
        activeObject.set('underline', !textStyles.underline);
        setTextStyles(prev => ({ ...prev, underline: !prev.underline }));
        break;
    }
    canvas.renderAll();
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
          <TypeIcon
            onClick={addText}
            className="cursor-pointer hover:text-red-500 transition-colors"
            size={24}
          />
          <TrashIcon
            onClick={deleteComponent}
            className="cursor-pointer hover:text-red-500 transition-colors"
            size={24}
          />
          <Image
            onClick={() => document.getElementById("imageInput").click()}
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
          <DownloadIcon
            onClick={exportCanvasAsImage}
            className="cursor-pointer hover:text-blue-500 transition-colors"
            size={24}
          />
        </div>
        {isTextSelected && (
          <div className="text-controls flex flex-col space-y-2 mt-4 border-t pt-4">
            <select 
              className="p-1 rounded-md border border-gray-300 text-sm"
              onChange={(e) => updateTextStyle('fontFamily', e.target.value)}
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
            </select>
            <input 
              type="number" 
              defaultValue={20}
              className="p-1 rounded-md border border-gray-300 text-sm w-full"
              onChange={(e) => updateTextStyle('fontSize', parseInt(e.target.value))}
            />
            <input 
              type="color" 
              defaultValue="#000000"
              className="w-full h-8 rounded-md cursor-pointer"
              onChange={(e) => updateTextStyle('fill', e.target.value)}
            />
            <div className="flex space-x-2">
              <button 
                onClick={() => handleTextStyle('bold')}
                disabled={!isTextSelected}
                className={`p-1 rounded-md border border-gray-300 text-sm ${textStyles.bold ? 'font-bold' : ''}`}
              >
                B
              </button>
              <button 
                onClick={() => handleTextStyle('italic')}
                disabled={!isTextSelected}
                className={`p-1 rounded-md border border-gray-300 text-sm ${textStyles.italic ? 'italic' : ''}`}
              >
                I
              </button>
              <button 
                onClick={() => handleTextStyle('underline')}
                disabled={!isTextSelected}
                className={`p-1 rounded-md border border-gray-300 text-sm ${textStyles.underline ? 'underline' : ''}`}
              >
                U
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center min-h-screen">
        <canvas
          ref={canvasRef}
          className="border-4 border-white rounded-lg shadow-xl"
        />
        <Settings canvas={canvas} />
        <CanvasSettings canvas={canvas} />
        <LayersList canvas={canvas} />
      </div>
    </div>
  );
}
