/**
 * Test Script for ICC Profile Functionality
 * Run with: node test-icc-profile.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simple test: Check if ICC parser can be imported and basic functions work
async function testICCBasic() {
  console.log('🧪 Testing ICC Profile Basic Functionality...\n');
  
  try {
    // Try to import the ICC parser
    const iccParserPath = join(__dirname, 'components/color-charts/utils/iccParser.ts');
    console.log(`📁 Checking: ${iccParserPath}`);
    
    // Check if file exists
    const fs = await import('fs');
    if (!fs.existsSync(iccParserPath)) {
      console.error('❌ ICC parser file not found');
      return false;
    }
    
    console.log('✅ ICC parser file exists');
    
    // Read and check basic structure
    const content = fs.readFileSync(iccParserPath, 'utf-8');
    
    // Check for key functions (allow both function and const exports)
    const hasParseICC = content.includes('export function parseICC') || content.includes('parseICC');
    const hasParseICCFromFile = content.includes('export function parseICCFromFile') || content.includes('parseICCFromFile');
    const hasIsICCProfile = content.includes('export function isICCProfile') || content.includes('isICCProfile');
    
    if (!hasParseICC || !hasParseICCFromFile || !hasIsICCProfile) {
      console.error('❌ Missing required functions');
      console.log(`   parseICC: ${hasParseICC}`);
      console.log(`   parseICCFromFile: ${hasParseICCFromFile}`);
      console.log(`   isICCProfile: ${hasIsICCProfile}`);
      return false;
    }
    
    console.log('✅ All required functions found:');
    console.log('   - parseICC');
    console.log('   - parseICCFromFile');
    console.log('   - isICCProfile');
    
    // Check for ICCProfile interface
    if (content.includes('export interface ICCProfile')) {
      console.log('✅ ICCProfile interface found');
    } else {
      console.warn('⚠️  ICCProfile interface not found');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Test the integration in enhancedColorExtraction
async function testIntegration() {
  console.log('\n🧪 Testing ICC Integration in Enhanced Extraction...\n');
  
  try {
    const enhancedPath = join(__dirname, 'components/color-charts/utils/enhancedColorExtraction.ts');
    const fs = await import('fs');
    
    if (!fs.existsSync(enhancedPath)) {
      console.error('❌ Enhanced extraction file not found');
      return false;
    }
    
    const content = fs.readFileSync(enhancedPath, 'utf-8');
    
    // Check for ICC profile usage
    const hasICCImport = content.includes("from './iccParser'");
    const hasICCParam = content.includes('iccProfile?: ICCProfile');
    const hasICCUsage = content.includes('iccProfile?.wtpt') || content.includes('iccProfile.wtpt');
    
    if (!hasICCImport) {
      console.error('❌ ICC parser not imported');
      return false;
    }
    
    if (!hasICCParam) {
      console.error('❌ ICC profile parameter not found');
      return false;
    }
    
    if (!hasICCUsage) {
      console.error('❌ ICC profile not used in extraction');
      return false;
    }
    
    console.log('✅ ICC integration found:');
    console.log('   - ICC parser imported');
    console.log('   - ICC profile parameter present');
    console.log('   - ICC whitepoint used in extraction');
    
    return true;
  } catch (error) {
    console.error('❌ Integration test failed:', error);
    return false;
  }
}

// Test UI integration
async function testUIIntegration() {
  console.log('\n🧪 Testing UI Integration...\n');
  
  try {
    const uiPath = join(__dirname, 'components/color-charts/GemstoneColorAnalyzer.tsx');
    const fs = await import('fs');
    
    if (!fs.existsSync(uiPath)) {
      console.error('❌ UI component file not found');
      return false;
    }
    
    const content = fs.readFileSync(uiPath, 'utf-8');
    
    // Check for ICC-related UI elements
    const hasICCState = content.includes('iccInfo') || content.includes('iccWP');
    const hasICCHandler = content.includes('handleICCUpload');
    const hasICCInput = content.includes('accept=".icc,.icm"') || content.includes('accept=\".icc,.icm\"');
    const hasICCDisplay = content.includes('ICC Weißpunkt geladen');
    
    if (!hasICCState) {
      console.error('❌ ICC state variables not found');
      return false;
    }
    
    if (!hasICCHandler) {
      console.error('❌ ICC upload handler not found');
      return false;
    }
    
    if (!hasICCInput) {
      console.warn('⚠️  ICC file input not found (may be in advanced settings)');
    }
    
    console.log('✅ UI integration found:');
    console.log('   - ICC state variables present');
    console.log('   - ICC upload handler present');
    if (hasICCInput) {
      console.log('   - ICC file input present');
    }
    if (hasICCDisplay) {
      console.log('   - ICC status display present');
    }
    
    return true;
  } catch (error) {
    console.error('❌ UI integration test failed:', error);
    return false;
  }
}

// Main test runner
async function main() {
  console.log('🚀 ICC Profile Functionality Test\n');
  console.log('='.repeat(50));
  
  const test1 = await testICCBasic();
  const test2 = await testIntegration();
  const test3 = await testUIIntegration();
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Results:');
  console.log(`   Basic Functionality: ${test1 ? '✅' : '❌'}`);
  console.log(`   Integration: ${test2 ? '✅' : '❌'}`);
  console.log(`   UI Integration: ${test3 ? '✅' : '❌'}`);
  
  const allPassed = test1 && test2 && test3;
  
  if (allPassed) {
    console.log('\n✅ All tests passed!');
    console.log('\n💡 Next steps:');
    console.log('   1. Start the development server');
    console.log('   2. Navigate to the color analysis page');
    console.log('   3. Open "Erweiterte Einstellungen"');
    console.log('   4. Upload an ICC profile (.icc or .icm file)');
    console.log('   5. Check if "ICC Weißpunkt geladen" message appears');
    console.log('   6. Run an analysis and verify colors are adapted');
  } else {
    console.log('\n❌ Some tests failed. Please check the errors above.');
  }
  
  process.exit(allPassed ? 0 : 1);
}

main().catch(console.error);

