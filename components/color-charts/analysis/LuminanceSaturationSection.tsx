'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LuminanceSaturationAnalysis } from '../utils/gemstoneAnalysis';

interface LuminanceSaturationSectionProps {
  analysis: LuminanceSaturationAnalysis;
}

function KeyValueTable({ rows }: { rows: Array<{ label: string; value: string; note?: string }> }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white/50 shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Parameter</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Einschätzung</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Bemerkung</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="odd:bg-white even:bg-gray-50/60">
              <td className="px-4 py-2 text-gray-800 font-medium">{r.label}</td>
              <td className="px-4 py-2 text-gray-900 font-medium">{r.value}</td>
              <td className="px-4 py-2 text-gray-600">{r.note ?? "–"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LuminanceSaturationSection({ analysis }: LuminanceSaturationSectionProps) {
  const rows = [
    {
      label: 'Luminanz (L*)',
      value: analysis.luminance.assessment,
      note: analysis.luminance.remark,
    },
    {
      label: 'Sättigung (C*)',
      value: analysis.saturation.assessment,
      note: analysis.saturation.remark,
    },
    {
      label: 'Farbreinheit',
      value: analysis.colorPurity.assessment,
      note: analysis.colorPurity.remark,
    },
  ];

  return (
    <Card className="bg-white border-gray-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">3️⃣ Helligkeits- & Sättigungsanalyse</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <KeyValueTable rows={rows} />

        <div className="mt-6 rounded-2xl border bg-indigo-50/60 p-4">
          <div className="text-sm font-semibold text-indigo-900 mb-2">Schlussfolgerung</div>
          <div className="text-sm text-indigo-900">
            <p>
              Die Helligkeitsanalyse zeigt eine {analysis.luminance.assessment.toLowerCase()} Luminanz
              ({analysis.luminance.value.toFixed(1)}), was auf eine{' '}
              {analysis.luminance.value > 60 ? 'helle' : analysis.luminance.value > 40 ? 'mittlere' : 'dunkle'}{' '}
              Erscheinung des Steins hindeutet. Die Sättigung ist{' '}
              {analysis.saturation.assessment.toLowerCase()} ({analysis.saturation.value.toFixed(1)}),
              und die Farbreinheit wird als {analysis.colorPurity.assessment.toLowerCase()} bewertet
              ({analysis.colorPurity.value.toFixed(1)}%).
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

