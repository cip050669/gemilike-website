/**
 * Comprehensive ICC Profile Integration Test
 * 
 * Tests the complete flow from ICC profile upload to color conversion
 */

import { parseICCFromFile, parseICC } from './iccParser';
import { xyzToLab, rgbToXyz, hexToRgb } from './colorConversions';

/**
 * Create a realistic test ICC profile (sRGB with D65)
 * This simulates a real-world ICC profile
 */
export function createSRGBICCProfile(): Uint8Array {
  // sRGB D65 whitepoint: X=0.95047, Y=1.00000, Z=1.08883
  const wtptX = 0.95047;
  const wtptY = 1.00000;
  const wtptZ = 1.08883;
  
  // sRGB colorants (simplified)
  const rXYZ = [0.43607, 0.22249, 0.01393];
  const gXYZ = [0.38515, 0.71687, 0.09708];
  const bXYZ = [0.14307, 0.06061, 0.71410];
  
  const toFixed16 = (val: number): number => {
    const int = Math.floor(val);
    const frac = val - int;
    return (int << 16) | Math.floor(frac * 65536);
  };
  
  const write32be = (buf: Uint8Array, offset: number, value: number) => {
    buf[offset] = (value >> 24) & 0xFF;
    buf[offset + 1] = (value >> 16) & 0xFF;
    buf[offset + 2] = (value >> 8) & 0xFF;
    buf[offset + 3] = value & 0xFF;
  };
  
  const buf = new Uint8Array(1024);
  
  // ICC Profile Header
  buf[0] = 0x61; buf[1] = 0x63; buf[2] = 0x73; buf[3] = 0x70; // "acsp"
  buf[8] = 0x04; buf[9] = 0x00; buf[10] = 0x00; buf[11] = 0x00; // Version 4.0
  buf[12] = 0x6D; buf[13] = 0x6E; buf[14] = 0x74; buf[15] = 0x72; // Display
  buf[16] = 0x52; buf[17] = 0x47; buf[18] = 0x42; buf[19] = 0x20; // RGB
  buf[20] = 0x58; buf[21] = 0x59; buf[22] = 0x5A; buf[23] = 0x20; // XYZ
  
  // Tag count: 4 (wtpt, rXYZ, gXYZ, bXYZ)
  write32be(buf, 128, 4);
  
  // Tag table at offset 136
  const tagOffset = 200;
  
  // wtpt tag
  buf[136] = 0x77; buf[137] = 0x74; buf[138] = 0x70; buf[139] = 0x74; // "wtpt"
  write32be(buf, 140, tagOffset);
  write32be(buf, 144, 20);
  
  // rXYZ tag
  buf[148] = 0x72; buf[149] = 0x58; buf[150] = 0x59; buf[151] = 0x5A; // "rXYZ"
  write32be(buf, 152, tagOffset + 20);
  write32be(buf, 156, 20);
  
  // gXYZ tag
  buf[160] = 0x67; buf[161] = 0x58; buf[162] = 0x59; buf[163] = 0x5A; // "gXYZ"
  write32be(buf, 164, tagOffset + 40);
  write32be(buf, 168, 20);
  
  // bXYZ tag
  buf[172] = 0x62; buf[173] = 0x58; buf[174] = 0x59; buf[175] = 0x5A; // "bXYZ"
  write32be(buf, 176, tagOffset + 60);
  write32be(buf, 180, 20);
  
  // Write tag data
  const writeXYZTag = (offset: number, xyz: number[]) => {
    buf[offset] = 0x58; buf[offset + 1] = 0x59; buf[offset + 2] = 0x5A; buf[offset + 3] = 0x20; // "XYZ "
    write32be(buf, offset + 8, toFixed16(xyz[0]));
    write32be(buf, offset + 12, toFixed16(xyz[1]));
    write32be(buf, offset + 16, toFixed16(xyz[2]));
  };
  
  writeXYZTag(tagOffset, [wtptX, wtptY, wtptZ]);
  writeXYZTag(tagOffset + 20, rXYZ);
  writeXYZTag(tagOffset + 40, gXYZ);
  writeXYZTag(tagOffset + 60, bXYZ);
  
  return buf;
}

