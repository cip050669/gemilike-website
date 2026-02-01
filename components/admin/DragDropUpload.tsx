'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ImageIcon, Video, Loader2, GripVertical } from 'lucide-react';

interface DragDropUploadProps {
  accept?: 'image' | 'video' | 'both';
  multiple?: boolean;
  maxFiles?: number;
  onUploadComplete: (urls: string[]) => void;
  existingUrls?: string[];
  className?: string;
}

export function DragDropUpload({
  accept = 'both',
  multiple = true,
  maxFiles = 10,
  onUploadComplete,
  existingUrls = [],
  className = '',
}: DragDropUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingUrls);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const same =
      uploadedUrls.length === existingUrls.length &&
      uploadedUrls.every((url, idx) => url === existingUrls[idx]);
    if (!same) {
      setUploadedUrls(existingUrls);
    }
  }, [existingUrls, uploadedUrls]);

  const getAcceptTypes = () => {
    if (accept === 'image') return 'image/*';
    if (accept === 'video') return 'video/*';
    return 'image/*,video/*';
  };

  const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/');
  };

  const isVideoFile = (file: File): boolean => {
    return file.type.startsWith('video/');
  };

  const validateFile = useCallback((file: File): boolean => {
    if (accept === 'image' && !isImageFile(file)) return false;
    if (accept === 'video' && !isVideoFile(file)) return false;
    return true;
  }, [accept]);

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    const fileType = isVideoFile(file) ? 'video' : 'image';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', fileType);

    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress((prev) => ({ ...prev, [file.name]: percentComplete }));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const responseText = xhr.responseText || '{}';
            const response = JSON.parse(responseText);
            if (response && response.success && response.url) {
              resolve(response.url);
            } else {
              const errorMsg = response && typeof response.error === 'string' 
                ? response.error 
                : 'Upload fehlgeschlagen';
              reject(new Error(errorMsg));
            }
          } catch (parseError) {
            console.error('Error parsing response:', parseError, xhr.responseText);
            reject(new Error('Ungültige Serverantwort'));
          }
        } else {
          try {
            const responseText = xhr.responseText || '{}';
            const errorResponse = JSON.parse(responseText);
            const errorMsg = errorResponse && typeof errorResponse.error === 'string'
              ? errorResponse.error
              : `Upload fehlgeschlagen: ${xhr.statusText || 'Unbekannter Fehler'}`;
            reject(new Error(errorMsg));
          } catch (parseError) {
            console.error('Error parsing error response:', parseError, xhr.responseText);
            const statusText = xhr.statusText || 'Unbekannter Fehler';
            reject(new Error(`Upload fehlgeschlagen: ${xhr.status} ${statusText}`));
          }
        }
      });

      xhr.addEventListener('error', (e) => {
        console.error('[DragDropUpload] XHR error:', e);
        reject(new Error('Netzwerkfehler beim Upload'));
      });
      
      xhr.addEventListener('abort', () => {
        console.log('[DragDropUpload] Upload abgebrochen');
        reject(new Error('Upload abgebrochen'));
      });

      xhr.addEventListener('loadend', () => {
        // Clean up progress
        setUploadProgress((prev) => {
          const next = { ...prev };
          delete next[file.name];
          return next;
        });
      });

      try {
        xhr.open('POST', '/api/admin/gemstones/upload');
        xhr.send(formData);
      } catch (sendError) {
        console.error('[DragDropUpload] Error sending request:', sendError);
        reject(new Error('Fehler beim Senden der Datei'));
      }
    });
  }, []);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(validateFile);
    
    if (validFiles.length === 0) {
      alert('Keine gültigen Dateien ausgewählt');
      return;
    }

    const filesToUpload = multiple
      ? validFiles.slice(0, maxFiles - uploadedUrls.length)
      : [validFiles[0]];

    if (filesToUpload.length === 0) {
      alert(`Maximale Anzahl von ${maxFiles} Dateien erreicht`);
      return;
    }

    setUploading(true);
    setUploadProgress({});

    try {
      const uploadPromises = filesToUpload.map((file) => uploadFile(file));
      const urls = await Promise.all(uploadPromises);
      const newUrls = [...uploadedUrls, ...urls];
      setUploadedUrls(newUrls);
      onUploadComplete(newUrls);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Fehler beim Hochladen');
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  }, [multiple, maxFiles, uploadedUrls, onUploadComplete, validateFile, uploadFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
      // Reset input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleFiles]
  );

  const removeUrl = (url: string) => {
    const newUrls = uploadedUrls.filter((u) => u !== url);
    setUploadedUrls(newUrls);
    onUploadComplete(newUrls);
  };

  const moveUrl = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    if (toIndex < 0 || toIndex >= uploadedUrls.length) return;
    const next = [...uploadedUrls];
    const [item] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, item);
    setUploadedUrls(next);
    onUploadComplete(next);
  };

  const getDisplayText = () => {
    if (accept === 'image') return 'Bilder';
    if (accept === 'video') return 'Videos';
    return 'Bilder und Videos';
  };

  return (
    <div className={className}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
          }
          ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptTypes()}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          {uploading ? (
            <>
              <Loader2 className="w-12 h-12 text-cyan-300 animate-spin" />
              <p className="text-gray-300">Upload läuft...</p>
            </>
          ) : (
            <>
              <div className="flex gap-4">
                {accept !== 'video' && (
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                )}
                {accept !== 'image' && (
                  <Video className="w-12 h-12 text-gray-400" />
                )}
                {accept === 'both' && (
                  <>
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                    <Video className="w-12 h-12 text-gray-400" />
                  </>
                )}
              </div>
              <div>
                <p className="text-white font-medium mb-1">
                  {isDragging ? 'Dateien hier ablegen' : `Ziehen Sie ${getDisplayText()} hierher`}
                </p>
                <p className="text-gray-400 text-sm">
                  oder klicken Sie zum Auswählen
                </p>
                {maxFiles > 1 && (
                  <p className="text-gray-500 text-xs mt-2">
                    Max. {maxFiles} Dateien ({uploadedUrls.length}/{maxFiles} verwendet)
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mt-4 space-y-2">
          {Object.entries(uploadProgress).map(([filename, progress]) => (
            <div key={filename} className="space-y-1">
              <div className="flex justify-between text-sm text-gray-400">
                <span>{filename}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files Preview */}
      {uploadedUrls.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">
            Hochgeladene {getDisplayText()} ({uploadedUrls.length})
          </h4>
          <p className="text-xs text-gray-500 mb-3">
            Reihenfolge per Drag & Drop ändern, Löschen über das X.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {uploadedUrls.map((url, index) => {
              const isVideo = url.includes('.mp4') || url.includes('.mov') || url.includes('.webm') || url.includes('.avi');
              return (
                <div key={index} className="flex flex-col gap-2">
                  <div
                    className={`relative group aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-700 ${
                      dragIndex === index ? 'ring-2 ring-blue-400' : ''
                    }`}
                    draggable
                    onDragStart={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.closest('button')) {
                        e.preventDefault();
                        return;
                      }
                      setDragIndex(index);
                    }}
                    onDragEnd={() => setDragIndex(null)}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={() => {
                      if (dragIndex === null) return;
                      moveUrl(dragIndex, index);
                      setDragIndex(null);
                    }}
                  >
                  {isVideo ? (
                    <video
                      src={url}
                      className="w-full h-full object-cover"
                      controls={false}
                      muted
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 left-2 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  {isVideo && (
                    <div className="absolute bottom-2 left-2">
                      <Video className="w-4 h-4 text-white drop-shadow-lg" />
                    </div>
                  )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeUrl(url)}
                    className="w-full rounded-md bg-red-600/90 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700"
                    title="Entfernen"
                  >
                    Bild löschen
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
