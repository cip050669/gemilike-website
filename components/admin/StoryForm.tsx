'use client';

import { useState, useRef } from 'react';
import FileUpload from './FileUpload';

interface StoryFormProps {
  story?: {
    id: string;
    title: string;
    author: string;
    status: string;
    imageUrl?: string;
    content: string;
  };
  isEdit?: boolean;
}

export default function StoryForm({ story, isEdit = false }: StoryFormProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedMarkdown, setSelectedMarkdown] = useState<File | null>(null);
  const [content, setContent] = useState(story?.content || '');
  const formRef = useRef<HTMLFormElement>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
  };

  const handleMarkdownSelect = (file: File) => {
    setSelectedMarkdown(file);
    
    // Read the markdown file content
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setContent(content);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    const form = formRef.current;
    if (!form) return;

    // Add form fields
    formData.append('title', (form.querySelector('#title') as HTMLInputElement)?.value || '');
    formData.append('author', (form.querySelector('#author') as HTMLInputElement)?.value || '');
    formData.append('status', (form.querySelector('#status') as HTMLSelectElement)?.value || 'draft');
    formData.append('content', content);

    // Add image if selected
    if (selectedImage) {
      formData.append('imageUpload', selectedImage);
    }

    // Add markdown if selected - this will be processed by the API
    if (selectedMarkdown) {
      formData.append('markdownUpload', selectedMarkdown);
      // Also append the content from the markdown file
      formData.append('content', content);
    }

    if (isEdit && story) {
      formData.append('_method', 'PUT');
    }

    try {
      const url = isEdit && story 
        ? `/api/admin/stories/${story.id}`
        : '/api/admin/stories';
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Redirect to stories page
        window.location.href = '/de/admin/stories';
      } else {
        const error = await response.text();
        alert('Fehler beim Speichern: ' + error);
      }
    } catch (error) {
      console.error('Error saving story:', error);
      alert('Fehler beim Speichern der Story');
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {isEdit && <input type="hidden" name="_method" value="PUT" />}
      
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
            defaultValue={story?.title}
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
            defaultValue={story?.author}
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
            defaultValue={story?.status || 'draft'}
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
          <FileUpload
            id="imageUpload"
            name="imageUpload"
            accept="image/*"
            onFileSelect={handleImageSelect}
            placeholder="Klicken Sie hier oder ziehen Sie ein Bild hierher"
            maxSize={10}
          />
          {story?.imageUrl && !selectedImage && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Aktuelles Bild:</p>
              <img src={story.imageUrl} alt="Current" className="mt-1 h-20 w-20 object-cover rounded" />
            </div>
          )}
        </div>
      </div>

      {/* Inhalt */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Inhalt *
          </label>
          <div className="flex gap-2">
            <FileUpload
              id="markdownUpload"
              name="markdownUpload"
              accept=".md,.txt"
              onFileSelect={handleMarkdownSelect}
              placeholder="📄 Markdown-Datei hochladen"
              maxSize={5}
            />
          </div>
        </div>
        <textarea
          id="content"
          name="content"
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
        <a
          href="/de/admin/stories"
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Abbrechen
        </a>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isEdit ? 'Änderungen speichern' : 'Story erstellen'}
        </button>
      </div>
    </form>
  );
}
