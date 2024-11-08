import React, { useState } from 'react';
import { Upload, AlertTriangle, CheckCircle } from 'lucide-react';
import { analyzeDamage } from '../utils/imageAnalysis';

interface ImageUploadProps {
  onUpload: (url: string, analysis: any) => void;
  label: string;
  showAnalysis?: boolean;
}

export default function ImageUpload({ onUpload, label, showAnalysis = false }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setAnalysis(null);
    setLoading(true);

    try {
      // Create a temporary URL for the uploaded file
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      
      // Analyze the image for damage
      const damageAnalysis = await analyzeDamage(url);
      setAnalysis(damageAnalysis);
      onUpload(url, damageAnalysis);
    } catch (err) {
      setError('Error processing image. Please try again.');
      console.error('Error processing image:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
          id={`file-upload-${label}`}
          disabled={loading}
        />
        <label
          htmlFor={`file-upload-${label}`}
          className={`flex items-center justify-center w-full h-32 transition bg-white border-2 border-dashed rounded-md appearance-none cursor-pointer hover:border-blue-400 focus:outline-none ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
              <span>Processing...</span>
            </div>
          ) : imageUrl ? (
            <img 
              src={imageUrl} 
              alt={label} 
              className="h-full w-full object-cover rounded-md"
            />
          ) : (
            <div className="flex items-center space-x-2">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-500">Upload image</span>
            </div>
          )}
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {showAnalysis && analysis && !error && (
        <div className={`mt-2 p-2 rounded-md ${
          analysis.hasDamage ? 'bg-red-50' : 'bg-green-50'
        }`}>
          <div className="flex items-center space-x-2">
            {analysis.hasDamage ? (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            <span className={`text-sm ${
              analysis.hasDamage ? 'text-red-700' : 'text-green-700'
            }`}>
              {analysis.hasDamage
                ? `Damage detected (${analysis.severity} severity)`
                : 'No damage detected'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}