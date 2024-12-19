import React from 'react';
import Input from './Input';

const EditPanel = ({ 
  selectedObject, 
  width, 
  height, 
  diameter, 
  color,
  handleWidthChange,
  handleHeightChange,
  handleDiameterChange,
  handleColorChange 
}) => {
  if (!selectedObject) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out p-4">
      {selectedObject.type === "rect" && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Width</label>
            <Input
              fluid
              className="mt-1 block w-full"
              value={width}
              onChange={handleWidthChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Height</label>
            <Input
              fluid
              className="mt-1 block w-full"
              value={height}
              onChange={handleHeightChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <input
              type="color"
              className="h-10 w-full rounded cursor-pointer border border-gray-400"
              value={color}
              onChange={handleColorChange}
            />
          </div>
        </>
      )}
      {selectedObject.type === "circle" && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Diameter</label>
            <Input
              fluid
              className="mt-1 block w-full"
              value={diameter}
              onChange={handleDiameterChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <input
              type="color"
              className="h-10 w-full rounded cursor-pointer border border-gray-400"
              value={color}
              onChange={handleColorChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default EditPanel;