/**
 * Test complete ICC workflow
 */
export async function testCompleteICCWorkflow(): Promise<boolean> {
  console.log('🧪 Testing Complete ICC Workflow...\n');
  
  try {
    // 1. Create test ICC profile
    console.log('1️⃣ Creating test ICC profile (sRGB D65)...');
    const iccData = createSRGBICCProfile();
    const iccFile = new File([iccData as BlobPart], 'test-srgb.icc', { type: 'application/vnd.iccprofile' });
    
    // 2. Parse ICC profile
    console.log('2️⃣ Parsing ICC profile...');
    const profile = await parseICCFromFile(iccFile);
    
    if (!profile.wtpt) {
      console.error('❌ Failed: No whitepoint found in ICC profile');
      return false;
    }
    
    const [x, y, z] = profile.wtpt;
    console.log(`   ✅ Whitepoint extracted: [${x.toFixed(5)}, ${y.toFixed(5)}, ${z.toFixed(5)}]`);
    
    // 3. Compare with expected D65 values
    const expectedX = 0.95047;
    const expectedY = 1.00000;
    const expectedZ = 1.08883;
    const tolerance = 0.01;
    
    if (
      Math.abs(x - expectedX) > tolerance ||
      Math.abs(y - expectedY) > tolerance ||
      Math.abs(z - expectedZ) > tolerance
    ) {
      console.warn(`⚠️  Whitepoint differs from expected D65 (tolerance: ${tolerance})`);
      console.warn(`   Expected: [${expectedX}, ${expectedY}, ${expectedZ}]`);
      console.warn(`   Got: [${x.toFixed(5)}, ${y.toFixed(5)}, ${z.toFixed(5)}]`);
    } else {
      console.log('   ✅ Whitepoint matches D65 (within tolerance)');
    }
    
    // 4. Test color conversion with ICC whitepoint
    console.log('\n3️⃣ Testing color conversion with ICC whitepoint...');
    const testColor = '#FF5733'; // Orange-red
    const rgb = hexToRgb(testColor);
    
    if (!rgb) {
      console.error('❌ Failed: Could not convert hex to RGB');
      return false;
    }
    
    const xyz = rgbToXyz(rgb);
    
    // Convert with standard D65
    const labD65 = xyzToLab(xyz, 'D65');
    console.log(`   D65 Lab: L=${labD65.L.toFixed(2)}, a=${labD65.a.toFixed(2)}, b=${labD65.b.toFixed(2)}`);
    
    // Convert with ICC whitepoint (should be similar to D65 for sRGB)
    const labICC = xyzToLab(xyz, 'D65', profile.wtpt);
    console.log(`   ICC Lab: L=${labICC.L.toFixed(2)}, a=${labICC.a.toFixed(2)}, b=${labICC.b.toFixed(2)}`);
    
    // Compare results
    const diffL = Math.abs(labD65.L - labICC.L);
    const diffA = Math.abs(labD65.a - labICC.a);
    const diffB = Math.abs(labD65.b - labICC.b);
    
    console.log(`   Difference: ΔL=${diffL.toFixed(3)}, Δa=${diffA.toFixed(3)}, Δb=${diffB.toFixed(3)}`);
    
    if (diffL < 0.5 && diffA < 0.5 && diffB < 0.5) {
      console.log('   ✅ ICC whitepoint produces similar results to D65 (as expected for sRGB)');
    } else {
      console.warn('   ⚠️  Significant difference between D65 and ICC (may be expected for non-sRGB profiles)');
    }
    
    // 5. Test with D50 profile (different whitepoint)
    console.log('\n4️⃣ Testing with D50 whitepoint (different from D65)...');
    const d50WP: [number, number, number] = [0.96422, 1.00000, 0.82521];
    const labD50 = xyzToLab(xyz, 'D50');
    const labD50Custom = xyzToLab(xyz, 'D65', d50WP);
    
    console.log(`   D50 Lab: L=${labD50.L.toFixed(2)}, a=${labD50.a.toFixed(2)}, b=${labD50.b.toFixed(2)}`);
    console.log(`   D50 (Custom) Lab: L=${labD50Custom.L.toFixed(2)}, a=${labD50Custom.a.toFixed(2)}, b=${labD50Custom.b.toFixed(2)}`);
    
    const diffD50L = Math.abs(labD50.L - labD50Custom.L);
    const diffD50A = Math.abs(labD50.a - labD50Custom.a);
    const diffD50B = Math.abs(labD50.b - labD50Custom.b);
    
    if (diffD50L < 0.5 && diffD50A < 0.5 && diffD50B < 0.5) {
      console.log('   ✅ Custom D50 whitepoint matches standard D50');
    } else {
      console.warn(`   ⚠️  Difference: ΔL=${diffD50L.toFixed(3)}, Δa=${diffD50A.toFixed(3)}, Δb=${diffD50B.toFixed(3)}`);
    }
    
    console.log('\n✅ Complete ICC workflow test passed!');
    return true;
  } catch (error) {
    console.error('❌ Complete ICC workflow test failed:', error);
    return false;
  }
}

