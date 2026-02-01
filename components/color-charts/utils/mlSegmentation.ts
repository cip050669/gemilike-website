export interface SegmentationResponse {
  width: number;
  height: number;
  mask: number[]; // 0/1 values, length = width * height
}

interface SegmentationResponse2D {
  width?: number;
  height?: number;
  mask: number[][];
}

interface SegmentationResponseAlpha {
  width: number;
  height: number;
  alpha: number[]; // 0..1, length = width * height
}

interface SegmentationResponseRLE {
  width: number;
  height: number;
  counts: number[]; // COCO-style RLE (array)
}

interface SegmentationResponsePng {
  width?: number;
  height?: number;
  mask_png_base64: string;
}

interface SegmentationResponsePolygons {
  width: number;
  height: number;
  polygons: number[][][]; // array of polygons, each polygon = array of [x,y]
}

const isValidMask = (data: SegmentationResponse): boolean => {
  if (!data || typeof data.width !== 'number' || typeof data.height !== 'number') {
    return false;
  }
  if (!Array.isArray(data.mask)) return false;
  if (data.mask.length !== data.width * data.height) return false;
  return true;
};

const isValidMask2D = (data: SegmentationResponse2D): boolean => {
  if (!data || !Array.isArray(data.mask) || data.mask.length === 0) return false;
  const width = data.mask[0]?.length || 0;
  if (width === 0) return false;
  return data.mask.every((row) => Array.isArray(row) && row.length === width);
};

const isValidAlpha = (data: SegmentationResponseAlpha): boolean => {
  if (!data || typeof data.width !== 'number' || typeof data.height !== 'number') return false;
  if (!Array.isArray(data.alpha)) return false;
  return data.alpha.length === data.width * data.height;
};

const isValidRLE = (data: SegmentationResponseRLE): boolean => {
  if (!data || typeof data.width !== 'number' || typeof data.height !== 'number') return false;
  if (!Array.isArray(data.counts)) return false;
  return data.counts.length > 0;
};

const isValidPng = (data: SegmentationResponsePng): boolean => {
  return !!data && typeof data.mask_png_base64 === 'string' && data.mask_png_base64.length > 0;
};

const isValidPolygons = (data: SegmentationResponsePolygons): boolean => {
  return (
    !!data &&
    typeof data.width === 'number' &&
    typeof data.height === 'number' &&
    Array.isArray(data.polygons) &&
    data.polygons.length > 0
  );
};

const decodeBase64ToBlob = (base64: string, contentType: string): Blob => {
  const cleaned = base64.includes(',') ? base64.split(',')[1] : base64;
  const binary = atob(cleaned);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: contentType });
};

const imageToMask = async (blob: Blob): Promise<boolean[][]> => {
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not available for image decoding');
  }
  ctx.drawImage(bitmap, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const mask: boolean[][] = [];
  for (let y = 0; y < canvas.height; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const a = imageData.data[i + 3];
      // Prefer alpha channel if present, else use luminance threshold
      const isOn = a > 10 ? a > 128 : (0.2126 * r + 0.7152 * g + 0.0722 * b) > 128;
      row.push(isOn);
    }
    mask.push(row);
  }
  return mask;
};

const rleToMask = (data: SegmentationResponseRLE): boolean[][] => {
  const total = data.width * data.height;
  const flat: number[] = new Array(total).fill(0);
  let idx = 0;
  let val = 0;
  for (const count of data.counts) {
    for (let i = 0; i < count && idx < total; i++) {
      flat[idx++] = val;
    }
    val = val === 0 ? 1 : 0;
  }
  const mask: boolean[][] = [];
  for (let y = 0; y < data.height; y++) {
    const row: boolean[] = [];
    const offset = y * data.width;
    for (let x = 0; x < data.width; x++) {
      row.push(flat[offset + x] > 0);
    }
    mask.push(row);
  }
  return mask;
};

const polygonsToMask = (data: SegmentationResponsePolygons): boolean[][] => {
  const canvas = document.createElement('canvas');
  canvas.width = data.width;
  canvas.height = data.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not available for polygon rasterization');
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  for (const polygon of data.polygons) {
    if (!polygon || polygon.length < 3) continue;
    ctx.beginPath();
    ctx.moveTo(polygon[0][0], polygon[0][1]);
    for (let i = 1; i < polygon.length; i++) {
      ctx.lineTo(polygon[i][0], polygon[i][1]);
    }
    ctx.closePath();
    ctx.fill();
  }
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const mask: boolean[][] = [];
  for (let y = 0; y < canvas.height; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      const r = imageData.data[i];
      row.push(r > 0);
    }
    mask.push(row);
  }
  return mask;
};

export async function segmentGemstoneViaApi(imageFile: File): Promise<boolean[][]> {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch('/api/segmentation', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(`Segmentation API error: ${response.status} ${message}`.trim());
  }

  const contentType = response.headers.get('content-type') || '';

  if (contentType.startsWith('image/')) {
    const blob = await response.blob();
    return imageToMask(blob);
  }

  const data = (await response.json()) as
    | SegmentationResponse
    | SegmentationResponse2D
    | SegmentationResponseAlpha
    | SegmentationResponseRLE
    | SegmentationResponsePng
    | SegmentationResponsePolygons;

  if (isValidMask(data as SegmentationResponse)) {
    const flat = data as SegmentationResponse;
    const mask: boolean[][] = [];
    for (let y = 0; y < flat.height; y++) {
      const row: boolean[] = [];
      const offset = y * flat.width;
      for (let x = 0; x < flat.width; x++) {
        row.push(flat.mask[offset + x] > 0);
      }
      mask.push(row);
    }
    return mask;
  }

  if (isValidMask2D(data as SegmentationResponse2D)) {
    const grid = data as SegmentationResponse2D;
    return grid.mask.map((row) => row.map((v) => v > 0));
  }

  if (isValidAlpha(data as SegmentationResponseAlpha)) {
    const alpha = data as SegmentationResponseAlpha;
    const mask: boolean[][] = [];
    for (let y = 0; y < alpha.height; y++) {
      const row: boolean[] = [];
      const offset = y * alpha.width;
      for (let x = 0; x < alpha.width; x++) {
        row.push(alpha.alpha[offset + x] >= 0.5);
      }
      mask.push(row);
    }
    return mask;
  }

  if (isValidRLE(data as SegmentationResponseRLE)) {
    return rleToMask(data as SegmentationResponseRLE);
  }

  if (isValidPng(data as SegmentationResponsePng)) {
    const pngData = data as SegmentationResponsePng;
    const blob = decodeBase64ToBlob(pngData.mask_png_base64, 'image/png');
    return imageToMask(blob);
  }

  if (isValidPolygons(data as SegmentationResponsePolygons)) {
    return polygonsToMask(data as SegmentationResponsePolygons);
  }

  throw new Error('Segmentation API returned unsupported mask format');
}
