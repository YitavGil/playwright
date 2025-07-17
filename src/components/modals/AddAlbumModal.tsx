import React, { useState, useRef } from "react";
import { X, Upload } from 'lucide-react';
import LoadingSpinner from "../common/LoadingSpinner";
import { type Album } from "../../types/Album";

interface AddAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (album: Album) => void;
}

interface FormData {
  name: string;
  band: string;
  year: string;
  image: File | null;
}

interface FormErrors {
  name?: string;
  band?: string;
  year?: string;
  image?: string;
}

const AddAlbumModal: React.FC<AddAlbumModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    band: '',
    year: '',
    image: null
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Album name is required';
    }
    
    if (!formData.band.trim()) {
      newErrors.band = 'Band name is required';
    }
    
    if (!formData.year) {
      newErrors.year = 'Year is required';
    } else if (!/^\d{4}$/.test(formData.year)) {
      newErrors.year = 'Year must be a 4-digit number';
    } else if (parseInt(formData.year) < 1900 || parseInt(formData.year) > new Date().getFullYear()) {
      newErrors.year = 'Year must be between 1900 and current year';
    }
    
    if (!formData.image) {
      newErrors.image = 'Album image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setErrors({...errors, image: 'Please select a PNG or JPEG image'});
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setFormData({...formData, image: file});
      setErrors({...errors, image: ''});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAlbum: Album = {
      id: Date.now(),
      name: formData.name,
      band: formData.band,
      year: parseInt(formData.year),
      image: imagePreview || `https://via.placeholder.com/100x100/FFB6C1/FFFFFF?text=${encodeURIComponent(formData.name)}`
    };
    
    onAdd(newAlbum);
    onClose();
    
    // Reset form
    setFormData({ name: '', band: '', year: '', image: null });
    setImagePreview(null);
    setErrors({});
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="add-modal">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" data-testid="add-modal-title">Add New Album</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            data-testid="close-add-modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Album Name *
            </label>
            <input
              type="text"
              data-testid="album-name-input"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1" data-testid="name-error">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Band Name *
            </label>
            <input
              type="text"
              data-testid="band-name-input"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.band ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.band}
              onChange={(e) => setFormData({...formData, band: e.target.value})}
            />
            {errors.band && <p className="text-red-500 text-sm mt-1" data-testid="band-error">{errors.band}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year Released *
            </label>
            <input
              type="number"
              data-testid="year-input"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.year ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
              min="1900"
              max={new Date().getFullYear()}
            />
            {errors.year && <p className="text-red-500 text-sm mt-1" data-testid="year-error">{errors.year}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Album Image * (PNG/JPEG)
            </label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                data-testid="upload-image-button"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </button>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded"
                  data-testid="image-preview"
                />
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleImageChange}
              className="hidden"
              data-testid="image-input"
            />
            {errors.image && <p className="text-red-500 text-sm mt-1" data-testid="image-error">{errors.image}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              data-testid="cancel-add-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              data-testid="submit-add-button"
              onClick={handleSubmit}
            >
              {isLoading ? <LoadingSpinner /> : 'Add Album'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAlbumModal;