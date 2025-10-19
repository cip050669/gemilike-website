'use client';

import { useEffect } from 'react';

export default function UploadHandler() {
  useEffect(() => {
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
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
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
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
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

    // Cleanup event listeners on component unmount
    return () => {
      imageDropZone.removeEventListener('dragover', () => {});
      imageDropZone.removeEventListener('dragleave', () => {});
      imageDropZone.removeEventListener('drop', () => {});
      imageDropZone.removeEventListener('click', () => {});
      imageUpload.removeEventListener('change', () => {});
      markdownDropZone.removeEventListener('dragover', () => {});
      markdownDropZone.removeEventListener('dragleave', () => {});
      markdownDropZone.removeEventListener('drop', () => {});
      markdownDropZone.removeEventListener('click', () => {});
      markdownUpload.removeEventListener('change', () => {});
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return null; // This component doesn't render anything itself, it just attaches event listeners
}