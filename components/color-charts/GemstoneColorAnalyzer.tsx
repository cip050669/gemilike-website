'use client';

import { useState, useRef } from 'react';
import NextImage from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, Loader2, Download, FileText, Save } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { extractColorsFromImage, analyzeImageRegions } from './utils/imageColorExtraction';
import {
  analyzePrimaryColor,
  analyzeSecondaryColors,
  analyzeLuminanceSaturation,
  analyzeSpectralCharacteristic,
  getGIAColorGrade,
  getOverallImpression,
  analyzePleochroism,
  PrimaryColorAnalysis,
  SecondaryColorAnalysis,
  LuminanceSaturationAnalysis,
  SpectralCharacteristic,
  GIAColorGrade,
  OverallImpression,
} from './utils/gemstoneAnalysis';
import { PrimaryColorSection } from './analysis/PrimaryColorSection';
import { SecondaryColorSection } from './analysis/SecondaryColorSection';
import { LuminanceSaturationSection } from './analysis/LuminanceSaturationSection';
import { SpectralCharacteristicSection } from './analysis/SpectralCharacteristicSection';
import { GIAColorGradeSection } from './analysis/GIAColorGradeSection';
import { OverallImpressionSection } from './analysis/OverallImpressionSection';
import { GemstoneImageCrop } from './GemstoneImageCrop';

