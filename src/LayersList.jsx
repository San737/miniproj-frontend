import React, { useState, useEffect} from "react";
import { Canvas } from "fabric";
import EditPanel from './EditPanel';
import { ChevronUp, ChevronDown } from 'lucide-react';

function LayersList({ canvas }) {
    const [layers, setLayers] = useState([]);
    const [selectedLayer, setSelectedLayer] = useState(null);

    const moveSelectedLayer = (direction) => {
        if(!selectedLayer) return;

        const objects = canvas.getObjects();
        const obj = objects.find((object) => object.id === selectedLayer); 

        if(obj){
            const currentIndex = objects.indexOf(obj);

            if(direction === "up" && currentIndex > 0) { // Changed condition
                // Swap with previous object (higher in visual stack)
                const temp = objects[currentIndex];
                objects[currentIndex] = objects[currentIndex - 1];
                objects[currentIndex - 1] = temp;
            } else if(direction === "down" && currentIndex < objects.length - 1) { // Changed condition
                // Swap with next object (lower in visual stack) 
                const temp = objects[currentIndex];
                objects[currentIndex] = objects[currentIndex + 1];
                objects[currentIndex + 1] = temp;
            }

            const backgroundColor = canvas.backgroundColor;
            canvas.clear();

            // Re-add objects to update z-index
            objects.forEach((object, index) => {
                object.zIndex = objects.length - index; // Reverse index for correct stacking
                canvas.add(object);
            });

            canvas.backgroundColor = backgroundColor;
            canvas.setActiveObject(obj);
            canvas.renderAll();
            updateLayers();
        }
    };

    const addIdObject = (object) => {
        if(!object.id){
            const timestamp = new Date().getTime();
            object.id = `${object.type}_${timestamp}`;  
        }
    }

    Canvas.prototype.updateZIndices = function(){
        const objects = this.getObjects();
        objects.forEach((object, index) => {
            addIdObject(object);
            object.zIndex = index;
        });
    };

    const updateLayers = () => {
        if(canvas){
            canvas.updateZIndices();
            const objects = canvas.getObjects()
            .filter(
                (object) =>
                    typeof object.id === "string" &&
                    !(
                        object.id.startsWith("vertical-") || object.id.startsWith("horizontal-")
                    )
            )
            .map((object) => ({
                id: object.id,
                zIndex: object.zIndex,
                type: object.type,
            }));

            setLayers([...objects].reverse());
        }
    };

    const handleObjectSelection = (e) => {
        const selectedObject = e.selected ? e.selected[0] : null;

        if(selectedObject){
            setSelectedLayer(selectedObject.id);
        }else{
            setSelectedLayer(null);
        }
    };

    const selectLayersInCanvas = (id) => {
        const object = canvas.getObjects().find((object) => object.id === id);
        if(object){
            canvas.setActiveObject(object);
            canvas.renderAll();
        }
    };

    useEffect(() => {
        if(canvas){
            canvas.on("object:added", updateLayers);
            canvas.on("object:removed", updateLayers);
            canvas.on("object:modified", updateLayers);

            canvas.on("selection:created", handleObjectSelection);
            canvas.on("selection:updated", handleObjectSelection);
            canvas.on("selection:cleared", () => setSelectedLayer(null));

            updateLayers();

            return () => {
                canvas.off("object:added", updateLayers);
                canvas.off("object:removed", updateLayers);
                canvas.off("object:modified", updateLayers);
                canvas.off("selection:created", handleObjectSelection);
                canvas.off("selection:updated", handleObjectSelection);
                canvas.off("selection:cleared", () => setSelectedLayer(null));
            };
        }
    }, [canvas]);

    return (
        <div className="flex">
            <EditPanel />
            <div className="fixed right-4 top-80 h-auto w-48 bg-white shadow-lg transform transition-transform duration-300 ease-in-out p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Layers</h3>
                <div className="p-4 border rounded bg-gray-100">
                    <ul className="space-y-2">
                        {layers.map((layer, index) => (
                            <li
                                key={index}
                                className={`p-2 border rounded cursor-pointer ${
                                    selectedLayer === layer.id ? 'bg-blue-500 text-white' : 'bg-white text-black'
                                }`}
                                onClick={() => selectLayersInCanvas(layer.id)}
                            >
                                {layer.type}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 flex justify-between">
                        <button
                            className="bg-blue-500 text-white p-2 rounded flex items-center"
                            onClick={() => moveSelectedLayer('up')}
                            disabled={!selectedLayer || layers.findIndex(layer => layer.id === selectedLayer) === layers.length - 1}
                        >
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                            className="bg-blue-500 text-white p-2 rounded flex items-center"
                            onClick={() => moveSelectedLayer('down')}
                            disabled={!selectedLayer || layers.findIndex(layer => layer.id === selectedLayer) === 0}
                        >
                            <ChevronUp className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LayersList;