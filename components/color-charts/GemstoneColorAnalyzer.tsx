'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import NextImage from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, Loader2, Download, FileText, Save, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { extractColorsFromImage, analyzeImageRegions, MaskingOptions, DEFAULT_MASKING_OPTIONS, ImageAnalysis } from './utils/imageColorExtraction';
import { Whitepoint } from './utils/colorConversions';
import { extractColorsEnhanced, EnhancedMaskingOptions, EnhancedClusteringOptions, EnhancedAnalysisResult } from './utils/enhancedColorExtraction';
import { parseICCFromFile, ICCProfile } from './utils/iccParser';
import { exportCSV, exportPDF, AnalysisData } from './utils/exportAnalysis';
import {
  analyzePrimaryColor,
  analyzeSecondaryColors,
  analyzeLuminanceSaturation,
  analyzeSpectralCharacteristic,
  getGIAColorGrade,
  getOverallImpressionAsync,
  analyzePleochroism,
  generateOverallImpression,
  generateFinalEvaluation,
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
import { loadOpenCV, applyGrabCut, BrushMode, BrushStroke, RectRegion } from './utils/opencvIntegration';
import type { PaletteComparison } from './utils/paletteComparison';

export function GemstoneColorAnalyzer() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
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
  const [primaryColorLab, setPrimaryColorLab] = useState<{ L: number; a: number; b: number } | null>(null);
  const [currentImageAnalysis, setCurrentImageAnalysis] = useState<ImageAnalysis | EnhancedAnalysisResult | null>(null); // Store current analysis for export
  const [showCropTool, setShowCropTool] = useState(false);
  const [cropRegion, setCropRegion] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [whitepoint, setWhitepoint] = useState<Whitepoint>('D65');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [paletteComparisons, setPaletteComparisons] = useState<PaletteComparison[]>([]);
  const [kValue, setKValue] = useState<number | null>(null); // null = auto, otherwise manual value
  const [maskingOptions, setMaskingOptions] = useState<MaskingOptions>(DEFAULT_MASKING_OPTIONS);
  const [customPalette, setCustomPalette] = useState<string[]>([]);
  const [customPaletteInput, setCustomPaletteInput] = useState<string>('');
  
  // Borderline v4: Neue Parameter
  const [autoK, setAutoK] = useState(true); // Auto-K via GMM+BIC
  const [useSLIC, setUseSLIC] = useState(false); // SLIC Superpixels
  const [slicStep, setSlicStep] = useState(16); // SLIC Superpixel-Größe
  const [slicM, setSlicM] = useState(10); // SLIC Kompaktheit
  const [useGuidedFilter, setUseGuidedFilter] = useState(false); // Guided Filter
  const [guidedR, setGuidedR] = useState(4); // Guided Filter Radius
  const [guidedEps] = useState(1e-3); // Guided Filter Regularisierung
  const [iccInfo, setIccInfo] = useState<ICCProfile | null>(null);
  
  // OpenCV GrabCut state
  const [cvReady, setCvReady] = useState(false);
  const [cvLoadError, setCvLoadError] = useState<string | null>(null);
  const [brushMode, setBrushMode] = useState<BrushMode>('RECT');
  const [brushSize, setBrushSize] = useState(16);
  const [isDrawing, setIsDrawing] = useState(false);
  const [fgStrokes, setFgStrokes] = useState<BrushStroke[]>([]);
  const [bgStrokes, setBgStrokes] = useState<BrushStroke[]>([]);
  const [rectRegion, setRectRegion] = useState<RectRegion | null>(null);
  const [useGrabCut, setUseGrabCut] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Load OpenCV
  const handleLoadOpenCV = useCallback(async () => {
    // Reset error state when attempting to load again
    setCvLoadError(null);
    try {
      const loaded = await loadOpenCV();
      if (loaded) {
        setCvReady(true);
        setCvLoadError(null); // Clear any previous errors
        console.log('OpenCV.js erfolgreich geladen');
      } else {
        // OpenCV konnte nicht geladen werden - deaktiviere GrabCut
        setCvReady(false);
        setUseGrabCut(false);
        setCvLoadError('OpenCV.js konnte nicht von den verfügbaren Quellen geladen werden.');
        console.warn('OpenCV.js konnte nicht geladen werden. Automatische Segmentierung wird verwendet.');
      }
    } catch (error) {
      console.error('Failed to load OpenCV:', error);
      setCvReady(false);
      setUseGrabCut(false);
      setCvLoadError(error instanceof Error ? error.message : 'Unbekannter Fehler beim Laden von OpenCV.js');
      console.warn('OpenCV konnte nicht geladen werden. Automatische Segmentierung wird verwendet.');
    }
  }, []);

  // Borderline v4: ICC Profile Upload Handler
  const handleICCUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const profile = await parseICCFromFile(file);
      setIccInfo(profile);
      
      if (profile.wtpt) {
        console.log('ICC Weißpunkt geladen:', profile.wtpt);
      }
    } catch (error) {
      console.error('Fehler beim Parsen des ICC-Profils:', error);
      alert('Fehler beim Laden des ICC-Profils. Bitte überprüfen Sie die Datei.');
    }
  }, []);

  // Clear strokes and rect
  const clearStrokes = useCallback(() => {
    setFgStrokes([]);
    setBgStrokes([]);
    setRectRegion(null);
    if (overlayRef.current) {
      const ctx = overlayRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
      }
    }
  }, []);

  // Redraw overlay
  const redrawOverlay = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    
    const ctx = overlay.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    
    // Draw rect
    if (rectRegion) {
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.9)';
      ctx.strokeRect(rectRegion.x, rectRegion.y, rectRegion.w, rectRegion.h);
    }
    
    // Draw strokes
    const drawDots = (strokes: BrushStroke[], color: string) => {
      ctx.setLineDash([]);
      ctx.fillStyle = color;
      for (const stroke of strokes) {
        ctx.beginPath();
        ctx.arc(stroke.x, stroke.y, stroke.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    
    drawDots(fgStrokes, 'rgba(22, 163, 74, 0.6)'); // Green for foreground
    drawDots(bgStrokes, 'rgba(239, 68, 68, 0.6)'); // Red for background
  }, [rectRegion, fgStrokes, bgStrokes]);

  // Get mouse position relative to canvas
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = overlayRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Handle canvas mouse down
  const handleCanvasDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!useGrabCut || !cvReady) return;
    
    const pos = getMousePos(e);
    if (!pos) return;

    setIsDrawing(true);

    if (brushMode === 'RECT') {
      // Start rectangle
      setRectRegion({ x: pos.x, y: pos.y, w: 0, h: 0 });
    } else {
      // Add stroke
      const stroke: BrushStroke = {
        x: pos.x,
        y: pos.y,
        r: brushSize,
      };
      
      if (brushMode === 'FG') {
        setFgStrokes(prev => [...prev, stroke]);
      } else if (brushMode === 'BG') {
        setBgStrokes(prev => [...prev, stroke]);
      }
    }
  }, [useGrabCut, cvReady, brushMode, brushSize]);

  // Handle canvas mouse move
  const handleCanvasMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!useGrabCut || !cvReady || !isDrawing) return;
    
    const pos = getMousePos(e);
    if (!pos) return;

    if (brushMode === 'RECT') {
      // Update rectangle
      setRectRegion(prev => {
        if (!prev) return null;
        return {
          x: prev.x,
          y: prev.y,
          w: pos.x - prev.x,
          h: pos.y - prev.y,
        };
      });
    } else {
      // Add stroke while dragging
      const stroke: BrushStroke = {
        x: pos.x,
        y: pos.y,
        r: brushSize,
      };
      
      if (brushMode === 'FG') {
        setFgStrokes(prev => [...prev, stroke]);
      } else if (brushMode === 'BG') {
        setBgStrokes(prev => [...prev, stroke]);
      }
    }
  }, [useGrabCut, cvReady, isDrawing, brushMode, brushSize]);

  // Handle canvas mouse up
  const handleCanvasUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Update overlay when strokes/rect change
  useEffect(() => {
    redrawOverlay();
  }, [redrawOverlay]);

  // Initialize canvas when image preview changes and GrabCut is enabled
  useEffect(() => {
    if (imagePreview && useGrabCut && cvReady && canvasRef.current) {
      const img = new Image();
      img.src = imagePreview;
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const maxWidth = 800;
          const maxHeight = 600;
          const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
          canvas.width = Math.round(img.width * ratio);
          canvas.height = Math.round(img.height * ratio);
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
          
          if (overlayRef.current) {
            overlayRef.current.width = canvas.width;
            overlayRef.current.height = canvas.height;
          }
        }
        clearStrokes();
      };
    }
  }, [imagePreview, useGrabCut, cvReady, clearStrokes]);

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

  const handleFileSelect = async (file: File, index?: number) => {
    setAnalysisComplete(false);
    setCropRegion(null);
    setIsResizing(true);
    clearStrokes(); // Clear GrabCut strokes when switching images
    
    // Update active index if provided
    if (index !== undefined) {
      setActiveImageIndex(index);
    }
    
    try {
      // Resize image if it exceeds 1800x1800px
      const MAX_WIDTH = 1800;
      const MAX_HEIGHT = 1800;
      
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
        const previewUrl = e.target?.result as string;
        setImagePreview(previewUrl);
        
        // Initialize canvas for GrabCut if enabled
        if (useGrabCut && cvReady) {
          const img = new Image();
          img.src = previewUrl;
          img.onload = () => {
            if (canvasRef.current) {
              const canvas = canvasRef.current;
              // Scale to fit container
              const maxWidth = 800;
              const maxHeight = 600;
              const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
              canvas.width = Math.round(img.width * ratio);
              canvas.height = Math.round(img.height * ratio);
              
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              }
              
              if (overlayRef.current) {
                overlayRef.current.width = canvas.width;
                overlayRef.current.height = canvas.height;
              }
            }
            clearStrokes();
          };
        }
        
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
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      setImageFiles(files);
      setActiveImageIndex(0);
      handleFileSelect(files[0], 0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      setImageFiles(files);
      setActiveImageIndex(0);
      handleFileSelect(files[0], 0);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;

    setIsAnalyzing(true);
    setAnalysisComplete(false);

    try {
      // Apply GrabCut if enabled and ready
      let grabCutAlpha: Uint8ClampedArray | undefined = undefined;
      if (useGrabCut && cvReady && imageFile) {
        try {
          // Load original image file (not preview) for accurate GrabCut
          const img = new Image();
          const imgUrl = URL.createObjectURL(imageFile);
          
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              try {
                // Use original image dimensions (may be resized, but we work with actual file)
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                  URL.revokeObjectURL(imgUrl);
                  reject(new Error('Could not get canvas context'));
                  return;
                }
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                // Scale strokes/rect from overlay canvas to original image dimensions
                const overlayCanvas = overlayRef.current;
                if (overlayCanvas) {
                  const scaleX = img.width / overlayCanvas.width;
                  const scaleY = img.height / overlayCanvas.height;
                  
                  const scaledFgStrokes = fgStrokes.map(s => ({
                    x: s.x * scaleX,
                    y: s.y * scaleY,
                    r: s.r * scaleX,
                  }));
                  const scaledBgStrokes = bgStrokes.map(s => ({
                    x: s.x * scaleX,
                    y: s.y * scaleY,
                    r: s.r * scaleX,
                  }));
                  const scaledRect = rectRegion ? {
                    x: rectRegion.x * scaleX,
                    y: rectRegion.y * scaleY,
                    w: rectRegion.w * scaleX,
                    h: rectRegion.h * scaleY,
                  } : null;
                  
                  console.log('GrabCut parameters:', {
                    hasFgStrokes: scaledFgStrokes.length > 0,
                    hasBgStrokes: scaledBgStrokes.length > 0,
                    hasRect: !!scaledRect,
                    rect: scaledRect,
                  });
                  
                  grabCutAlpha = applyGrabCut(imageData, scaledFgStrokes, scaledBgStrokes, scaledRect);
                  
                  if (grabCutAlpha) {
                    console.log('GrabCut erfolgreich, Alpha-Maske erstellt:', grabCutAlpha.length, 'Pixel');
                  } else {
                    console.warn('GrabCut zurückgegeben null - verwende automatische Segmentierung');
                  }
                } else {
                  console.warn('Overlay canvas nicht gefunden - verwende automatische Segmentierung');
                }
                URL.revokeObjectURL(imgUrl);
                resolve();
              } catch (error) {
                console.error('GrabCut Fehler:', error);
                URL.revokeObjectURL(imgUrl);
                reject(error);
              }
            };
            img.onerror = () => {
              URL.revokeObjectURL(imgUrl);
              reject(new Error('Failed to load image'));
            };
            img.src = imgUrl;
          });
        } catch (error) {
          console.error('GrabCut Fehler beim Laden des Bildes:', error);
          // Continue with automatic segmentation
        }
      }

      // Borderline v4: Use enhanced extraction if advanced features are enabled
      const useEnhanced = useSLIC || useGuidedFilter || autoK;
      
      let imageAnalysis;
      let regions;
      
      if (useEnhanced) {
        // Enhanced extraction with Borderline v4 features
        const enhancedMasking: EnhancedMaskingOptions = {
          ...maskingOptions,
          useSLIC,
          slicStep,
          slicM,
          useGuidedFilter,
          guidedR,
          guidedEps,
        };
        
        const enhancedClustering: EnhancedClusteringOptions = {
          useAutoK: autoK,
          autoKMin: 3,
          autoKMax: 8,
          useKMeansPP: true,
          kValue: autoK ? null : kValue,
        };
        
        imageAnalysis = await extractColorsEnhanced(
          imageFile,
          10000,
          cropRegion || undefined,
          whitepoint,
          iccInfo || null,
          enhancedMasking,
          enhancedClustering
        );
        
        // For regions, still use standard extraction (regions analysis doesn't need enhanced features)
        regions = await analyzeImageRegions(imageFile, cropRegion || undefined, whitepoint, kValue, maskingOptions);
      } else {
        // Standard extraction
        imageAnalysis = await extractColorsFromImage(
          imageFile,
          10000,
          cropRegion || undefined,
          whitepoint,
          kValue,
          maskingOptions,
          grabCutAlpha
        );
        
        regions = await analyzeImageRegions(imageFile, cropRegion || undefined, whitepoint, kValue, maskingOptions);
      }
      
      // Validate that we have valid analysis results
      if (!imageAnalysis.primaryColor) {
        throw new Error('Keine Primärfarbe gefunden. Bitte versuchen Sie es mit einem anderen Bild.');
      }
      
      if (!imageAnalysis.primaryColor.lab || !imageAnalysis.primaryColor.hex || !imageAnalysis.primaryColor.rgb) {
        throw new Error('Ungültige Farbdaten. Bitte versuchen Sie es mit einem anderen Bild.');
      }
      
      // 1. Primary Color Analysis
      const primary = analyzePrimaryColor(imageAnalysis.primaryColor);
      setPrimaryColor(primary);
      setPrimaryColorLab(imageAnalysis.primaryColor.lab);
      
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
        imageAnalysis.secondaryColors || []
      );
      setSpectralCharacteristic(spectral);
      
      // 5. GIA Color Grade
      const gia = getGIAColorGrade(imageAnalysis.primaryColor, imageAnalysis.saturation);
      setGIAColorGrade(gia);
      
      // 6. Overall Impression (with learning from corrections and borderline analysis)
      const overall = await getOverallImpressionAsync(
        imageAnalysis.primaryColor,
        imageAnalysis.saturation,
        pleochroismResult,
        imageAnalysis.colorPurity,
        regions.center,
        regions.facets,
        regions.shadows,
        imageAnalysis.allColors // Borderline v4: Pass all colors for hue analysis
      );
      setOverallImpression(overall);
      
      // 7. Palette Comparison (ΔE) - Removed per user request
      // const comparisons = compareToAllPalettes(imageAnalysis.primaryColor.hex, whitepoint, customPalette.length > 0 ? customPalette : undefined);
      // setPaletteComparisons(comparisons);
      setPaletteComparisons([]);
      
      // Store analysis for export
      setCurrentImageAnalysis(imageAnalysis);
      
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

  const handleExportPDF = async () => {
    if (!analysisComplete || !primaryColor) {
      alert('Bitte führen Sie zuerst eine Analyse durch.');
      return;
    }

    try {
      const { exportAnalysisToPDF } = await import('./utils/pdfExport');
      
      await exportAnalysisToPDF({
        imageUrl: imagePreview,
        imageName: imageFile?.name || null,
        timestamp: new Date(),
        whitepoint,
        primaryColor,
        secondaryColors,
        luminanceSaturation,
        spectralCharacteristic,
        giaColorGrade,
        overallImpression,
        paletteComparisons,
      });
    } catch (error) {
      console.error('PDF Export error:', error);
      alert('Fehler beim Exportieren des PDFs: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler'));
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
      pleochroism: overallImpression?.correctedPleochroism || pleochroism,
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
          // Ensure corrected values are included in overallImpression
          overallImpression: {
            ...overallImpression,
            // Preserve corrections if they exist
            correctedVariety: overallImpression?.correctedVariety || undefined,
            correctedPleochroism: overallImpression?.correctedPleochroism || undefined,
          },
          pleochroism: overallImpression?.correctedPleochroism || pleochroism,
          whitepoint,
          kValue: kValue !== null ? kValue : undefined,
          maskingOptions: (() => {
            // Only save if maskingOptions differ from defaults
            const keys: (keyof typeof DEFAULT_MASKING_OPTIONS)[] = ['white', 'black', 'lowSat', 'smart', 'wThr', 'bThr', 'sThr'];
            const hasChanges = keys.some(key => maskingOptions[key] !== DEFAULT_MASKING_OPTIONS[key]);
            return hasChanges ? maskingOptions : undefined;
          })(),
          customPalette: customPalette.length > 0 ? customPalette : undefined,
          paletteComparisons: paletteComparisons.length > 0 ? paletteComparisons : undefined,
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
                <p className="text-gray-400">Bild wird verarbeitet (max. 1800×1800px)...</p>
              </div>
            ) : imagePreview ? (
              <div className="space-y-4">
                {/* Canvas Preview with Overlay (for GrabCut) or Next.js Image */}
                {useGrabCut && cvReady ? (
                  <div className="relative w-full max-w-md mx-auto">
                    <canvas
                      ref={canvasRef}
                      className="block w-full h-auto rounded-lg"
                      style={{ display: 'block' }}
                    />
                    <canvas
                      ref={overlayRef}
                      className="absolute inset-0 w-full h-full cursor-crosshair"
                      onMouseDown={handleCanvasDown}
                      onMouseMove={handleCanvasMove}
                      onMouseUp={handleCanvasUp}
                      onMouseLeave={handleCanvasUp}
                    />
                    <div className="mt-2 text-xs text-gray-400 text-center">
                      {brushMode === 'RECT' ? 'Rechteck ziehen' : brushMode === 'FG' ? 'FG pinseln (grün)' : 'BG pinseln (rot)'}
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full max-w-md mx-auto aspect-video">
                    <NextImage
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                )}
                <div className="flex gap-2 justify-center flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImageFiles([]);
                      setImageFile(null);
                      setImagePreview(null);
                      setAnalysisComplete(false);
                      setCropRegion(null);
                      setActiveImageIndex(0);
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
                
                {/* Multiple images navigation */}
                {imageFiles.length > 1 && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-400 mb-2 text-center">
                      {imageFiles.length} Bild(er) geladen
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2 justify-center flex-wrap">
                      {imageFiles.map((file, i) => (
                        <Button
                          key={i}
                          variant={i === activeImageIndex ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setActiveImageIndex(i);
                            handleFileSelect(file, i);
                          }}
                          disabled={isAnalyzing}
                          className={`text-xs ${i === activeImageIndex ? 'bg-[#9A1A63] hover:bg-[#7a1450]' : ''}`}
                        >
                          {file.name.length > 20 ? `${file.name.substring(0, 20)}...` : file.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400 mb-2">
                  Ziehen Sie ein oder mehrere Bilder hierher oder klicken Sie zum Auswählen
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
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
              </>
            )}
          </div>

          {/* Advanced Settings */}
          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              className="text-gray-400 hover:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Erweiterte Einstellungen
              {showAdvancedSettings ? (
                <ChevronUp className="h-4 w-4 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-2" />
              )}
            </Button>
            
            {showAdvancedSettings && (
              <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300 flex items-center justify-between">
                    <span>Referenz-Weißpunkt (Lab):</span>
                    <select
                      value={whitepoint}
                      onChange={(e) => setWhitepoint(e.target.value as Whitepoint)}
                      className="ml-4 px-3 py-1.5 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#9A1A63]"
                      disabled={isAnalyzing}
                    >
                      <option value="D65">D65 (Standard sRGB)</option>
                      <option value="D50">D50 (ICC/Bradford)</option>
                    </select>
                  </label>
                  <p className="text-xs text-gray-500">
                    D65 ist der Standard für sRGB-Displays. D50 wird für professionelle Druck- und ICC-Profil-Anwendungen verwendet.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-300">
                      Cluster-Anzahl (K):
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-xs text-gray-400">
                        <input
                          type="checkbox"
                          checked={kValue !== null}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setKValue(5); // Default to 5 when enabling
                            } else {
                              setKValue(null); // Auto when disabling
                            }
                          }}
                          disabled={isAnalyzing}
                          className="rounded"
                        />
                        Manuell
                      </label>
                    </div>
                  </div>
                  
                  {kValue !== null ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={3}
                          max={20}
                          value={kValue}
                          onChange={(e) => setKValue(parseInt(e.target.value))}
                          disabled={isAnalyzing}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-300 font-mono w-8 text-right">
                          {kValue}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Anzahl der Farb-Cluster für K-Means-Algorithmus. Höhere Werte = mehr Farbnuancen, aber längere Berechnung.
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Automatisch (adaptiv basierend auf Bildgröße, 3-20 Cluster)
                    </p>
                  )}
                </div>

                {/* Maskierungs-Optionen */}
                <div className="space-y-2 pt-2 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300">Maskierung</h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 text-xs text-gray-400">
                      <input
                        type="checkbox"
                        checked={maskingOptions.white}
                        onChange={(e) => setMaskingOptions({ ...maskingOptions, white: e.target.checked })}
                        disabled={isAnalyzing}
                        className="rounded"
                      />
                      hell/neutral
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-400">
                      <input
                        type="checkbox"
                        checked={maskingOptions.black}
                        onChange={(e) => setMaskingOptions({ ...maskingOptions, black: e.target.checked })}
                        disabled={isAnalyzing}
                        className="rounded"
                      />
                      sehr dunkel
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-400">
                      <input
                        type="checkbox"
                        checked={maskingOptions.lowSat}
                        onChange={(e) => setMaskingOptions({ ...maskingOptions, lowSat: e.target.checked })}
                        disabled={isAnalyzing}
                        className="rounded"
                      />
                      niedrige Sätt.
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-400">
                      <input
                        type="checkbox"
                        checked={maskingOptions.smart}
                        onChange={(e) => setMaskingOptions({ ...maskingOptions, smart: e.target.checked })}
                        disabled={isAnalyzing}
                        className="rounded"
                      />
                      Smart Mask
                    </label>
                  </div>

                  {maskingOptions.white && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400 w-32">Weiß-Schwelle</span>
                      <input
                        type="range"
                        min={180}
                        max={250}
                        value={maskingOptions.wThr}
                        onChange={(e) => setMaskingOptions({ ...maskingOptions, wThr: parseInt(e.target.value) })}
                        disabled={isAnalyzing}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-300 font-mono w-10 text-right">
                        {maskingOptions.wThr}
                      </span>
                    </div>
                  )}

                  {maskingOptions.black && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400 w-32">Schwarz-Schwelle</span>
                      <input
                        type="range"
                        min={0}
                        max={60}
                        value={maskingOptions.bThr}
                        onChange={(e) => setMaskingOptions({ ...maskingOptions, bThr: parseInt(e.target.value) })}
                        disabled={isAnalyzing}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-300 font-mono w-10 text-right">
                        {maskingOptions.bThr}
                      </span>
                    </div>
                  )}

                  {maskingOptions.lowSat && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400 w-32">Sättigungs-Schwelle</span>
                      <input
                        type="range"
                        min={0}
                        max={30}
                        value={maskingOptions.sThr}
                        onChange={(e) => setMaskingOptions({ ...maskingOptions, sThr: parseInt(e.target.value) })}
                        disabled={isAnalyzing}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-300 font-mono w-10 text-right">
                        {maskingOptions.sThr}
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    Kontrolliere, welche Pixel für die Analyse verwendet werden. Anpassung bei schwierigen Bildern.
                  </p>
                </div>

                {/* Borderline v4: Enhanced Features */}
                <div className="space-y-2 pt-2 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300">Borderline v4: Erweiterte Features</h4>
                  
                  {/* Auto-K via GMM+BIC */}
                  <label className="flex items-center gap-2 text-xs text-gray-400">
                    <input
                      type="checkbox"
                      checked={autoK}
                      onChange={(e) => setAutoK(e.target.checked)}
                      disabled={isAnalyzing}
                      className="rounded"
                    />
                    Auto-K via GMM+BIC (automatische Cluster-Anzahl)
                  </label>
                  
                  {/* SLIC Superpixels */}
                  <label className="flex items-center gap-2 text-xs text-gray-400">
                    <input
                      type="checkbox"
                      checked={useSLIC}
                      onChange={(e) => setUseSLIC(e.target.checked)}
                      disabled={isAnalyzing}
                      className="rounded"
                    />
                    SLIC Superpixels (verbesserte Maskierung)
                  </label>
                  
                  {useSLIC && (
                    <div className="ml-6 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-32">Superpixel-Größe</span>
                        <input
                          type="range"
                          min={8}
                          max={32}
                          value={slicStep}
                          onChange={(e) => setSlicStep(parseInt(e.target.value))}
                          disabled={isAnalyzing}
                          className="flex-1"
                        />
                        <span className="text-xs text-gray-300 font-mono w-10 text-right">
                          {slicStep}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-32">Kompaktheit</span>
                        <input
                          type="range"
                          min={5}
                          max={20}
                          value={slicM}
                          onChange={(e) => setSlicM(parseInt(e.target.value))}
                          disabled={isAnalyzing}
                          className="flex-1"
                        />
                        <span className="text-xs text-gray-300 font-mono w-10 text-right">
                          {slicM}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Guided Filter */}
                  <label className="flex items-center gap-2 text-xs text-gray-400">
                    <input
                      type="checkbox"
                      checked={useGuidedFilter}
                      onChange={(e) => setUseGuidedFilter(e.target.checked)}
                      disabled={isAnalyzing}
                      className="rounded"
                    />
                    Guided Filter (Masken-Verfeinerung)
                  </label>
                  
                  {useGuidedFilter && (
                    <div className="ml-6 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-32">Radius</span>
                        <input
                          type="range"
                          min={2}
                          max={8}
                          value={guidedR}
                          onChange={(e) => setGuidedR(parseInt(e.target.value))}
                          disabled={isAnalyzing}
                          className="flex-1"
                        />
                        <span className="text-xs text-gray-300 font-mono w-10 text-right">
                          {guidedR}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* ICC Profile Upload */}
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">ICC-Profil (optional):</label>
                    <input
                      type="file"
                      accept=".icc,.icm"
                      onChange={handleICCUpload}
                      disabled={isAnalyzing}
                      className="text-xs text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#9A1A63] file:text-white hover:file:bg-[#7A1550]"
                    />
                    {iccInfo?.wtpt && (
                      <p className="text-xs text-gray-500">
                        ICC Weißpunkt geladen: X={iccInfo.wtpt[0].toFixed(4)}, Y={iccInfo.wtpt[1].toFixed(4)}, Z={iccInfo.wtpt[2].toFixed(4)}
                      </p>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Erweiterte Algorithmen für präzisere Farbanalyse, besonders bei Borderline-Farben.
                  </p>
                </div>

                {/* Benutzerdefinierte Palette */}
                <div className="space-y-2 pt-2 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300">Benutzerdefinierte Palette</h4>
                  
                  <div className="flex flex-wrap gap-2">
                    {customPalette.map((hex, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded border bg-gray-800 border-gray-600"
                      >
                        <span
                          className="h-4 w-4 rounded border border-gray-500"
                          style={{ backgroundColor: hex }}
                        />
                        <span className="text-xs text-gray-300 font-mono">{hex}</span>
                        <button
                          onClick={() => setCustomPalette(customPalette.filter((_, j) => j !== i))}
                          className="text-xs text-red-400 hover:text-red-300 ml-1"
                          disabled={isAnalyzing}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="#RRGGBB"
                      value={customPaletteInput}
                      onChange={(e) => setCustomPaletteInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const v = customPaletteInput.trim();
                          if (/^#?[0-9a-fA-F]{6}$/i.test(v)) {
                            const hex = v.startsWith('#') ? v.toUpperCase() : `#${v.toUpperCase()}`;
                            if (!customPalette.includes(hex)) {
                              setCustomPalette([...customPalette, hex]);
                              setCustomPaletteInput('');
                            }
                          }
                        }
                      }}
                      disabled={isAnalyzing}
                      className="flex-1 px-2 py-1.5 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#9A1A63] font-mono"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const v = customPaletteInput.trim();
                        if (/^#?[0-9a-fA-F]{6}$/i.test(v)) {
                          const hex = v.startsWith('#') ? v.toUpperCase() : `#${v.toUpperCase()}`;
                          if (!customPalette.includes(hex)) {
                            setCustomPalette([...customPalette, hex]);
                            setCustomPaletteInput('');
                          }
                        }
                      }}
                      disabled={isAnalyzing || !/^#?[0-9a-fA-F]{6}$/i.test(customPaletteInput.trim())}
                      className="text-xs"
                    >
                      + Hinzufügen
                    </Button>
                  </div>

                  {customPalette.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCustomPalette([])}
                      disabled={isAnalyzing}
                      className="text-xs text-gray-400 hover:text-gray-300"
                    >
                      Palette leeren
                    </Button>
                  )}

                  <p className="text-xs text-gray-500">
                    Füge eigene HEX-Farben hinzu, um sie in der Palette-Vergleichs-Analyse zu verwenden.
                  </p>
                </div>

                {/* OpenCV GrabCut Segmentierung */}
                <div className="space-y-2 pt-2 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-300">Segmentierung (GrabCut)</h4>
                    <label className="flex items-center gap-2 text-xs text-gray-400">
                      <input
                        type="checkbox"
                        checked={useGrabCut}
                        onChange={(e) => {
                          setUseGrabCut(e.target.checked);
                          if (e.target.checked && !cvReady) {
                            handleLoadOpenCV();
                          }
                        }}
                        disabled={isAnalyzing}
                        className="rounded"
                      />
                      GrabCut verwenden
                    </label>
                  </div>

                  {useGrabCut && (
                    <>
                      {!cvReady && (
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLoadOpenCV}
                            disabled={isAnalyzing}
                            className="w-full text-xs"
                          >
                            OpenCV.js laden (~8MB)
                          </Button>
                          {cvLoadError ? (
                            <div className="p-2 bg-yellow-900/30 border border-yellow-700 rounded text-xs text-yellow-300">
                              <p className="font-semibold mb-1">⚠️ OpenCV.js konnte nicht geladen werden</p>
                              <p className="text-yellow-400">{cvLoadError}</p>
                              <p className="mt-2 text-yellow-200">
                                Die Analyse verwendet automatisch die Standard-Segmentierung, die für die meisten Fälle ausreichend ist.
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500">
                              OpenCV.js wird dynamisch geladen für präzise Segmentierung.
                              <br />
                              <span className="text-yellow-400">Hinweis:</span> Falls OpenCV.js nicht geladen werden kann, wird automatisch die Standard-Segmentierung verwendet.
                            </p>
                          )}
                        </div>
                      )}
                      {cvReady && (
                        <p className="text-xs text-green-400">
                          ✓ OpenCV.js erfolgreich geladen
                        </p>
                      )}

                      {cvReady && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-400">Werkzeug:</label>
                            <select
                              value={brushMode}
                              onChange={(e) => setBrushMode(e.target.value as BrushMode)}
                              disabled={isAnalyzing}
                              className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#9A1A63]"
                            >
                              <option value="RECT">Rechteck (Init)</option>
                              <option value="FG">Pinsel: Vordergrund</option>
                              <option value="BG">Pinsel: Hintergrund</option>
                            </select>
                          </div>

                          {brushMode !== 'RECT' && (
                            <div className="flex items-center gap-2">
                              <label className="text-xs text-gray-400">Pinselgröße:</label>
                              <input
                                type="range"
                                min={6}
                                max={64}
                                value={brushSize}
                                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                                disabled={isAnalyzing}
                                className="flex-1"
                              />
                              <span className="text-xs text-gray-300 font-mono w-10 text-right">
                                {brushSize}px
                              </span>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={clearStrokes}
                              disabled={isAnalyzing}
                              className="text-xs"
                            >
                              Zurücksetzen
                            </Button>
                            <div className="flex-1 text-xs text-gray-500 flex items-center gap-2">
                              <span className="inline-block w-3 h-3 rounded-full bg-green-500/60"></span>
                              FG: {fgStrokes.length}
                              <span className="inline-block w-3 h-3 rounded-full bg-red-500/60 ml-2"></span>
                              BG: {bgStrokes.length}
                            </div>
                          </div>

                          <p className="text-xs text-gray-500">
                            Markiere Vordergrund (grün) und Hintergrund (rot) für präzise Segmentierung.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
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
              onClick={handleExportPDF}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Als PDF exportieren
            </Button>
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
            {/* Borderline v4: Enhanced Export Buttons */}
            {overallImpression && primaryColor && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (!overallImpression || !primaryColor) return;
                    // Convert to AnalysisData format for export
                    const analysisData: AnalysisData = {
                      width: 0,
                      height: 0,
                      totalPixels: 0,
                      usedPixels: 0,
                      maskRatio: 0,
                      k: kValue || 5,
                      clusters: currentImageAnalysis?.allColors?.slice(0, 5).map(c => ({
                        hex: c.hex,
                        rgb: [c.rgb.r, c.rgb.g, c.rgb.b] as [number, number, number],
                        hsv: [0, 0, 0] as [number, number, number],
                        share: c.percentage / 100,
                      })) || [],
                      hsvStats: {
                        hueMean: 0,
                        satMean: 0,
                        valMean: 0,
                        hueMedian: 0,
                        satMedian: 0,
                        valMedian: 0,
                      },
                      labStats: primaryColorLab ? {
                        Lmean: primaryColorLab.L,
                        aMean: primaryColorLab.a,
                        bMean: primaryColorLab.b,
                        Lmedian: primaryColorLab.L,
                        aMedian: primaryColorLab.a,
                        bMedian: primaryColorLab.b,
                      } : {
                        Lmean: 0,
                        aMean: 0,
                        bMean: 0,
                        Lmedian: 0,
                        aMedian: 0,
                        bMedian: 0,
                      },
                      refDeltaE: {
                        hex: '#000000',
                        dE76: 0,
                        dE2000: 0,
                      },
                      hue: {
                        mean: overallImpression.borderline?.hueMean || 0,
                        R: overallImpression.borderline?.hueR || 0,
                        circVar: 0,
                        sepDeg: overallImpression.borderline?.peakSeparation || 0,
                        category: overallImpression.borderline ? {
                          primary: { name: overallImpression.borderline.primaryCategory, score: overallImpression.borderline.confidence },
                          secondary: overallImpression.borderline.secondaryCategory ? { name: overallImpression.borderline.secondaryCategory, score: 0 } : null,
                          conf: overallImpression.borderline.confidence,
                          borderline: overallImpression.borderline.isBorderline,
                        } : {
                          primary: { name: '', score: 0 },
                          secondary: null,
                          conf: 0,
                          borderline: false,
                        },
                      },
                      borderline: overallImpression.borderline ? {
                        isBorderline: overallImpression.borderline.isBorderline,
                        primaryCategory: overallImpression.borderline.primaryCategory,
                        secondaryCategory: overallImpression.borderline.secondaryCategory,
                        confidence: overallImpression.borderline.confidence,
                        peakSeparation: overallImpression.borderline.peakSeparation,
                      } : undefined,
                    };
                    exportCSV(analysisData);
                  }}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Als CSV exportieren
                </Button>
                {reportRef.current && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!overallImpression || !primaryColor || !reportRef.current) return;
                      const canvas = document.createElement('canvas');
                      canvas.width = 800;
                      canvas.height = 600;
                      const ctx = canvas.getContext('2d');
                      if (ctx && imagePreview) {
                        const img = new Image();
                        img.src = imagePreview;
                        img.onload = () => {
                          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                          const analysisData: AnalysisData = {
                            width: 0,
                            height: 0,
                            totalPixels: 0,
                            usedPixels: 0,
                            maskRatio: 0,
                            k: kValue || 5,
                            clusters: currentImageAnalysis?.allColors?.slice(0, 5).map(c => ({
                              hex: c.hex,
                              rgb: [c.rgb.r, c.rgb.g, c.rgb.b] as [number, number, number],
                              hsv: [0, 0, 0] as [number, number, number],
                              share: c.percentage / 100,
                            })) || [],
                            hsvStats: {
                              hueMean: 0,
                              satMean: 0,
                              valMean: 0,
                              hueMedian: 0,
                              satMedian: 0,
                              valMedian: 0,
                            },
                            labStats: primaryColorLab ? {
                              Lmean: primaryColorLab.L,
                              aMean: primaryColorLab.a,
                              bMean: primaryColorLab.b,
                              Lmedian: primaryColorLab.L,
                              aMedian: primaryColorLab.a,
                              bMedian: primaryColorLab.b,
                            } : {
                              Lmean: 0,
                              aMean: 0,
                              bMean: 0,
                              Lmedian: 0,
                              aMedian: 0,
                              bMedian: 0,
                            },
                            refDeltaE: {
                              hex: '#000000',
                              dE76: 0,
                              dE2000: 0,
                            },
                            hue: {
                              mean: overallImpression.borderline?.hueMean || 0,
                              R: overallImpression.borderline?.hueR || 0,
                              circVar: 0,
                              sepDeg: overallImpression.borderline?.peakSeparation || 0,
                              category: overallImpression.borderline ? {
                                primary: { name: overallImpression.borderline.primaryCategory, score: overallImpression.borderline.confidence },
                                secondary: overallImpression.borderline.secondaryCategory ? { name: overallImpression.borderline.secondaryCategory, score: 0 } : null,
                                conf: overallImpression.borderline.confidence,
                                borderline: overallImpression.borderline.isBorderline,
                              } : {
                                primary: { name: '', score: 0 },
                                secondary: null,
                                conf: 0,
                                borderline: false,
                              },
                            },
                            borderline: overallImpression.borderline ? {
                              isBorderline: overallImpression.borderline.isBorderline,
                              primaryCategory: overallImpression.borderline.primaryCategory,
                              secondaryCategory: overallImpression.borderline.secondaryCategory,
                              confidence: overallImpression.borderline.confidence,
                              peakSeparation: overallImpression.borderline.peakSeparation,
                            } : undefined,
                          };
                          exportPDF(analysisData, canvas);
                        };
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Als PDF (v4) exportieren
                  </Button>
                )}
              </>
            )}
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
              pleochroism={overallImpression?.correctedPleochroism || pleochroism}
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
            <OverallImpressionSection 
              analysis={overallImpression}
              canEdit={true} // Always allow editing for all users
              isLoggedIn={!!session?.user} // Show learning system info only for logged-in users
              onVarietyCorrection={async (correctedVariety: string[]) => {
                // Update local state
                const updatedImpression = {
                  ...overallImpression,
                  correctedVariety,
                };
                setOverallImpression(updatedImpression);
                
                // Check consistency and auto-update pleochroism if needed
                const { suggestPleochroismFromVarieties } = await import('./utils/gemstoneAnalysis');
                const suggestedPleochroism = suggestPleochroismFromVarieties(correctedVariety);
                const currentPleochroismType = (overallImpression.correctedPleochroism || overallImpression.pleochroism || '').toLowerCase().includes('isotrop') ? 'isotrop' : 'anisotrop';
                
                // If pleochroism doesn't match, update it automatically
                if (suggestedPleochroism !== currentPleochroismType) {
                  const newPleochroism = suggestedPleochroism === 'isotrop' 
                    ? 'Isotrop (kein Pleochroismus)' 
                    : 'Anisotrop (Pleochroismus vorhanden)';
                  setPleochroism(newPleochroism);
                  
                  const newOverallImpression = generateOverallImpression(
                    overallImpression.dominantColorTone,
                    overallImpression.saturation,
                    newPleochroism,
                    overallImpression.opticalQuality
                  );
                  const newEvaluation = generateFinalEvaluation(
                    overallImpression.dominantColorTone,
                    overallImpression.saturation,
                    newPleochroism,
                    correctedVariety,
                    overallImpression.opticalQuality
                  );
                  
                  setOverallImpression({
                    ...updatedImpression,
                    correctedPleochroism: newPleochroism,
                    pleochroism: newPleochroism,
                    overallImpression: newOverallImpression,
                    evaluation: newEvaluation,
                  });
                }
                
                // Save correction to API for learning (with both variety and pleochroism)
                if (primaryColorLab && session?.user) {
                  try {
                    const finalPleochroism = suggestedPleochroism === 'isotrop' 
                      ? 'Isotrop (kein Pleochroismus)' 
                      : 'Anisotrop (Pleochroismus vorhanden)';
                    
                    await fetch('/api/gemstone-analyses/corrections', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        lab: primaryColorLab,
                        hex: primaryColor?.hex,
                        originalVariety: overallImpression.possibleVariety,
                        correctedVariety,
                        originalPleochroism: overallImpression.pleochroism,
                        correctedPleochroism: finalPleochroism,
                      }),
                    });
                  } catch (error) {
                    console.error('Error saving correction:', error);
                  }
                }
              }}
              onPleochroismCorrection={async (correctedPleochroism: string) => {
                // Update pleochroism state
                setPleochroism(correctedPleochroism);
                
                // Check consistency and auto-filter varieties if needed
                const { filterVarietiesByPleochroism } = await import('./utils/gemstoneAnalysis');
                const displayVariety = overallImpression.correctedVariety && overallImpression.correctedVariety.length > 0
                  ? overallImpression.correctedVariety
                  : overallImpression.possibleVariety;
                
                const pleochroismType = correctedPleochroism.toLowerCase().includes('isotrop') ? 'isotrop' : 'anisotrop';
                const filteredVarieties = filterVarietiesByPleochroism(displayVariety, pleochroismType);
                
                // Auto-filter varieties to match pleochroism
                const finalVarieties = filteredVarieties.length > 0 ? filteredVarieties : displayVariety;
                
                // Regenerate overallImpression and evaluation with corrected pleochroism
                const newOverallImpression = generateOverallImpression(
                  overallImpression.dominantColorTone,
                  overallImpression.saturation,
                  correctedPleochroism,
                  overallImpression.opticalQuality
                );
                const newEvaluation = generateFinalEvaluation(
                  overallImpression.dominantColorTone,
                  overallImpression.saturation,
                  correctedPleochroism,
                  finalVarieties,
                  overallImpression.opticalQuality
                );
                
                // Update local state with corrected pleochroism and filtered varieties
                setOverallImpression({
                  ...overallImpression,
                  correctedPleochroism,
                  correctedVariety: finalVarieties.length !== displayVariety.length ? finalVarieties : overallImpression.correctedVariety,
                  pleochroism: correctedPleochroism,
                  overallImpression: newOverallImpression,
                  evaluation: newEvaluation,
                });
                
                // Save correction to API for learning (with both variety and pleochroism)
                if (primaryColorLab && session?.user) {
                  try {
                    await fetch('/api/gemstone-analyses/corrections', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        lab: primaryColorLab,
                        hex: primaryColor?.hex,
                        originalVariety: overallImpression.possibleVariety,
                        correctedVariety: finalVarieties,
                        originalPleochroism: overallImpression.pleochroism,
                        correctedPleochroism,
                      }),
                    });
                  } catch (error) {
                    console.error('Error saving correction:', error);
                  }
                }
              }}
            />
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