export function GemstoneColorAnalyzer() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  
  // Analysis results
  const [primaryColor, setPrimaryColor] = useState<PrimaryColorAnalysis | null>(null);
  const [secondaryColors, setSecondaryColors] = useState<SecondaryColorAnalysis[]>([]);
  const [luminanceSaturation, setLuminanceSaturation] = useState<LuminanceSaturationAnalysis | null>(null);
  const [spectralCharacteristic, setSpectralCharacteristic] = useState<SpectralCharacteristic | null>(null);
  const [giaColorGrade, setGIAColorGrade] = useState<GIAColorGrade | null>(null);
  const [overallImpression, setOverallImpression] = useState<OverallImpression | null>(null);
  const [pleochroism, setPleochroism] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedAnalysisId, setSavedAnalysisId] = useState<string | null>(null);
  const [showCropTool, setShowCropTool] = useState(false);
  const [cropRegion, setCropRegion] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        try {
          // Calculate new dimensions
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          // Create canvas and resize
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Use high-quality image scaling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob and then to file
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to create blob'));
                return;
              }
              
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              
              URL.revokeObjectURL(url);
              resolve(resizedFile);
            },
            file.type || 'image/jpeg',
            0.92 // High quality
          );
        } catch (error) {
          URL.revokeObjectURL(url);
          reject(error);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });
  };

  const handleFileSelect = async (file: File) => {
    setAnalysisComplete(false);
    setCropRegion(null);
    setIsResizing(true);
    
    try {
      // Resize image if it exceeds 1800x1200px
      const MAX_WIDTH = 1800;
      const MAX_HEIGHT = 1200;
      
      let processedFile = file;
      let wasResized = false;
      let originalSize = { width: 0, height: 0 };
      let newSize = { width: 0, height: 0 };
      
      // Check if resizing is needed
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          originalSize = { width: img.width, height: img.height };
          
          if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
            URL.revokeObjectURL(url);
            resizeImage(file, MAX_WIDTH, MAX_HEIGHT)
              .then((resized) => {
                processedFile = resized;
                wasResized = true;
                // Get new dimensions
                const resizedImg = new Image();
                const resizedUrl = URL.createObjectURL(resized);
                resizedImg.onload = () => {
                  newSize = { width: resizedImg.width, height: resizedImg.height };
                  URL.revokeObjectURL(resizedUrl);
                  resolve();
                };
                resizedImg.onerror = () => {
                  URL.revokeObjectURL(resizedUrl);
                  resolve();
                };
                resizedImg.src = resizedUrl;
              })
              .catch(reject);
          } else {
            URL.revokeObjectURL(url);
            newSize = originalSize;
            resolve();
          }
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load image'));
        };
        img.src = url;
      });
      
      setImageFile(processedFile);
      
      // Show resize notification if image was resized
      if (wasResized) {
        console.log(`Bild wurde von ${originalSize.width}×${originalSize.height}px auf ${newSize.width}×${newSize.height}px skaliert.`);
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setIsResizing(false);
      };
      reader.readAsDataURL(processedFile);
    } catch (error) {
      console.error('Error processing image:', error);
      setIsResizing(false);
      alert('Fehler beim Verarbeiten des Bildes: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler'));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;

    setIsAnalyzing(true);
    setAnalysisComplete(false);

    try {
      // Extract colors from image (only gemstone pixels, background is automatically filtered)
      const imageAnalysis = await extractColorsFromImage(imageFile, 10000, cropRegion || undefined);
      
      // Analyze regions (only gemstone pixels)
      const regions = await analyzeImageRegions(imageFile, cropRegion || undefined);
      
      // 1. Primary Color Analysis
      const primary = analyzePrimaryColor(imageAnalysis.primaryColor);
      setPrimaryColor(primary);
      
      // 2. Secondary Color Analysis
      const secondary = analyzeSecondaryColors(regions.center, regions.facets, regions.shadows);
      setSecondaryColors(secondary);
      
      // Analyze pleochroism
      const pleochroismResult = analyzePleochroism(regions.center, regions.facets, regions.shadows);
      setPleochroism(pleochroismResult);
      
      // 3. Luminance and Saturation Analysis
      const lumSat = analyzeLuminanceSaturation(
        imageAnalysis.luminance,
        imageAnalysis.saturation,
        imageAnalysis.colorPurity
      );
      setLuminanceSaturation(lumSat);
      
      // 4. Spectral Characteristic
      const spectral = analyzeSpectralCharacteristic(
        imageAnalysis.primaryColor,
        imageAnalysis.secondaryColors
      );
      setSpectralCharacteristic(spectral);
      
      // 5. GIA Color Grade
      const gia = getGIAColorGrade(imageAnalysis.primaryColor, imageAnalysis.saturation);
      setGIAColorGrade(gia);
      
      // 6. Overall Impression
      const overall = getOverallImpression(
        imageAnalysis.primaryColor,
        imageAnalysis.saturation,
        pleochroismResult,
        imageAnalysis.colorPurity
      );
      setOverallImpression(overall);
      
      setAnalysisComplete(true);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Fehler bei der Analyse: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportReport = async () => {
    if (!reportRef.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `gemstone-color-analysis-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export error:', error);
      alert('Fehler beim Exportieren des Berichts');
    }
  };

  const handleExportJSON = () => {
    const report = {
      image: imageFile?.name,
      timestamp: new Date().toISOString(),
      primaryColor,
      secondaryColors,
      luminanceSaturation,
      spectralCharacteristic,
      giaColorGrade,
      overallImpression,
      pleochroism,
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gemstone-analysis-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveAnalysis = async () => {
    if (!analysisComplete || !primaryColor || !overallImpression) {
      alert('Bitte führen Sie zuerst eine Analyse durch.');
      return;
    }

    if (!session?.user) {
      alert('Bitte melden Sie sich an, um Analysen zu speichern.');
      return;
    }

    setIsSaving(true);
    try {
      // Convert image to base64 for storage (or upload to server)
      let imageUrl: string | null = null;
      if (imagePreview) {
        imageUrl = imagePreview; // For now, use base64. In production, upload to server
      }

      const response = await fetch('/api/gemstone-analyses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          imageName: imageFile?.name || null,
          primaryColor,
          secondaryColors,
          luminanceSaturation,
          spectralCharacteristic,
          giaColorGrade,
          overallImpression,
          pleochroism,
          locale: 'de',
          published: false,
          featured: false,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Fehler beim Speichern');
      }

      const result = await response.json();
      setSavedAnalysisId(result.analysis.id);
      alert('Analyse erfolgreich gespeichert!');
    } catch (error) {
      console.error('Error saving analysis:', error);
      alert(`Fehler beim Speichern: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Edelstein-Farbanalyse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-400">
            Laden Sie ein Bild eines Edelsteins hoch, um eine umfassende Farbanalyse durchzuführen.
          </p>

          {/* Image Upload */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-[#9A1A63] transition-colors"
          >
            {isResizing ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 mx-auto animate-spin text-[#9A1A63]" />
                <p className="text-gray-400">Bild wird verarbeitet (max. 1800×1200px)...</p>
              </div>
            ) : imagePreview ? (
              <div className="space-y-4">
                <div className="relative w-full max-w-md mx-auto aspect-video">
                  <NextImage
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <div className="flex gap-2 justify-center flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                      setAnalysisComplete(false);
                      setCropRegion(null);
                    }}
                  >
                    Anderes Bild wählen
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCropTool(true)}
                    disabled={isAnalyzing}
                  >
                    Bereich auswählen
                  </Button>
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="bg-[#9A1A63] hover:bg-[#7a1450]"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analysiere...
                      </>
                    ) : (
                      'Analyse starten'
                    )}
                  </Button>
                </div>
                {cropRegion && (
                  <p className="text-sm text-gray-400 mt-2 text-center">
                    Analyse-Bereich: {Math.round(cropRegion.width)} × {Math.round(cropRegion.height)} px
                  </p>
                )}
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400 mb-2">
                  Ziehen Sie ein Bild hierher oder klicken Sie zum Auswählen
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Bild auswählen
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisComplete && (
        <div ref={reportRef} className="space-y-6 bg-white p-8 rounded-lg">
          {/* Report Header */}
          <div className="border-b-2 border-gray-800 pb-4 mb-6">
            <h2 className="text-3xl font-bold mb-2">Edelstein-Farbanalyse Bericht</h2>
            <p className="text-gray-600">
              Erstellt am: {new Date().toLocaleDateString('de-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            {imagePreview && (
              <div className="mt-4 relative w-full max-w-md mx-auto aspect-video">
                <NextImage
                  src={imagePreview}
                  alt="Analyzed gemstone"
                  fill
                  className="object-contain rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2 mb-6 print:hidden flex-wrap">
            {session?.user && (
              <Button
                onClick={handleSaveAnalysis}
                disabled={isSaving}
                className="flex items-center gap-2 bg-[#9A1A63] hover:bg-[#7a1450]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Speichere...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {savedAnalysisId ? 'Gespeichert' : 'Analyse speichern'}
                  </>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleExportReport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Als Bild exportieren
            </Button>
            <Button
              variant="outline"
              onClick={handleExportJSON}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Als JSON exportieren
            </Button>
            {savedAnalysisId && session?.user && (
              <Button
                variant="outline"
                onClick={() => window.open(`/de/admin/gemstone-analyses/${savedAnalysisId}`, '_blank')}
                className="flex items-center gap-2"
              >
                Im Admin anzeigen
              </Button>
            )}
          </div>

          {/* 1. Primary Color Analysis */}
          {primaryColor && (
            <PrimaryColorSection analysis={primaryColor} />
          )}

          {/* 2. Secondary Color Analysis */}
          {secondaryColors.length > 0 && (
            <SecondaryColorSection
              analysis={secondaryColors}
              pleochroism={pleochroism}
            />
          )}

          {/* 3. Luminance and Saturation Analysis */}
          {luminanceSaturation && (
            <LuminanceSaturationSection analysis={luminanceSaturation} />
          )}

          {/* 4. Spectral Characteristic */}
          {spectralCharacteristic && (
            <SpectralCharacteristicSection analysis={spectralCharacteristic} />
          )}

          {/* 5. GIA Color Grade */}
          {giaColorGrade && (
            <GIAColorGradeSection analysis={giaColorGrade} />
          )}

          {/* 6. Overall Impression */}
          {overallImpression && (
            <OverallImpressionSection analysis={overallImpression} />
          )}
        </div>
      )}

      {/* Crop Tool Modal */}
      {showCropTool && imagePreview && (
        <GemstoneImageCrop
          imageUrl={imagePreview}
          onCrop={(region) => {
            setCropRegion(region);
            setShowCropTool(false);
          }}
          onClose={() => setShowCropTool(false)}
        />
      )}
    </div>
  );
}

