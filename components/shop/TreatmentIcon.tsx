'use client';

import { Treatment } from '@/lib/types/gemstone';
import { Badge } from '@/components/ui/badge';
import { 
  Flame, 
  Droplets, 
  Zap, 
  Layers, 
  Shield, 
  Paintbrush, 
  HelpCircle,
  CheckCircle
} from 'lucide-react';

interface TreatmentIconProps {
  treatment: Treatment;
  size?: 'sm' | 'md' | 'lg' | 'lg-sm' | 'xl';
  showText?: boolean;
}

export function TreatmentIcon({ treatment, size = 'md', showText = true }: TreatmentIconProps) {
  if (!treatment.treated) {
    return (
      <Badge 
        variant="outline" 
        className="flex items-center gap-1"
        aria-label="Behandlung: Unbehandelt"
      >
        <CheckCircle className="w-3 h-3 text-green-600" aria-hidden="true" />
        {showText && <span>Unbehandelt</span>}
      </Badge>
    );
  }

  const getTreatmentIcon = (type: string) => {
    switch (type) {
      case 'heated':
        return <Flame className="w-3 h-3 text-orange-600" aria-hidden="true" />;
      case 'oiled':
        return <Droplets className="w-3 h-3 text-blue-600" aria-hidden="true" />;
      case 'irradiated':
        return <Zap className="w-3 h-3 text-yellow-600" aria-hidden="true" />;
      case 'diffused':
        return <Layers className="w-3 h-3 text-purple-600" aria-hidden="true" />;
      case 'filled':
        return <Shield className="w-3 h-3 text-gray-600" aria-hidden="true" />;
      case 'coated':
        return <Paintbrush className="w-3 h-3 text-pink-600" aria-hidden="true" />;
      default:
        return <HelpCircle className="w-3 h-3 text-gray-600" aria-hidden="true" />;
    }
  };

  const getTreatmentText = (type: string) => {
    switch (type) {
      case 'heated':
        return 'Erhitzt';
      case 'oiled':
        return 'Geölt';
      case 'irradiated':
        return 'Bestrahlt';
      case 'diffused':
        return 'Diffundiert';
      case 'filled':
        return 'Gefüllt';
      case 'coated':
        return 'Beschichtet';
      default:
        return 'Behandelt';
    }
  };

  const getTreatmentColor = (type: string) => {
    switch (type) {
      case 'heated':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'oiled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'irradiated':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'diffused':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'filled':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'coated':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const sizeClasses = {
    sm: 'text-[8px] px-0.5 py-0',
    md: 'text-[10px] px-1 py-0',
    lg: 'text-xs px-1.5 py-0.5',
    'lg-sm': 'text-[10px] px-1.5 py-0.5',
    xl: 'text-sm px-2 py-1'
  };

  return (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-1 ${getTreatmentColor(treatment.type || 'other')} ${sizeClasses[size]}`}
      title={treatment.description || getTreatmentText(treatment.type || 'other')}
      aria-label={`Behandlung: ${getTreatmentText(treatment.type || 'other')}`}
    >
      {getTreatmentIcon(treatment.type || 'other')}
      {showText && <span>{getTreatmentText(treatment.type || 'other')}</span>}
    </Badge>
  );
}

