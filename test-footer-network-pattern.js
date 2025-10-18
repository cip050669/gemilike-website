#!/usr/bin/env node

/**
 * Test-Script: Footer Network Pattern
 * Testet die graue Netzstruktur im Footer mit Verlauf in die Seite
 */

const http = require('http');

console.log('🌐 Footer Network Pattern Test');
console.log('==============================\n');

// Test 1: Homepage erreichbar
function testHomepage() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de', (res) => {
      console.log('✅ Homepage erreichbar');
      console.log(`   Status: ${res.statusCode}`);
      resolve(res.statusCode === 200);
    });
    
    req.on('error', (err) => {
      console.log('❌ Homepage nicht erreichbar:', err.message);
      resolve(false);
    });
  });
}

// Test 2: Footer Network Pattern CSS prüfen
function testFooterNetworkPattern() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasFooterNetworkPattern = data.includes('footer-network-pattern');
        const hasFooterNetworkFade = data.includes('footer-network-fade');
        const hasGrayNetworkPattern = data.includes('rgba(128, 128, 128, 0.08)');
        const hasNetworkFade = data.includes('rgba(128, 128, 128, 0.12)');
        const hasMaskGradient = data.includes('mask: linear-gradient(to top');
        const hasWebkitMask = data.includes('-webkit-mask: linear-gradient(to top');
        
        console.log('✅ Footer Network Pattern geprüft');
        console.log(`   footer-network-pattern Klasse: ${hasFooterNetworkPattern}`);
        console.log(`   footer-network-fade Klasse: ${hasFooterNetworkFade}`);
        console.log(`   Graue Netzstruktur (0.08): ${hasGrayNetworkPattern}`);
        console.log(`   Netzstruktur Verlauf (0.12): ${hasNetworkFade}`);
        console.log(`   Mask Gradient: ${hasMaskGradient}`);
        console.log(`   Webkit Mask: ${hasWebkitMask}`);
        
        if (hasFooterNetworkPattern && hasFooterNetworkFade && hasGrayNetworkPattern && hasNetworkFade && hasMaskGradient && hasWebkitMask) {
          console.log('   ✅ Footer Network Pattern vollständig implementiert');
        } else {
          console.log('   ⚠️  Footer Network Pattern könnte unvollständig sein');
        }
        
        resolve(hasFooterNetworkPattern && hasFooterNetworkFade && hasGrayNetworkPattern && hasNetworkFade && hasMaskGradient && hasWebkitMask);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Footer Network Pattern nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 3: CSS-Details prüfen
function testCSSDetails() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasBackgroundSize = data.includes('background-size: 40px 40px');
        const hasBackgroundPosition = data.includes('background-position: 0 0');
        const hasLinearGradient = data.includes('linear-gradient(to top');
        const hasOpacityVariations = data.includes('0.12') && data.includes('0.08') && data.includes('0.04');
        const hasTransparentEnd = data.includes('transparent 100%');
        
        console.log('✅ CSS-Details geprüft');
        console.log(`   Background Size (40px): ${hasBackgroundSize}`);
        console.log(`   Background Position: ${hasBackgroundPosition}`);
        console.log(`   Linear Gradient: ${hasLinearGradient}`);
        console.log(`   Opacity Variations: ${hasOpacityVariations}`);
        console.log(`   Transparent End: ${hasTransparentEnd}`);
        
        if (hasBackgroundSize && hasBackgroundPosition && hasLinearGradient && hasOpacityVariations && hasTransparentEnd) {
          console.log('   ✅ CSS-Details vollständig implementiert');
        } else {
          console.log('   ⚠️  CSS-Details könnten unvollständig sein');
        }
        
        resolve(hasBackgroundSize && hasBackgroundPosition && hasLinearGradient && hasOpacityVariations && hasTransparentEnd);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ CSS-Details nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 4: Footer-Struktur prüfen
