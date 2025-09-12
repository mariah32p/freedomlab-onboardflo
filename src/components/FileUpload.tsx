import React, { useState, useRef } from 'react';
import { Upload, X, File, Check, AlertCircle, Download } from 'lucide-react';
import { uploadFile, validateFile, getSignedUrl, UploadResult } from '../lib/storage';

interface FileUploadProps {
  value?: string; // JSON string of uploaded files
  onChange: (value: string) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  folder?: string; // Storage folder
  placeholder?: string;
  disabled?: boolean;
}

interface UploadedFile {
  name: string;
  url: string;
  path: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export default function FileUpload({
  value = '',
  onChange,
  acceptedTypes,
  maxSize = 10,
  multiple = true,
  folder,
  placeholder = 'Drop files here or click to upload',
  disabled = false
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse current files from value
  const uploadedFiles: UploadedFile[] = value ? JSON.parse(value) : [];

  const handleFileSelect = async (files: FileList) => {
    if (disabled) return;
    
    setError(null);
    setUploading(true);

    try {
      const newFiles: UploadedFile[] = [];
      const maxSizeBytes = maxSize * 1024 * 1024;
      
      // Convert acceptedTypes to array
      const allowedTypes = acceptedTypes ? acceptedTypes.split(',').map(t => t.trim()) : undefined;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file
        const validation = validateFile(file, {
          maxSize: maxSizeBytes,
          allowedTypes
        });

        if (!validation.valid) {
          setError(validation.error || 'File validation failed');
          continue;
        }

        try {
          // Upload file to Supabase Storage
          const result = await uploadFile(file, 'customer-files', folder);
          
          if (result.success && result.url && result.path) {
            newFiles.push({
              name: file.name,
              url: result.url,
              path: result.path,
              size: file.size,
              type: file.type,
              uploadedAt: new Date().toISOString()
            });
          } else {
            // If storage upload fails, show error and don't add file
            setError(`Failed to upload "${file.name}": ${result.error || 'Upload failed'}`);
            continue;
          }
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          setError(`Failed to upload "${file.name}": ${uploadError instanceof Error ? uploadError.message : 'Upload failed'}`);
          continue;
        }
      }

      if (newFiles.length > 0) {
        const allFiles = multiple ? [...uploadedFiles, ...newFiles] : newFiles;
        onChange(JSON.stringify(allFiles));
      } else if (files.length > 0) {
        // If no files were successfully uploaded, show a general error
        setError('No files were successfully uploaded. Please try again.');
      }
    } catch (err) {
      console.error('File upload error:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    onChange(JSON.stringify(updatedFiles));
  };

  const downloadFile = async (file: UploadedFile) => {
    try {
      // For public files, use direct URL
      // For private files, get signed URL
      const downloadUrl = await getSignedUrl(file.path, 'customer-files', 3600);
      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
      } else {
        window.open(file.url, '_blank');
      }
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('doc')) return '📝';
    if (type.includes('excel') || type.includes('sheet')) return '📊';
    if (type.includes('powerpoint') || type.includes('presentation')) return '📋';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    if (type.includes('video')) return '🎥';
    if (type.includes('audio')) return '🎵';
    return '📎';
  };

  const isImageFile = (type: string) => type.startsWith('image/');

  const getFileTypeLabel = (type: string) => {
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('word') || type.includes('doc')) return 'Document';
    if (type.includes('excel') || type.includes('sheet')) return 'Spreadsheet';
    if (type.includes('powerpoint') || type.includes('presentation')) return 'Presentation';
    if (type.includes('zip') || type.includes('rar')) return 'Archive';
    if (type.startsWith('image/')) return 'Image';
    if (type.startsWith('video/')) return 'Video';
    if (type.startsWith('audio/')) return 'Audio';
    return 'File';
  };
  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          disabled 
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
            : dragOver
            ? 'border-emerald-400 bg-emerald-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled}
        />
        
        <div className="space-y-2">
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="text-emerald-600 font-medium font-sans">Uploading files...</p>
            </>
          ) : (
            <>
              <Upload className={`h-8 w-8 mx-auto ${disabled ? 'text-gray-400' : 'text-gray-400'}`} />
              <p className={`font-medium font-sans ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
                {placeholder}
              </p>
              {acceptedTypes && (
                <p className="text-xs text-gray-500 font-sans">
                  Accepted formats: {acceptedTypes}
                </p>
              )}
              <p className="text-xs text-gray-500 font-sans">
                Maximum file size: {maxSize}MB
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
          <AlertCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0" />
          <p className="text-red-600 text-sm font-sans">{error}</p>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 font-sans">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-start space-x-4">
                  {/* File Icon/Preview */}
                  <div className="flex-shrink-0">
                    {isImageFile(file.type) ? (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={file.url} 
                          alt={file.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to icon if image fails to load
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling!.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-gray-100 rounded-lg hidden items-center justify-center">
                          <span className="text-2xl">{getFileIcon(file.type)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                        <span className="text-2xl">{getFileIcon(file.type)}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* File Details */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-base truncate font-sans mb-1">
                      {file.name}
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium font-sans">
                        {getFileTypeLabel(file.type)}
                      </span>
                      <span className="font-sans">{formatFileSize(file.size)}</span>
                    </div>
                    <div className="text-xs text-gray-500 font-sans">
                      Uploaded {new Date(file.uploadedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => downloadFile(file)}
                      className="flex items-center space-x-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-sans text-sm font-medium"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    {!disabled && (
                      <button
                        onClick={() => removeFile(index)}
                        className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-sans text-sm font-medium"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}