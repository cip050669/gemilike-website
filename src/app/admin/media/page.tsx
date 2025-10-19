'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminCard from '@/components/admin/AdminCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  Search, 
  Filter,
  Image as ImageIcon,
  Video,
  File,
  Trash2,
  Download,
  Eye,
  Folder,
  FolderPlus
} from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: number;
  url: string;
  thumbnail?: string;
  uploadedAt: string;
  tags: string[];
  category: string;
}

export default function MediaAdmin() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const categories = [
    'Produktbilder',
    'Hero-Bilder',
    'Blog-Bilder',
    'Icons',
    'Dokumente',
    'Videos'
  ];

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  useEffect(() => {
    filterFiles();
  }, [mediaFiles, searchTerm, filterType, filterCategory]);

  const fetchMediaFiles = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    const mockFiles: MediaFile[] = [
      {
        id: '1',
        name: 'sapphire-hero.jpg',
        type: 'image',
        size: 2048576,
        url: '/images/sapphire-hero.jpg',
        thumbnail: '/images/sapphire-hero-thumb.jpg',
        uploadedAt: '2024-01-20',
        tags: ['hero', 'sapphire', 'blue'],
        category: 'Hero-Bilder'
      },
      {
        id: '2',
        name: 'emerald-collection.jpg',
        type: 'image',
        size: 1536000,
        url: '/images/emerald-collection.jpg',
        thumbnail: '/images/emerald-collection-thumb.jpg',
        uploadedAt: '2024-01-18',
        tags: ['emerald', 'collection', 'green'],
        category: 'Produktbilder'
      },
      {
        id: '3',
        name: 'gemstone-guide.pdf',
        type: 'document',
        size: 5120000,
        url: '/documents/gemstone-guide.pdf',
        uploadedAt: '2024-01-15',
        tags: ['guide', 'documentation'],
        category: 'Dokumente'
      },
      {
        id: '4',
        name: 'gemstone-video.mp4',
        type: 'video',
        size: 25600000,
        url: '/videos/gemstone-video.mp4',
        thumbnail: '/videos/gemstone-video-thumb.jpg',
        uploadedAt: '2024-01-12',
        tags: ['video', 'tutorial'],
        category: 'Videos'
      }
    ];

    setMediaFiles(mockFiles);
    setLoading(false);
  };

  const filterFiles = () => {
    let filtered = mediaFiles;

    if (searchTerm) {
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(file => file.type === filterType);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(file => file.category === filterCategory);
    }

    setFilteredFiles(filtered);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newFile: MediaFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'document',
          size: file.size,
          url: URL.createObjectURL(file),
          uploadedAt: new Date().toISOString().split('T')[0],
          tags: [],
          category: 'Produktbilder'
        };
        setMediaFiles([...mediaFiles, newFile]);
      });
    }
  };

  const handleDeleteFile = (fileId: string) => {
    if (confirm('Sind Sie sicher, dass Sie diese Datei löschen möchten?')) {
      setMediaFiles(mediaFiles.filter(file => file.id !== fileId));
    }
  };

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
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
      case 'video': return <Video className="w-6 h-6 text-purple-500" />;
      case 'document': return <File className="w-6 h-6 text-green-500" />;
      default: return <File className="w-6 h-6 text-gray-500" />;
    }
  };

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
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
        description="Verwalten Sie Bilder, Videos und Dokumente für Ihre Website."
        actions={
          <>
            <Button variant="outline" onClick={() => setShowUploadModal(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Dateien hochladen
            </Button>
            <Button>
              <FolderPlus className="w-4 h-4 mr-2" />
              Ordner erstellen
            </Button>
          </>
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
            <Label htmlFor="type">Dateityp</Label>
            <select
              id="type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">Alle Typen</option>
              <option value="image">Bilder</option>
              <option value="video">Videos</option>
              <option value="document">Dokumente</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="category">Kategorie</Label>
            <select
              id="category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">Alle Kategorien</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
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

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFiles.map((file) => (
          <AdminCard key={file.id} title="">
            <div className="space-y-4">
              {/* File Preview */}
              <div className="relative h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                {file.thumbnail ? (
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
                
                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => handleSelectFile(file.id)}
                    className="w-4 h-4 text-blue-600 bg-white rounded border-gray-300"
                  />
                </div>
                
                {/* File Type Badge */}
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                    {file.type.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* File Info */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2 truncate">
                  {file.name}
                </h3>
                
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Größe:</span>
                    <span>{formatFileSize(file.size)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Kategorie:</span>
                    <span>{file.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Hochgeladen:</span>
                    <span>{new Date(file.uploadedAt).toLocaleDateString('de-DE')}</span>
                  </div>
                </div>

                {/* Tags */}
                {file.tags.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {file.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Ansehen
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteFile(file.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Dateien hochladen</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="fileUpload" className="text-sm font-medium">Dateien auswählen</Label>
                <input
                  id="fileUpload"
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="w-full mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="uploadCategory" className="text-sm font-medium">Kategorie</Label>
                <select
                  id="uploadCategory"
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm mt-1"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                Abbrechen
              </Button>
              <Button onClick={() => setShowUploadModal(false)}>
                Hochladen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
