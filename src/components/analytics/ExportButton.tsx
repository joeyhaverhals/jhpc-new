import React, { useState } from 'react';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  onExport: (type: 'csv' | 'json') => void;
  label?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  onExport, 
  label = 'Export' 
}) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Download className="h-4 w-4 mr-2" />
        {label}
      </button>

      {showOptions && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            <button
              onClick={() => {
                onExport('csv');
                setShowOptions(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Export as CSV
            </button>
            <button
              onClick={() => {
                onExport('json');
                setShowOptions(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Export as JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButton;
