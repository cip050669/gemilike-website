export interface ColorChartGiaInput {
  hue?: string;
  tone?: string;
  sat?: string;
}

export interface ColorChartImportPayload {
  name: string;
  origin?: string | null;
  locale?: string;
  gia?: ColorChartGiaInput | null;
  gradient: string[];
  pleochro?: string[];
  light?: string;
  note?: string | null;
  description?: string | null;
  published?: boolean;
  featured?: boolean;
  order?: number;
}

export interface ColorChartImportResponse {
  success: boolean;
  imported: number;
  total: number;
  results: {
    success: Array<{ id: string; name: string }>;
    errors: string[];
  };
}
