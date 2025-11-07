'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OverallImpression } from '../utils/gemstoneAnalysis';

interface OverallImpressionSectionProps {
  analysis: OverallImpression;
  onVarietyCorrection?: (correctedVariety: string[]) => void;
  onPleochroismCorrection?: (correctedPleochroism: string) => void;
  canEdit?: boolean;
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
  canEdit = false 
}: OverallImpressionSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [correctedVariety, setCorrectedVariety] = useState<string>(
    analysis.correctedVariety?.join(', ') || ''
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingPleochroism, setIsEditingPleochroism] = useState(false);
  const getPleochroismType = (text: string): 'isotrop' | 'anisotrop' => {
    const lower = text.toLowerCase();
    if (lower.includes('isotrop')) return 'isotrop';
    return 'anisotrop';
  };
  const displayPleochroism = analysis.correctedPleochroism || analysis.pleochroism;
  const currentPleochroismType = getPleochroismType(displayPleochroism);
  const [correctedPleochroism, setCorrectedPleochroism] = useState<'isotrop' | 'anisotrop'>(
    currentPleochroismType
  );
  const [isSavingPleochroism, setIsSavingPleochroism] = useState(false);

  const handleSaveCorrection = async () => {
    if (!onVarietyCorrection) return;
    
    setIsSaving(true);
    try {
      const varieties = correctedVariety
        .split(',')
        .map(v => v.trim())
        .filter(v => v.length > 0);
      
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
          <div>{displayPleochroism}</div>
          {canEdit && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              {!isEditingPleochroism ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCorrectedPleochroism(currentPleochroismType);
                    setIsEditingPleochroism(true);
                  }}
                  className="text-xs"
                >
                  {analysis.correctedPleochroism ? 'Korrektur bearbeiten' : 'Manuelle Korrektur'}
                </Button>
              ) : (
                <div className="space-y-2">
                  <Select
                    value={correctedPleochroism}
                    onValueChange={(value) => setCorrectedPleochroism(value as 'isotrop' | 'anisotrop')}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Pleochroismus auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="isotrop">Isotrop (kein Pleochroismus)</SelectItem>
                      <SelectItem value="anisotrop">Anisotrop (Pleochroismus vorhanden)</SelectItem>
                    </SelectContent>
                  </Select>
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
          <ul className="list-disc list-inside">
            {displayVariety.map((variety, index) => (
              <li key={index}>{variety}</li>
            ))}
          </ul>
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
                  <p className="text-xs text-gray-500">
                    Diese Korrektur hilft dem Algorithmus, ähnliche Steine in Zukunft besser zu erkennen.
                  </p>
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

