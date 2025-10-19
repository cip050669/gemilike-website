'use client';

import { useState, useRef } from 'react';

interface FileUploadProps {
  id: string;
  name: string;
  accept: string;
  onFileSelect: (file: File) => void;
  placeholder?: string;
  maxSize?: number; // in MB
}

export default function FileUpload({ 
  id, 
  name, 
  accept, 
  onFileSelect, 
  placeholder = "Klicken Sie hier oder ziehen Sie eine Datei hierher",
  maxSize = 10 
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`Datei ist zu groß. Maximale Größe: ${maxSize}MB`);
      return;
    }

    // Check file type
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type;
    
    const isValidType = acceptedTypes.some(type => 
      type === mimeType || 
      type === fileExtension ||
      (type.startsWith('.') && fileExtension === type)
    );

    if (!isValidType) {
      alert(`Dateityp nicht unterstützt. Erlaubte Typen: ${accept}`);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const getFileIcon = () => {
    if (accept.includes('image')) {
      return (
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    return (
      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    );
  };

  const getFileSizeText = () => {
    if (accept.includes('image')) {
      return 'PNG, JPG, GIF bis zu 10MB';
    }
    return `.md, .txt Dateien bis zu ${maxSize}MB`;
  };

  return (
    <div className="space-y-2">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e as any);
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          id={id}
          name={name}
          accept={accept}
          className="hidden"
          onChange={handleFileInputChange}
        />
        <div className="space-y-2">
          {getFileIcon()}
          <p className="text-sm text-gray-600">
            <span 
              className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
              onClick={handleClick}
            >
              {placeholder}
            </span>
          </p>
          <p className="text-xs text-gray-500">{getFileSizeText()}</p>
        </div>
      </div>
      
      {selectedFile && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-green-800">
              Ausgewählt: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
