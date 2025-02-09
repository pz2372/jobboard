import React, {useState} from 'react'
import { X, UserCircle } from 'lucide-react';

const UploadModal = ({ isOpen, onClose, onSave }: any) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file) {return}

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
               
        setPreview(reader.result as string);

        
        reader.readAsDataURL(file);
      }
    };

    if (!isOpen) return null;
    return (
      <>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={onClose}
        />
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-xl z-50 w-full max-w-md animate-[slideIn_0.3s_ease-out]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-teal-600">
              Upload Profile Picture
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-teal-50 text-teal-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-teal-200 flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-16 h-16 text-teal-300" />
                )}
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="block w-full px-4 py-2 text-center rounded-full bg-teal-50 text-teal-600 border border-teal-200 hover:bg-teal-100 transition-colors cursor-pointer"
            >
              Choose File
            </label>
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-full border border-teal-200 text-teal-600 hover:bg-teal-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSave(selectedFile);
                  onClose();
                }}
                className="flex-1 px-4 py-2 rounded-full bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                disabled={!selectedFile}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </>)
}

export default UploadModal