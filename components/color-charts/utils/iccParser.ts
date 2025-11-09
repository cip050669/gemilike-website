/**
 * ICC Profile Parser (minimal implementation)
 * 
 * Extracts essential color information from ICC color profiles:
 * - wtpt: White point (illuminant)
 * - rXYZ, gXYZ, bXYZ: RGB colorant XYZ values
 * 
 * This is a minimal parser that only extracts the most important tags
 * for color correction. Full ICC profile parsing (LUTs, VCGT, etc.) is not implemented.
 * 
 * Based on the Borderline v4 implementation.
 */

export interface ICCProfile {
  wtpt: [number, number, number] | null;      // White point XYZ
  rXYZ: [number, number, number] | null;      // Red colorant XYZ
  gXYZ: [number, number, number] | null;      // Green colorant XYZ
  bXYZ: [number, number, number] | null;      // Blue colorant XYZ
}

/**
 * Read 32-bit big-endian integer from buffer
 * 
 * @param buf Buffer to read from
 * @param offset Byte offset
 * @returns 32-bit integer
 */
function read32be(buf: Uint8Array, offset: number): number {
  return (buf[offset] << 24) | (buf[offset + 1] << 16) | (buf[offset + 2] << 8) | buf[offset + 3];
}

/**
 * Convert s15Fixed16 format to floating point
 * 
 * ICC uses s15Fixed16 format: 16-bit integer part, 16-bit fractional part
 * 
 * @param n 32-bit integer in s15Fixed16 format
 * @returns Floating point value
 */
function s15Fixed16(n: number): number {
  return (n >> 16) + ((n & 0xffff) / 65536);
}

/**
 * Parse ICC color profile
 * 
 * Extracts white point and RGB colorant XYZ values from an ICC profile.
 * 
 * ICC Profile Structure:
 * - Header (128 bytes)
 * - Tag count (4 bytes)
 * - Tag table (12 bytes per tag)
 *   - Tag signature (4 bytes)
 *   - Tag offset (4 bytes)
 *   - Tag size (4 bytes)
 * - Tag data
 * 
 * @param buf ICC profile data as Uint8Array
 * @returns Parsed ICC profile with white point and colorant XYZ values
 */
export function parseICC(buf: Uint8Array): ICCProfile {
  if (buf.length < 132) {
    throw new Error('ICC profile too small (minimum 132 bytes)');
  }
  
  // Read tag count (offset 128 + 4 = 132)
  const tagCount = read32be(buf, 132);
  
  if (tagCount < 0 || tagCount > 100) {
    throw new Error(`Invalid tag count: ${tagCount}`);
  }
  
  // Tag table starts at offset 128 + 8 = 136
  const tagTableOffset = 136;
  const tags: Record<string, number[]> = {};
  
  // Parse tag table
  for (let i = 0; i < tagCount; i++) {
    const base = tagTableOffset + i * 12;
    
    if (base + 12 > buf.length) {
      break; // Not enough data
    }
    
    // Read tag signature (4 bytes)
    const sig = String.fromCharCode(
      buf[base],
      buf[base + 1],
      buf[base + 2],
      buf[base + 3]
    );
    
    // Read tag offset (4 bytes)
    const off = read32be(buf, base + 4);
    
    // Read tag size (4 bytes)
    const size = read32be(buf, base + 8);
    
    // Check bounds
    if (off + size > buf.length || off < 0 || size < 0) {
      continue; // Skip invalid tag
    }
    
    // Read type signature (first 4 bytes of tag data)
    if (off + 4 > buf.length) {
      continue;
    }
    
    const typeSig = String.fromCharCode(
      buf[off],
      buf[off + 1],
      buf[off + 2],
      buf[off + 3]
    );
    
    // Only parse XYZ tags
    if (typeSig === 'XYZ ') {
      // XYZ tag format:
      // - Type signature: 4 bytes ('XYZ ')
      // - Reserved: 4 bytes
      // - XYZ values: 12 bytes each (s15Fixed16 format)
      const dataOffset = off + 8; // Skip type signature and reserved
      const count = (size - 8) / 12; // Each XYZ is 12 bytes
      
      if (count < 1 || dataOffset + count * 12 > buf.length) {
        continue; // Invalid size
      }
      
      const vals: number[] = [];
      for (let j = 0; j < count; j++) {
        const xyzOffset = dataOffset + j * 12;
        
        // Read X, Y, Z as s15Fixed16
        const X = s15Fixed16(read32be(buf, xyzOffset));
        const Y = s15Fixed16(read32be(buf, xyzOffset + 4));
        const Z = s15Fixed16(read32be(buf, xyzOffset + 8));
        
        vals.push(X, Y, Z);
      }
      
      tags[sig] = vals;
    }
  }
  
  // Extract white point and colorants
  const wtpt = tags['wtpt'] && tags['wtpt'].length >= 3
    ? [tags['wtpt'][0], tags['wtpt'][1], tags['wtpt'][2]] as [number, number, number]
    : null;
  
  const rXYZ = tags['rXYZ'] && tags['rXYZ'].length >= 3
    ? [tags['rXYZ'][0], tags['rXYZ'][1], tags['rXYZ'][2]] as [number, number, number]
    : null;
  
  const gXYZ = tags['gXYZ'] && tags['gXYZ'].length >= 3
    ? [tags['gXYZ'][0], tags['gXYZ'][1], tags['gXYZ'][2]] as [number, number, number]
    : null;
  
  const bXYZ = tags['bXYZ'] && tags['bXYZ'].length >= 3
    ? [tags['bXYZ'][0], tags['bXYZ'][1], tags['bXYZ'][2]] as [number, number, number]
    : null;
  
  return {
    wtpt,
    rXYZ,
    gXYZ,
    bXYZ,
  };
}

/**
 * Parse ICC profile from File object
 * 
 * @param file File object containing ICC profile (.icc or .icm)
 * @returns Promise resolving to parsed ICC profile
 */
export async function parseICCFromFile(file: File): Promise<ICCProfile> {
  const arrayBuffer = await file.arrayBuffer();
  const buf = new Uint8Array(arrayBuffer);
  return parseICC(buf);
}

/**
 * Check if a file is likely an ICC profile
 * 
 * @param file File object
 * @returns True if file appears to be an ICC profile
 */
export function isICCProfile(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith('.icc') || name.endsWith('.icm');
}

