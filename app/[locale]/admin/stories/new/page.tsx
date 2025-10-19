'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function NewStoryPage() {
  useEffect(() => {
    // Warten bis DOM geladen ist
    const initUploads = () => {
      // Bild-Upload Funktionalität
      const imageUpload = document.getElementById('imageUpload') as HTMLInputElement;
      const imageDropZone = imageUpload?.parentElement as HTMLElement;
      
      // Markdown-Upload Funktionalität
      const markdownUpload = document.getElementById('markdownUpload') as HTMLInputElement;
      const markdownDropZone = markdownUpload?.parentElement as HTMLElement;
      const contentTextarea = document.getElementById('content') as HTMLTextAreaElement;

      if (!imageUpload || !imageDropZone || !markdownUpload || !markdownDropZone || !contentTextarea) {
        console.error('Upload elements not found, retrying...');
        setTimeout(initUploads, 100);
        return;
      }

      console.log('Upload elements found, initializing...');

      // Bild-Preview Container erstellen
      const imagePreview = document.createElement('div');
      imagePreview.className = 'mt-2';
      imageDropZone.appendChild(imagePreview);

      // Drag & Drop Events für Bild-Upload
      const handleImageDragOver = (e: DragEvent) => {
        e.preventDefault();
        imageDropZone.classList.add('border-blue-400', 'bg-blue-50');
      };

      const handleImageDragLeave = (e: DragEvent) => {
        e.preventDefault();
        imageDropZone.classList.remove('border-blue-400', 'bg-blue-50');
      };

      const handleImageDrop = (e: DragEvent) => {
        e.preventDefault();
        imageDropZone.classList.remove('border-blue-400', 'bg-blue-50');
        
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
          handleImageFile(files[0]);
        }
      };

      const handleImageClick = () => {
        imageUpload.click();
      };

      const handleImageChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          handleImageFile(target.files[0]);
        }
      };

      // Drag & Drop Events für Markdown-Upload
      const handleMarkdownDragOver = (e: DragEvent) => {
        e.preventDefault();
        markdownDropZone.classList.add('border-blue-400', 'bg-blue-50');
      };

      const handleMarkdownDragLeave = (e: DragEvent) => {
        e.preventDefault();
        markdownDropZone.classList.remove('border-blue-400', 'bg-blue-50');
      };

      const handleMarkdownDrop = (e: DragEvent) => {
        e.preventDefault();
        markdownDropZone.classList.remove('border-blue-400', 'bg-blue-50');
        
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
          handleMarkdownFile(files[0]);
        }
      };

      const handleMarkdownClick = () => {
        markdownUpload.click();
      };

      const handleMarkdownChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          handleMarkdownFile(target.files[0]);
        }
      };

      // Event Listeners hinzufügen
      imageDropZone.addEventListener('dragover', handleImageDragOver);
      imageDropZone.addEventListener('dragleave', handleImageDragLeave);
      imageDropZone.addEventListener('drop', handleImageDrop);
      imageDropZone.addEventListener('click', handleImageClick);
      imageUpload.addEventListener('change', handleImageChange);

      markdownDropZone.addEventListener('dragover', handleMarkdownDragOver);
      markdownDropZone.addEventListener('dragleave', handleMarkdownDragLeave);
      markdownDropZone.addEventListener('drop', handleMarkdownDrop);
      markdownDropZone.addEventListener('click', handleMarkdownClick);
      markdownUpload.addEventListener('change', handleMarkdownChange);

      // Bild-Datei verarbeiten
      function handleImageFile(file: File) {
        console.log('Processing image file:', file.name);
        // Datei-Validierung
        if (!file.type.startsWith('image/')) {
          alert('Bitte wählen Sie eine Bilddatei aus (PNG, JPG, GIF)');
          return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB
          alert('Die Datei ist zu groß. Maximal 10MB erlaubt.');
          return;
        }

        // Bild-Preview anzeigen
        const reader = new FileReader();
        reader.onload = function(e) {
          imagePreview.innerHTML = `
            <div class="mt-2">
              <p class="text-sm text-gray-600 mb-2">Ausgewähltes Bild:</p>
              <img src="${e.target?.result}" alt="Preview" class="h-32 w-32 object-cover rounded border" />
              <p class="text-xs text-gray-500 mt-1">${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</p>
            </div>
          `;
        };
        reader.readAsDataURL(file);
      }

      // Markdown-Datei verarbeiten
      function handleMarkdownFile(file: File) {
        console.log('Processing markdown file:', file.name);
        // Datei-Validierung
        const allowedExtensions = ['.md', '.txt'];
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        
        if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
          alert('Bitte wählen Sie eine Markdown- oder Textdatei aus (.md, .txt)');
          return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
          alert('Die Datei ist zu groß. Maximal 5MB erlaubt.');
          return;
        }

        // Markdown-Inhalt einlesen
        const reader = new FileReader();
        reader.onload = function(e) {
          if (e.target?.result) {
            console.log('Setting content textarea value');
            contentTextarea.value = e.target.result as string;
            contentTextarea.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Erfolgsmeldung
            const successMsg = document.createElement('div');
            successMsg.className = 'mt-2 p-2 bg-green-100 text-green-800 text-sm rounded';
            successMsg.textContent = `Markdown-Datei "${file.name}" erfolgreich geladen (${(file.size / 1024).toFixed(1)} KB)`;
            markdownDropZone.appendChild(successMsg);
            
            // Nach 3 Sekunden entfernen
            setTimeout(() => {
              successMsg.remove();
            }, 3000);
          }
        };
        reader.readAsText(file);
      }

      // Cleanup function
      return () => {
        imageDropZone.removeEventListener('dragover', handleImageDragOver);
        imageDropZone.removeEventListener('dragleave', handleImageDragLeave);
        imageDropZone.removeEventListener('drop', handleImageDrop);
        imageDropZone.removeEventListener('click', handleImageClick);
        imageUpload.removeEventListener('change', handleImageChange);
        markdownDropZone.removeEventListener('dragover', handleMarkdownDragOver);
        markdownDropZone.removeEventListener('dragleave', handleMarkdownDragLeave);
        markdownDropZone.removeEventListener('drop', handleMarkdownDrop);
        markdownDropZone.removeEventListener('click', handleMarkdownClick);
        markdownUpload.removeEventListener('change', handleMarkdownChange);
      };
    };

    const cleanup = initUploads();
    return cleanup;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Neue Story</h1>
              <p className="text-gray-600">Erstellen Sie eine neue Story</p>
            </div>
            <Link
              href="/de/admin/stories"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
            >
              ← Zurück
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form action="/api/admin/stories" method="POST" className="space-y-6" encType="multipart/form-data" onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            fetch('/api/admin/stories', {
              method: 'POST',
              body: formData,
            }).then(response => {
              if (response.ok) {
                window.location.href = '/de/admin/stories';
              } else {
                alert('Fehler beim Erstellen der Story');
              }
            }).catch(error => {
              console.error('Error:', error);
              alert('Fehler beim Erstellen der Story');
            });
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Titel */}
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Titel *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Geben Sie hier den Titel der Story ein..."
                  required
                />
              </div>

              {/* Autor */}
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  Autor *
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Name des Autors"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Entwurf</option>
                  <option value="published">Veröffentlicht</option>
                  <option value="archived">Archiviert</option>
                </select>
              </div>

              {/* Bild-Upload */}
              <div>
                <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-2">
                  Bild-Upload
                </label>
                <div className="space-y-2">
                  <div 
                    className="border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer border-gray-300 hover:border-gray-400"
                  >
                    <input
                      type="file"
                      id="imageUpload"
                      name="imageUpload"
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                          Klicken Sie hier oder ziehen Sie ein Bild hierher
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF bis zu 10MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inhalt */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Inhalt *
                </label>
                <div className="flex gap-2">
                  <div className="space-y-2">
                    <div 
                      className="border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer border-gray-300 hover:border-gray-400"
                    >
                      <input
                        type="file"
                        id="markdownUpload"
                        name="markdownUpload"
                        accept=".md,.txt"
                        className="hidden"
                      />
                      <div className="space-y-2">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                            📄 Markdown-Datei hochladen
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">.md, .txt Dateien bis zu 5MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <textarea
                id="content"
                name="content"
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Schreiben Sie hier die Geschichte oder laden Sie eine Markdown-Datei hoch..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Tipp: Sie können eine .md oder .txt Datei hochladen, um den Inhalt automatisch zu füllen
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Link
                href="/de/admin/stories"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Abbrechen
              </Link>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Story erstellen
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}