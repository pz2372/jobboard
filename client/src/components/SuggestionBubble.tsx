import React from "react";
import { PlusIcon } from "lucide-react";

const SuggestionBubble = ({ text, onClick }: any) => {
  return (
    <button
      onClick={() => onClick(text)}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-teal-50 text-teal-600 text-sm border border-dashed border-teal-200 transition-colors"
    >
      <PlusIcon className="w-4 h-4" />
      <span>{text}</span>
    </button>
  );
};

export default SuggestionBubble;
