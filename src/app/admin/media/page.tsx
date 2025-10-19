'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminCard from '@/components/admin/AdminCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  Image as ImageIcon, 
  File, 
  Search, 
  Filter, 
  Trash2, 
  Download,
  Eye,
  Folder,
  FolderOpen,
  Plus
} from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: number;
  url: string;
  thumbnail?: string;
  uploadedAt: string;
  folder: string;
  tags: string[];
}

interface MediaFolder {
  id: string;
  name: string;
  fileCount: number;
  createdAt: string;
}

export default function MediaAdmin() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchMediaData();
  }, []);

  const fetchMediaData = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock media files
    const mockFiles: MediaFile[] = [
      {
        id: '1',
        name: 'sapphire-1.jpg',
        type: 'image',
        size: 2048576, // 2MB
        url: '/media/sapphire-1.jpg',
        thumbnail: '/media/thumbnails/sapphire-1.jpg',
        uploadedAt: '2024-01-20',
        folder: 'products',
        tags: ['sapphire', 'blue', 'gemstone']
      },
      {
        id: '2',
        name: 'emerald-collection.jpg',
        type: 'image',
        size: 3145728, // 3MB
        url: '/media/emerald-collection.jpg',
        thumbnail: '/media/thumbnails/emerald-collection.jpg',
        uploadedAt: '2024-01-18',
        folder: 'products',
        tags: ['emerald', 'green', 'collection']
      },
      {
        id: '3',
        name: 'hero-background.jpg',
        type: 'image',
        size: 5242880, // 5MB
        url: '/media/hero-background.jpg',
        thumbnail: '/media/thumbnails/hero-background.jpg',
        uploadedAt: '2024-01-15',
        folder: 'backgrounds',
        tags: ['hero', 'background', 'banner']
      },
      {
        id: '4',
        name: 'gemstone-guide.pdf',
        type: 'document',
        size: 10485760, // 10MB
        url: '/media/gemstone-guide.pdf',
        uploadedAt: '2024-01-10',
        folder: 'documents',
        tags: ['guide', 'pdf', 'documentation']
      }
    ];

    // Mock folders
    const mockFolders: MediaFolder[] = [
      {
        id: '1',
        name: 'products',
        fileCount: 2,
        createdAt: '2024-01-01'
      },
      {
        id: '2',
        name: 'backgrounds',
        fileCount: 1,
        createdAt: '2024-01-05'
      },
      {
        id: '3',
        name: 'documents',
        fileCount: 1,
        createdAt: '2024-01-10'
      }
    ];

    setMediaFiles(mockFiles);
    setFolders(mockFolders);
    setLoading(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Simulate file upload
      Array.from(files).forEach(file => {
        const newFile: MediaFile = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'document',
          size: file.size,
          url: URL.createObjectURL(file),
          uploadedAt: new Date().toISOString().split('T')[0],
          folder: selectedFolder === 'all' ? 'uploads' : selectedFolder,
          tags: []
        };
        setMediaFiles(prev => [...prev, newFile]);
      });
    }
  };

  const handleDeleteFile = (fileId: string) => {
    if (confirm('Sind Sie sicher, dass Sie diese Datei löschen möchten?')) {
      setMediaFiles(mediaFiles.filter(f => f.id !== fileId));
    }
  };

  const handleDeleteSelected = () => {
    if (confirm(`Sind Sie sicher, dass Sie ${selectedFiles.length} Dateien löschen möchten?`)) {
      setMediaFiles(mediaFiles.filter(f => !selectedFiles.includes(f.id)));
      setSelectedFiles([]);
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
    switch (type) {
      case 'image': return <ImageIcon className="w-6 h-6 text-blue-500" />;
      case 'video': return <File className="w-6 h-6 text-purple-500" />;
      case 'document': return <File className="w-6 h-6 text-gray-500" />;
      default: return <File className="w-6 h-6 text-gray-400" />;
    }
  };

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || file.type === filterType;
    const matchesFolder = selectedFolder === 'all' || file.folder === selectedFolder;
    
    return matchesSearch && matchesType && matchesFolder;
  });

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminHeader
          title="Medien verwalten"
          description="Lade Mediendaten..."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <AdminCard key={i} title="">
              <div className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </AdminCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Medien verwalten"
        description="Verwalten Sie Bilder, Videos und Dokumente."
        actions={
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowUpload(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Hochladen
            </Button>
            {selectedFiles.length > 0 && (
              <Button variant="outline" onClick={handleDeleteSelected}>
                <Trash2 className="w-4 h-4 mr-2" />
                Löschen ({selectedFiles.length})
              </Button>
            )}
          </div>
        }
      />

      {/* Filters */}
      <AdminCard title="Filter und Suche">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="search">Suche</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Dateiname oder Tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="type">Typ</Label>
            <select
              id="type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="all">Alle Typen</option>
              <option value="image">Bilder</option>
              <option value="video">Videos</option>
              <option value="document">Dokumente</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="folder">Ordner</Label>
            <select
              id="folder"
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="all">Alle Ordner</option>
              {folders.map(folder => (
                <option key={folder.id} value={folder.name}>{folder.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <Button variant="outline" className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Filter anwenden
            </Button>
          </div>
        </div>
      </AdminCard>

      {/* Folders */}
      <AdminCard title="Ordner">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div 
            className={`p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              selectedFolder === 'all' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            }`}
            onClick={() => setSelectedFolder('all')}
          >
            <FolderOpen className="w-8 h-8 mx-auto mb-2 text-gray-500" />
            <p className="text-center text-sm font-medium">Alle Dateien</p>
            <p className="text-center text-xs text-gray-500">{mediaFiles.length} Dateien</p>
          </div>
          
          {folders.map(folder => (
            <div 
              key={folder.id}
              className={`p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                selectedFolder === folder.name 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
              onClick={() => setSelectedFolder(folder.name)}
            >
              <Folder className="w-8 h-8 mx-auto mb-2 text-gray-500" />
              <p className="text-center text-sm font-medium">{folder.name}</p>
              <p className="text-center text-xs text-gray-500">{folder.fileCount} Dateien</p>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredFiles.map((file) => (
          <AdminCard key={file.id} title="">
            <div className="space-y-3">
              {/* File Preview */}
              <div className="relative h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                {file.type === 'image' && file.thumbnail ? (
                  <img
                    src={file.thumbnail}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    {getFileIcon(file.type)}
                  </div>
                )}
                
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFiles([...selectedFiles, file.id]);
                      } else {
                        setSelectedFiles(selectedFiles.filter(id => id !== file.id));
                      }
                    }}
                    className="w-4 h-4"
                  />
                </div>
              </div>

              {/* File Info */}
              <div>
                <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(file.size)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(file.uploadedAt).toLocaleDateString('de-DE')}
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-3 h-3" />
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="w-3 h-3" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteFile(file.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Dateien hochladen</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="fileUpload">Dateien auswählen</Label>
                <Input
                  id="fileUpload"
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="uploadFolder">Ordner</Label>
                <select
                  id="uploadFolder"
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 mt-1"
                >
                  {folders.map(folder => (
                    <option key={folder.id} value={folder.name}>{folder.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowUpload(false)}>
                Abbrechen
              </Button>
              <Button onClick={() => setShowUpload(false)}>
                Hochladen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}