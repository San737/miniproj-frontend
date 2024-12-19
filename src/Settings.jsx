import React, { useState, useEffect } from "react";
import Input from "./Input";
import EditPanel from './EditPanel';

function Settings({ canvas }) {
    const [selectedObject, setSelectedObject] = useState(null);
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [diameter, setDiameter] = useState("");
    const [color, setColor] = useState("");

    useEffect(() => {
        if (canvas) {
            canvas.on("selection:created", (e) => {
                handleObjectSelection(e.selected[0]);
            });

            canvas.on("selection:updated", (e) => {
                handleObjectSelection(e.selected[0]);
            });

            canvas.on("selection:cleared", () => {
                setSelectedObject(null);
                clearSettings();
            });

            canvas.on("object:modified", (e) => {
                handleObjectSelection(e.target);
            });

            canvas.on("object:scaling", (e) => {
                handleObjectSelection(e.target);
            });
        }
    }, [canvas]);

    const handleObjectSelection = (object) => {
        if (!object) return;

        setSelectedObject(object);

        if (object.type === "rect") {
            setWidth(Math.round(object.width * object.scaleX));
            setHeight(Math.round(object.height * object.scaleY));
            setColor(object.fill);
            setDiameter("");
        } else if (object.type === "circle") {
            setDiameter(Math.round(object.radius * 2 * object.scaleX));
            setColor(object.fill);
            setWidth("");
            setHeight("");
        }
    };

    const clearSettings = () => {
        setWidth("");
        setHeight("");
        setDiameter("");
        setColor("");
    };

    const handleWidthChange = (e) => {
        const value = e.target.value.replace(/,/g, "");
        const intValue = parseInt(value,10);
        setWidth(intValue);

        if (selectedObject) {
            if (selectedObject.type === "rect" && intValue >= 0) {
                selectedObject.set({width: intValue / selectedObject.scaleX});
                canvas.renderAll();
            }
        }
    };

    const handleHeightChange = (e) => {
        const value = e.target.value.replace(/,/g, "");
        const intValue = parseInt(value,10);
        setHeight(intValue);

        if (selectedObject) {
            if (selectedObject.type === "rect" && intValue >= 0) {
                selectedObject.set({height: intValue / selectedObject.scaleY});
                canvas.renderAll();
            }
        }
    };

    const handleDiameterChange = (e) => {
        const value = e.target.value.replace(/,/g, "");
        const intValue = parseInt(value,10);
        setDiameter(intValue);

        if (selectedObject) {
            if (selectedObject.type === "circle" && intValue >= 0) {
                selectedObject.set({radius: intValue / 2 / selectedObject.scaleX});
                canvas.renderAll();
            }
        }
    };

    const handleColorChange = (e) => {
        const value = e.target.value;
        setColor(value);

        if (selectedObject) {
            selectedObject.set({fill: value});
            canvas.renderAll();
        }
    };

    return (
        <EditPanel
          selectedObject={selectedObject}
          width={width}
          height={height}
          diameter={diameter}
          color={color}
          handleWidthChange={handleWidthChange}
          handleHeightChange={handleHeightChange}
          handleDiameterChange={handleDiameterChange}
          handleColorChange={handleColorChange}
        />
      );
}

export default Settings;