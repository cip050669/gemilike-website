'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function EditStoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStory = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch(`/api/admin/stories/${resolvedParams.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          } else {
            throw new Error('Failed to load story');
          }
        }
        
        const data = await response.json();
        setStory(data.story);
      } catch (error) {
        console.error('Error loading story:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    loadStory();
  }, [params]);

  useEffect(() => {
    // Upload-Funktionalität initialisieren
    const initUploads = () => {
      // Bild-Upload Funktionalität
      const imageUpload = document.getElementById('imageUpload') as HTMLInputElement;
      const imageDropZone = imageUpload?.parentElement as HTMLElement;
      const imagePreview = document.createElement('div');
      imagePreview.className = 'mt-2';
      imageDropZone?.appendChild(imagePreview);

      // Markdown-Upload Funktionalität
      const markdownUpload = document.getElementById('markdownUpload') as HTMLInputElement;
      const markdownDropZone = markdownUpload?.parentElement as HTMLElement;
      const contentTextarea = document.getElementById('content') as HTMLTextAreaElement;

      if (!imageUpload || !imageDropZone || !markdownUpload || !markdownDropZone || !contentTextarea) {
        console.error('One or more upload elements not found.');
        return;
      }

      // Drag & Drop Events für Bild-Upload
      imageDropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        imageDropZone.classList.add('border-blue-400', 'bg-blue-50');
      });

      imageDropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        imageDropZone.classList.remove('border-blue-400', 'bg-blue-50');
      });

      imageDropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        imageDropZone.classList.remove('border-blue-400', 'bg-blue-50');
        
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
          handleImageFile(files[0]);
        }
      });

      // Click Event für Bild-Upload
      imageDropZone.addEventListener('click', function() {
        imageUpload.click();
      });

      // File Change Event für Bild-Upload
      imageUpload.addEventListener('change', function(e) {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          handleImageFile(target.files[0]);
        }
      });

      // Drag & Drop Events für Markdown-Upload
      markdownDropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        markdownDropZone.classList.add('border-blue-400', 'bg-blue-50');
      });

      markdownDropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        markdownDropZone.classList.remove('border-blue-400', 'bg-blue-50');
      });

      markdownDropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        markdownDropZone.classList.remove('border-blue-400', 'bg-blue-50');
        
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
          handleMarkdownFile(files[0]);
        }
      });

      // Click Event für Markdown-Upload
      markdownDropZone.addEventListener('click', function() {
        markdownUpload.click();
      });

      // File Change Event für Markdown-Upload
      markdownUpload.addEventListener('change', function(e) {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          handleMarkdownFile(target.files[0]);
        }
      });

      // Bild-Datei verarbeiten
      function handleImageFile(file: File) {
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
              <p class="text-sm text-gray-300 mb-2">Ausgewähltes Bild:</p>
              <img src="${e.target?.result}" alt="Preview" class="h-32 w-32 object-cover rounded border" />
              <p class="text-xs text-gray-500 mt-1">${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</p>
            </div>
          `;
        };
        reader.readAsDataURL(file);
      }

      // Markdown-Datei verarbeiten
      function handleMarkdownFile(file: File) {
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
    };

    // Warten bis DOM geladen ist
    setTimeout(initUploads, 100);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-300">Lade Story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-800/50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Story nicht gefunden</h1>
          <Link href="/de/admin/stories" className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium">
            ← Zurück zu Stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-white">Story bearbeiten</h1>
              <p className="text-gray-300">Bearbeiten Sie die Story</p>
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
        <div className="bg-gray-800/30 rounded-lg shadow-sm border p-6">
          <form action={`/api/admin/stories/${story.id}`} method="POST" className="space-y-6" encType="multipart/form-data" onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            formData.append('_method', 'PUT');
            fetch(`/api/admin/stories/${story.id}`, {
              method: 'POST',
              body: formData,
            }).then(response => {
              if (response.ok) {
                window.location.href = '/de/admin/stories';
              } else {
                alert('Fehler beim Aktualisieren der Story');
              }
            }).catch(error => {
              console.error('Error:', error);
              alert('Fehler beim Aktualisieren der Story');
            });
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Titel */}
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-2">
                  Titel *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={story.title}
                  required
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Autor */}
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-200 mb-2">
                  Autor *
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  defaultValue={story.author}
                  required
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-200 mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={story.status}
                  required
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Entwurf</option>
                  <option value="published">Veröffentlicht</option>
                  <option value="archived">Archiviert</option>
                </select>
              </div>

              {/* Bild-URL */}
              <div className="md:col-span-2">
                <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-200 mb-2">
                  Bild-Upload
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
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
                    <p className="text-sm text-gray-300">
                      <span className="font-medium text-blue-600 hover:text-blue-500">Klicken Sie hier</span> oder ziehen Sie ein Bild hierher
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF bis zu 10MB</p>
                  </div>
                </div>
                {story.imageUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-300 mb-2">Aktuelles Bild:</p>
                    <img src={story.imageUrl} alt="Current" className="h-32 w-32 object-cover rounded border" />
                  </div>
                )}
              </div>

              {/* Inhalt */}
              <div className="md:col-span-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-200 mb-2">
                  Inhalt *
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer mb-4">
                  <input
                    type="file"
                    id="markdownUpload"
                    name="markdownUpload"
                    accept=".md,.txt"
                    className="hidden"
                  />
                  <div className="space-y-2">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M9 12h6m-6 4h6m2 5H7m5 5v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3m0 0H7m2 0h2m6-5v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3m0 0H7m2 0h2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-sm text-gray-300">
                      <span className="font-medium text-blue-600 hover:text-blue-500">Klicken Sie hier</span> oder ziehen Sie eine Markdown-Datei hierher
                    </p>
                    <p className="text-xs text-gray-500">.md, .txt bis zu 5MB</p>
                  </div>
                </div>
                <textarea
                  id="content"
                  name="content"
                  defaultValue={story.content}
                  required
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Geben Sie den Inhalt der Story ein..."
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Link
                href="/de/admin/stories"
                className="px-6 py-2 border border-gray-600 rounded-md text-gray-200 hover:bg-gray-800/50 font-medium"
              >
                Abbrechen
              </Link>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Story aktualisieren
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
