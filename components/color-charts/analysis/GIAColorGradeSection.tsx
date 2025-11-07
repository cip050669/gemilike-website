'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GIAColorGrade } from '../utils/gemstoneAnalysis';

interface GIAColorGradeSectionProps {
  analysis: GIAColorGrade;
}

function KeyValueTable({ rows }: { rows: Array<{ label: string; value: string }> }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white/50 shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Attribut</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Bewertung</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="odd:bg-white even:bg-gray-50/60">
              <td className="px-4 py-2 text-gray-800 font-medium">{r.label}</td>
              <td className="px-4 py-2 text-gray-900 font-medium">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GIAColorGradeSection({ analysis }: GIAColorGradeSectionProps) {
  const rows = [
    { label: 'Hue', value: analysis.hue },
    { label: 'Tone', value: analysis.tone },
    { label: 'Saturation', value: analysis.saturation },
    { label: 'Final Color Grade', value: analysis.finalColorGrade },
  ];

  return (
    <Card className="bg-white border-gray-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">5️⃣ Gemmologische Farbbezeichnung (GIA)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <KeyValueTable rows={rows} />

        <div className="mt-6 rounded-2xl border bg-indigo-50/60 p-4">
          <div className="text-sm font-semibold text-indigo-900 mb-2">Zusammenfassung der Erkenntnisse</div>
          <div className="text-sm text-indigo-900">
            <p>{analysis.evaluation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

