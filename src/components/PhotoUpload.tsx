import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadPhoto, deletePhoto } from '../services/photoUpload';

interface PhotoUploadProps {
  vehicleId: string;
  folder: string;
  onUpload: (url: string) => void;
  onDelete?: (url: string) => void;
  existingUrl?: string;
  maxSize?: number; // in MB
}

export default function PhotoUpload({
  vehicleId,
  folder,
  onUpload,
  onDelete,
  existingUrl,
  maxSize = 5,
}: PhotoUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(existingUrl || null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Upload to S3
      const url = await uploadPhoto(file, folder, vehicleId);
      onUpload(url);

      // Cleanup preview URL
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setError('Failed to upload photo');
      setPreview(null);
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  }, [vehicleId, folder, maxSize, onUpload]);

  const handleDelete = useCallback(async () => {
    if (!preview || !onDelete) return;

    setLoading(true);
    try {
      await deletePhoto(preview);
      onDelete(preview);
      setPreview(null);
    } catch (err) {
      setError('Failed to delete photo');
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  }, [preview, onDelete]);

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id={`photo-upload-${vehicleId}`}
        disabled={loading}
      />

      <label
        htmlFor={`photo-upload-${vehicleId}`}
        className={`flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          preview
            ? 'border-transparent'
            : 'border-gray-300 hover:border-blue-400'
        } ${loading ? 'opacity-50 cursor-wait' : ''}`}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
            <span className="text-sm text-gray-500">
              {preview ? 'Uploading...' : 'Processing...'}
            </span>
          </div>
        ) : preview ? (
          <div className="relative w-full h-full">
            <img
              src={preview}
              alt="Upload preview"
              className="w-full h-full object-cover rounded-lg"
            />
            {onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
                className="absolute top-2 right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 bg-blue-50 rounded-full">
              <Upload className="h-6 w-6 text-blue-500" />
            </div>
            <span className="text-sm text-gray-500">
              Click or drag photo to upload
            </span>
          </div>
        )}
      </label>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}