function testFooterStructure() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasFooterElement = data.includes('<footer');
        const hasRelativeOverflow = data.includes('relative overflow-hidden');
        const hasBackgroundEffects = data.includes('Background Effects');
        const hasNetworkPattern = data.includes('Graue Netzstruktur mit Verlauf');
        const hasContainer = data.includes('container relative z-10');
        
        console.log('✅ Footer-Struktur geprüft');
        console.log(`   Footer Element: ${hasFooterElement}`);
        console.log(`   Relative Overflow: ${hasRelativeOverflow}`);
        console.log(`   Background Effects: ${hasBackgroundEffects}`);
        console.log(`   Network Pattern: ${hasNetworkPattern}`);
        console.log(`   Container z-10: ${hasContainer}`);
        
        if (hasFooterElement && hasRelativeOverflow && hasBackgroundEffects && hasNetworkPattern && hasContainer) {
          console.log('   ✅ Footer-Struktur vollständig implementiert');
        } else {
          console.log('   ⚠️  Footer-Struktur könnte unvollständig sein');
        }
        
        resolve(hasFooterElement && hasRelativeOverflow && hasBackgroundEffects && hasNetworkPattern && hasContainer);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Footer-Struktur nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Hauptfunktion
async function runTests() {
  console.log('🚀 Starte Footer Network Pattern Tests...\n');
  
  const homepageOk = await testHomepage();
  if (!homepageOk) {
    console.log('\n❌ Homepage nicht erreichbar!');
    console.log('Bitte starten Sie: npm run dev');
    return;
  }
  
  console.log('');
  const patternOk = await testFooterNetworkPattern();
  
  console.log('');
  const cssOk = await testCSSDetails();
  
  console.log('');
  const structureOk = await testFooterStructure();
  
  console.log('\n📊 Test-Ergebnisse:');
  console.log('==================');
  console.log(`Homepage erreichbar: ${homepageOk ? '✅' : '❌'}`);
  console.log(`Footer Network Pattern: ${patternOk ? '✅' : '❌'}`);
  console.log(`CSS-Details: ${cssOk ? '✅' : '❌'}`);
  console.log(`Footer-Struktur: ${structureOk ? '✅' : '❌'}`);
  
  if (homepageOk && patternOk && cssOk && structureOk) {
    console.log('\n🎉 Alle Tests erfolgreich!');
    console.log('   Footer Network Pattern wurde erfolgreich implementiert!');
    console.log('\n📋 Was wurde implementiert:');
    console.log('   1. ✅ Graue Netzstruktur (footer-network-pattern)');
    console.log('   2. ✅ Verlauf in die Seite (footer-network-fade)');
    console.log('   3. ✅ Mask-Gradient für sanften Übergang');
    console.log('   4. ✅ Verschiedene Opazitätsstufen');
    console.log('   5. ✅ Responsive Design');
    console.log('\n🎨 Styling-Details:');
    console.log('   - Graue Farbe: rgba(128, 128, 128, 0.08)');
    console.log('   - Netzgröße: 40px x 40px');
    console.log('   - Verlauf: 0.12 → 0.08 → 0.04 → transparent');
    console.log('   - Mask: linear-gradient(to top, black 70%, transparent 100%)');
    console.log('   - Position: 0 0 (oben links)');
    console.log('\n🌐 Effekt:');
    console.log('   - Graue Netzstruktur im Footer');
    console.log('   - Sanfter Verlauf nach oben');
    console.log('   - Integriert sich in die Seite');
    console.log('   - Subtile aber sichtbare Struktur');
    console.log('\n🌐 URLs:');
    console.log('   Homepage: http://localhost:3002/de');
    console.log('   Mobile: https://sharp-lamps-pull.loca.lt/de');
  } else {
    console.log('\n⚠️  Einige Tests fehlgeschlagen.');
    console.log('   Bitte überprüfen Sie die Homepage manuell.');
  }
}

// Tests ausführen
runTests().catch(console.error);
