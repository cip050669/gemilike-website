'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OverallImpression } from '../utils/gemstoneAnalysis';

interface OverallImpressionSectionProps {
  analysis: OverallImpression;
  onVarietyCorrection?: (correctedVariety: string[]) => void;
  onPleochroismCorrection?: (correctedPleochroism: string) => void;
  canEdit?: boolean;
  isLoggedIn?: boolean; // For showing learning system info
}

function KeyValueTable({ rows }: { rows: Array<{ label: string; value: string | React.ReactNode }> }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white/50 shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Merkmale</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Bewertung</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="odd:bg-white even:bg-gray-50/60">
              <td className="px-4 py-2 text-gray-800 font-medium">{r.label}</td>
              <td className="px-4 py-2 text-gray-900">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function OverallImpressionSection({ 
  analysis, 
  onVarietyCorrection,
  onPleochroismCorrection,
  canEdit = false,
  isLoggedIn = false
}: OverallImpressionSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [correctedVariety, setCorrectedVariety] = useState<string>(
    analysis.correctedVariety?.join(', ') || ''
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingPleochroism, setIsEditingPleochroism] = useState(false);
  const getPleochroismType = (text: string): 'isotrop' | 'anisotrop' => {
    if (!text) return 'anisotrop';
    const lower = text.toLowerCase();
    // Check for isotrop first (more specific)
    if (lower.includes('isotrop') && !lower.includes('anisotrop')) return 'isotrop';
    // Default to anisotrop
    return 'anisotrop';
  };
  const displayPleochroism = analysis.correctedPleochroism || analysis.pleochroism;
  const currentPleochroismType = getPleochroismType(displayPleochroism);
  const [correctedPleochroism, setCorrectedPleochroism] = useState<'isotrop' | 'anisotrop'>(
    currentPleochroismType
  );
  const [isSavingPleochroism, setIsSavingPleochroism] = useState(false);
  
  // Update correctedPleochroism when analysis changes, but only when NOT editing
  // This ensures the state is synced with the analysis, but doesn't interfere with user edits
  useEffect(() => {
    // Only update when not in edit mode to avoid conflicts with user input
    if (!isEditingPleochroism) {
      const newType = getPleochroismType(displayPleochroism);
      setCorrectedPleochroism(newType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayPleochroism]);
  
  // Reset state when entering edit mode to ensure correct initial value
  useEffect(() => {
    if (isEditingPleochroism) {
      const typeToSet = getPleochroismType(displayPleochroism);
      setCorrectedPleochroism(typeToSet);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditingPleochroism]);

  const handleSaveCorrection = async () => {
    if (!onVarietyCorrection) return;
    
    setIsSaving(true);
    try {
      const varieties = correctedVariety
        .split(',')
        .map(v => v.trim())
        .filter(v => v.length > 0);
      
      // Check consistency: filter varieties based on current pleochroism
      const { filterVarietiesByPleochroism, suggestPleochroismFromVarieties } = await import('../utils/gemstoneAnalysis');
      const suggestedPleochroism = suggestPleochroismFromVarieties(varieties);
      
      // Get current pleochroism type (use corrected if available, otherwise original)
      const currentPleochroismType = getPleochroismType(displayPleochroism);
      
      // Ensure consistency: if varieties suggest a different pleochroism type, filter them
      if (suggestedPleochroism !== currentPleochroismType) {
        // Filter varieties to match current pleochroism
        const filtered = filterVarietiesByPleochroism(varieties, currentPleochroismType);
        
        if (filtered.length === 0 && varieties.length > 0) {
          // No matching varieties found - warn user
          const pleochroismText = currentPleochroismType === 'isotrop' 
            ? 'Isotrop (kein Pleochroismus)' 
            : 'Anisotrop (Pleochroismus vorhanden)';
          alert(`Warnung: Die ausgewählten Varietäten passen nicht zum aktuellen Pleochroismus (${pleochroismText}). Bitte korrigieren Sie auch den Pleochroismus oder wählen Sie passende Varietäten.`);
          setIsEditing(false);
          setIsSaving(false);
          return;
        } else if (filtered.length < varieties.length) {
          // Some varieties were filtered out - use filtered list
          await onVarietyCorrection(filtered);
          setIsEditing(false);
          setIsSaving(false);
          return;
        }
      }
      
      await onVarietyCorrection(varieties);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving correction:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePleochroismCorrection = async () => {
    if (!onPleochroismCorrection) return;
    
    setIsSavingPleochroism(true);
    try {
      // Convert type to full text
      const pleochroismText = correctedPleochroism === 'isotrop' 
        ? 'Isotrop (kein Pleochroismus)' 
        : 'Anisotrop (Pleochroismus vorhanden)';
      
      // Check consistency: filter varieties based on pleochroism
      const { filterVarietiesByPleochroism, suggestPleochroismFromVarieties } = await import('../utils/gemstoneAnalysis');
      const currentVarieties = displayVariety;
      const suggestedPleochroism = suggestPleochroismFromVarieties(currentVarieties);
      
      // If varieties don't match pleochroism, warn and auto-filter
      if (correctedPleochroism !== suggestedPleochroism) {
        const filtered = filterVarietiesByPleochroism(currentVarieties, correctedPleochroism);
        if (filtered.length === 0 && currentVarieties.length > 0) {
          alert('Warnung: Die aktuellen Varietät-Vorschläge passen nicht zum ausgewählten Pleochroismus. Bitte korrigieren Sie auch die Varietät.');
        } else if (filtered.length < currentVarieties.length && onVarietyCorrection) {
          // Auto-filter varieties to match pleochroism
          await onVarietyCorrection(filtered);
        }
      }
      
      await onPleochroismCorrection(pleochroismText);
      setIsEditingPleochroism(false);
    } catch (error) {
      console.error('Error saving pleochroism correction:', error);
    } finally {
      setIsSavingPleochroism(false);
    }
  };

  const displayVariety = analysis.correctedVariety && analysis.correctedVariety.length > 0
    ? analysis.correctedVariety
    : analysis.possibleVariety;

  const rows = [
    { label: 'Dominanter Farbton', value: analysis.dominantColorTone },
    { label: 'Sättigung', value: analysis.saturation },
    {
      label: 'Pleochroismus',
      value: (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span>{displayPleochroism}</span>
            {analysis.correctedPleochroism && (
              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded">
              ✓ Korrigiert
            </span>
            )}
          </div>
          {canEdit && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              {!isEditingPleochroism ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Ensure we have the correct type before opening edit mode
                    const typeToSet = getPleochroismType(displayPleochroism);
                    setCorrectedPleochroism(typeToSet);
                    setIsEditingPleochroism(true);
                  }}
                  className="text-xs"
                >
                  {analysis.correctedPleochroism ? 'Korrektur bearbeiten' : 'Manuelle Korrektur'}
                </Button>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 block mb-2 font-medium">
                    Pleochroismus-Typ auswählen:
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 p-2 rounded-md border border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="pleochroism-type"
                        value="isotrop"
                        checked={correctedPleochroism === 'isotrop'}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCorrectedPleochroism('isotrop');
                          }
                        }}
                        disabled={isSavingPleochroism}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Isotrop (kein Pleochroismus)</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-md border border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="pleochroism-type"
                        value="anisotrop"
                        checked={correctedPleochroism === 'anisotrop'}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCorrectedPleochroism('anisotrop');
                          }
                        }}
                        disabled={isSavingPleochroism}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Anisotrop (Pleochroismus vorhanden)</span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Aktuell ausgewählt: <strong className="text-blue-600">{correctedPleochroism === 'isotrop' ? 'Isotrop' : 'Anisotrop'}</strong>
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSavePleochroismCorrection}
                      disabled={isSavingPleochroism}
                      className="text-xs"
                    >
                      {isSavingPleochroism ? 'Speichern...' : 'Speichern'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                  onClick={() => {
                    setIsEditingPleochroism(false);
                    setCorrectedPleochroism(currentPleochroismType);
                  }}
                      className="text-xs"
                    >
                      Abbrechen
                    </Button>
                  </div>
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                    <p className="font-semibold mb-1">💡 {isLoggedIn ? 'Lernsystem aktiv' : 'Lokale Korrektur'}</p>
                    <p>
                      {isLoggedIn ? (
                        <>
                          Diese Korrektur wird gespeichert und hilft dem Algorithmus, ähnliche Steine in Zukunft besser zu erkennen.
                          <br />
                          <strong>Konsistenz:</strong> Die Varietät-Vorschläge werden automatisch gefiltert, um zum Pleochroismus zu passen.
                        </>
                      ) : (
                        <>
                          Diese Korrektur wird lokal gespeichert und verbessert die aktuelle Analyse.
                          <br />
                          <strong>Hinweis:</strong> Melden Sie sich an, um Korrekturen im Lernsystem zu speichern und zukünftige Analysen zu verbessern.
                          <br />
                          <strong>Konsistenz:</strong> Die Varietät-Vorschläge werden automatisch gefiltert, um zum Pleochroismus zu passen.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      label: 'Mögliche Ursache der Farbe',
      value: (
        <ul className="list-disc list-inside">
          {analysis.possibleColorCause.map((cause, index) => (
            <li key={index}>{cause}</li>
          ))}
        </ul>
      ),
    },
    {
      label: 'Mögliche Varietät',
      value: (
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <ul className="list-disc list-inside flex-1">
              {displayVariety.map((variety, index) => (
                <li key={index}>{variety}</li>
              ))}
            </ul>
            {analysis.correctedVariety && analysis.correctedVariety.length > 0 && (
              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded whitespace-nowrap">
                ✓ Korrigiert
              </span>
            )}
          </div>
          {canEdit && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCorrectedVariety(displayVariety.join(', '));
                    setIsEditing(true);
                  }}
                  className="text-xs"
                >
                  {analysis.correctedVariety ? 'Korrektur bearbeiten' : 'Manuelle Korrektur'}
                </Button>
              ) : (
                <div className="space-y-2">
                  <Input
                    value={correctedVariety}
                    onChange={(e) => setCorrectedVariety(e.target.value)}
                    placeholder="z.B. Saphir, Blauer Spinell"
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveCorrection}
                      disabled={isSaving}
                      className="text-xs"
                    >
                      {isSaving ? 'Speichern...' : 'Speichern'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setCorrectedVariety(displayVariety.join(', '));
                      }}
                      className="text-xs"
                    >
                      Abbrechen
                    </Button>
                  </div>
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                    <p className="font-semibold mb-1">💡 {isLoggedIn ? 'Lernsystem aktiv' : 'Lokale Korrektur'}</p>
                    <p>
                      {isLoggedIn ? (
                        <>
                          Diese Korrektur wird gespeichert und hilft dem Algorithmus, ähnliche Steine in Zukunft besser zu erkennen.
                          <br />
                          <strong>Konsistenz:</strong> Die Varietät wird automatisch an den Pleochroismus angepasst, um Widersprüche zu vermeiden.
                        </>
                      ) : (
                        <>
                          Diese Korrektur wird lokal gespeichert und verbessert die aktuelle Analyse.
                          <br />
                          <strong>Hinweis:</strong> Melden Sie sich an, um Korrekturen im Lernsystem zu speichern und zukünftige Analysen zu verbessern.
                          <br />
                          <strong>Konsistenz:</strong> Die Varietät wird automatisch an den Pleochroismus angepasst, um Widersprüche zu vermeiden.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ),
    },
    { label: 'Optische Qualität', value: analysis.opticalQuality },
    { label: 'Gesamteindruck', value: analysis.overallImpression },
  ];

  return (
    <Card className="bg-white border-gray-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">6️⃣ Gesamteindruck</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border bg-white/50 p-4 text-gray-800 text-sm leading-6 shadow-sm">
          {analysis.overallImpression}
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Fazit</h3>
          <KeyValueTable rows={rows} />
        </div>

        <div className="mt-6 rounded-2xl border bg-indigo-50/60 p-4">
          <div className="text-sm font-semibold text-indigo-900 mb-2">Zusammenfassung</div>
          <div className="text-sm text-indigo-900">
            <p>{analysis.evaluation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

