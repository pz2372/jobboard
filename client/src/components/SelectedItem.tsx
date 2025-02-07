import React from "react";
import { X } from "lucide-react";

const SelectedItem = ({ text, onRemove, isEditMode }: any) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-600 text-sm border border-solid border-teal-300">
      <span>{text}</span>
      {isEditMode && (
        <button
          onClick={() => onRemove(text)}
          className="hover:bg-teal-100 rounded-full p-1 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

export default SelectedItem;
