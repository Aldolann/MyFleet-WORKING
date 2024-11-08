import React, { useState } from 'react';
import { Image as ImageIcon, Trash2 } from 'lucide-react';
import { deletePhoto } from '../services/photoUpload';
import PhotoViewer from './PhotoViewer';

interface PhotoGalleryProps {
  photos: string[];
  onDelete?: (url: string) => void;
  className?: string;
}

export default function PhotoGallery({
  photos,
  onDelete,
  className = '',
}: PhotoGalleryProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const handleDelete = async (url: string) => {
    try {
      await deletePhoto(url);
      onDelete?.(url);
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const openPhotoViewer = (index: number) => {
    setSelectedPhotoIndex(index);
    setViewerOpen(true);
  };

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg">
        <div className="text-center">
          <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">No photos available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
        {photos.map((url, index) => (
          <div key={url} className="relative group">
            <img
              src={url}
              alt={`Photo ${index + 1}`}
              className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-90"
              onClick={() => openPhotoViewer(index)}
            />
            {onDelete && (
              <button
                onClick={() => handleDelete(url)}
                className="absolute top-2 right-2 p-2 bg-red-100 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {viewerOpen && (
        <PhotoViewer
          photos={photos}
          initialIndex={selectedPhotoIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  );
}