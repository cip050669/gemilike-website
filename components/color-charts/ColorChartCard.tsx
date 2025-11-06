'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GradientBar } from './GradientBar';
import { ColorChart } from './GemColorCard';

interface ColorChartCardProps {
  chart: ColorChart;
  onClick?: () => void;
  className?: string;
}

export function ColorChartCard({ chart, onClick, className = '' }: ColorChartCardProps) {
  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-all ${className}`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{chart.name}</CardTitle>
            {chart.origin && (
              <CardDescription className="text-sm">
                {chart.origin}
              </CardDescription>
            )}
          </div>
          {chart.featured && (
            <Badge variant="default" className="bg-[#9A1A63] ml-2">
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <GradientBar colors={chart.gradient} height={60} className="mb-3" />
        {chart.gia && (
          <div className="flex gap-2 text-xs text-muted-foreground">
            {chart.gia.hue && <span>H: {chart.gia.hue}</span>}
            {chart.gia.tone && <span>T: {chart.gia.tone}</span>}
            {chart.gia.sat && <span>S: {chart.gia.sat}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