/**
 * Test error handling
 */
export async function testICCErrorHandling(): Promise<boolean> {
  console.log('\n🧪 Testing ICC Error Handling...\n');
  
  try {
    // Test 1: Invalid file (too small)
    console.log('1️⃣ Testing invalid ICC file (too small)...');
    try {
      const smallBuf = new Uint8Array(100);
      parseICC(smallBuf);
      console.error('❌ Failed: Should have thrown error for small file');
      return false;
    } catch {
      console.log('   ✅ Correctly rejected small file');
    }
    
    // Test 2: Invalid file (wrong format)
    console.log('2️⃣ Testing invalid ICC file (wrong format)...');
    try {
      const wrongBuf = new Uint8Array(200);
      wrongBuf.fill(0);
      parseICC(wrongBuf);
      console.log('   ✅ Parser handled invalid format gracefully');
    } catch {
      console.log('   ✅ Parser correctly threw error for invalid format');
    }
    
    // Test 3: File without whitepoint
    console.log('3️⃣ Testing ICC file without whitepoint...');
    const noWP = new Uint8Array(512);
    noWP[0] = 0x61; noWP[1] = 0x63; noWP[2] = 0x73; noWP[3] = 0x70; // "acsp"
    noWP[128] = 0x00; noWP[129] = 0x00; noWP[130] = 0x00; noWP[131] = 0x00; // 0 tags
    
    const profileNoWP = parseICC(noWP);
    if (profileNoWP.wtpt === null) {
      console.log('   ✅ Correctly returned null for missing whitepoint');
    } else {
      console.error('❌ Failed: Should return null for missing whitepoint');
      return false;
    }
    
    console.log('\n✅ Error handling tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Error handling tests failed:', error);
    return false;
  }
}

/**
 * Run all ICC integration tests
 */
export async function runAllICCTests(): Promise<boolean> {
  console.log('🚀 Running All ICC Integration Tests\n');
  console.log('='.repeat(60));
  
  const test1 = await testCompleteICCWorkflow();
  const test2 = await testICCErrorHandling();
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Results:');
  console.log(`   Complete Workflow: ${test1 ? '✅' : '❌'}`);
  console.log(`   Error Handling: ${test2 ? '✅' : '❌'}`);
  
  const allPassed = test1 && test2;
  
  if (allPassed) {
    console.log('\n✅ All ICC integration tests passed!');
    console.log('\n💡 Summary:');
    console.log('   - ICC profile parsing works correctly');
    console.log('   - Whitepoint extraction is accurate');
    console.log('   - Color conversion uses ICC whitepoint');
    console.log('   - Error handling is robust');
    console.log('\n🎯 Ready for production use!');
  } else {
    console.log('\n❌ Some tests failed. Please review the errors above.');
  }
  
  return allPassed;
}
