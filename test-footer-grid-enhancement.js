#!/usr/bin/env node

/**
 * Test-Script: Footer Grid Enhancement
 * Testet die Verstärkung und Vergrößerung des Grid-Patterns im Footer
 */

const http = require('http');

console.log('🔲 Footer Grid Enhancement Test');
console.log('================================\n');

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

// Test 2: Footer Grid Pattern CSS prüfen
function testFooterGridCSS() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasFooterNetworkPattern = data.includes('footer-network-pattern');
        const hasFooterNetworkFade = data.includes('footer-network-fade');
        const hasEnhancedOpacity = data.includes('rgba(128, 128, 128, 0.25)');
        const hasLargerGrid = data.includes('background-size: 60px 60px');
        const hasThickerLines = data.includes('2px, transparent 2px');
        const hasEnhancedFade = data.includes('rgba(128, 128, 128, 0.35)');
        
        console.log('✅ Footer Grid CSS geprüft');
        console.log(`   Footer Network Pattern: ${hasFooterNetworkPattern}`);
        console.log(`   Footer Network Fade: ${hasFooterNetworkFade}`);
        console.log(`   Enhanced Opacity: ${hasEnhancedOpacity}`);
        console.log(`   Larger Grid (60px): ${hasLargerGrid}`);
        console.log(`   Thicker Lines (2px): ${hasThickerLines}`);
        console.log(`   Enhanced Fade: ${hasEnhancedFade}`);
        
        if (hasFooterNetworkPattern && hasFooterNetworkFade && hasEnhancedOpacity && hasLargerGrid && hasThickerLines && hasEnhancedFade) {
          console.log('   ✅ Footer Grid CSS vollständig verstärkt');
        } else {
          console.log('   ⚠️  Footer Grid CSS könnte unvollständig verstärkt sein');
        }
        
        resolve(hasFooterNetworkPattern && hasFooterNetworkFade && hasEnhancedOpacity && hasLargerGrid && hasThickerLines && hasEnhancedFade);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Footer Grid CSS nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 3: Footer HTML-Struktur prüfen
function testFooterHTML() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasFooterElement = data.includes('<footer');
        const hasNetworkPattern = data.includes('footer-network-pattern');
        const hasNetworkFade = data.includes('footer-network-fade');
        const hasFooterContent = data.includes('Footer') || data.includes('footer');
        const hasFooterClasses = data.includes('relative overflow-hidden');
        
        console.log('✅ Footer HTML geprüft');
        console.log(`   Footer Element: ${hasFooterElement}`);
        console.log(`   Network Pattern: ${hasNetworkPattern}`);
        console.log(`   Network Fade: ${hasNetworkFade}`);
        console.log(`   Footer Content: ${hasFooterContent}`);
        console.log(`   Footer Classes: ${hasFooterClasses}`);
        
        if (hasFooterElement && hasNetworkPattern && hasNetworkFade && hasFooterContent && hasFooterClasses) {
          console.log('   ✅ Footer HTML vollständig implementiert');
        } else {
          console.log('   ⚠️  Footer HTML könnte unvollständig sein');
        }
        
        resolve(hasFooterElement && hasNetworkPattern && hasNetworkFade && hasFooterContent && hasFooterClasses);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Footer HTML nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 4: Grid-Pattern Verbesserungen prüfen
function testGridPatternImprovements() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasOldOpacity = data.includes('rgba(128, 128, 128, 0.08)');
        const hasNewOpacity = data.includes('rgba(128, 128, 128, 0.25)');
        const hasOldSize = data.includes('background-size: 40px 40px');
        const hasNewSize = data.includes('background-size: 60px 60px');
        const hasOldLines = data.includes('1px, transparent 1px');
        const hasNewLines = data.includes('2px, transparent 2px');
        const hasOldMask = data.includes('black 70%');
        const hasNewMask = data.includes('black 80%');
        
        console.log('✅ Grid-Pattern Verbesserungen geprüft');
        console.log(`   Alte Opazität (0.08): ${hasOldOpacity}`);
        console.log(`   Neue Opazität (0.25): ${hasNewOpacity}`);
        console.log(`   Alte Größe (40px): ${hasOldSize}`);
        console.log(`   Neue Größe (60px): ${hasNewSize}`);
        console.log(`   Alte Linien (1px): ${hasOldLines}`);
        console.log(`   Neue Linien (2px): ${hasNewLines}`);
        console.log(`   Alte Maske (70%): ${hasOldMask}`);
        console.log(`   Neue Maske (80%): ${hasNewMask}`);
        
        const improvements = [hasNewOpacity, hasNewSize, hasNewLines, hasNewMask].filter(Boolean).length;
        const oldValues = [hasOldOpacity, hasOldSize, hasOldLines, hasOldMask].filter(Boolean).length;
        
        if (improvements >= 3 && oldValues === 0) {
          console.log('   ✅ Grid-Pattern vollständig verbessert');
        } else {
          console.log('   ⚠️  Grid-Pattern könnte nicht vollständig verbessert sein');
        }
        
        resolve(improvements >= 3 && oldValues === 0);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Grid-Pattern Verbesserungen nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 5: Fade-Verbesserungen prüfen
function testFadeImprovements() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasOldFade = data.includes('rgba(128, 128, 128, 0.12)');
        const hasNewFade = data.includes('rgba(128, 128, 128, 0.35)');
        const hasEnhancedFade = data.includes('rgba(128, 128, 128, 0.25)');
        const hasMoreFadeSteps = data.includes('0.15) 60%');
        const hasExtendedFade = data.includes('0.05) 80%');
        
        console.log('✅ Fade-Verbesserungen geprüft');
        console.log(`   Alter Fade (0.12): ${hasOldFade}`);
        console.log(`   Neuer Fade (0.35): ${hasNewFade}`);
        console.log(`   Enhanced Fade (0.25): ${hasEnhancedFade}`);
        console.log(`   Mehr Fade-Schritte: ${hasMoreFadeSteps}`);
        console.log(`   Erweiterter Fade: ${hasExtendedFade}`);
        
        const fadeImprovements = [hasNewFade, hasEnhancedFade, hasMoreFadeSteps, hasExtendedFade].filter(Boolean).length;
        const oldFade = hasOldFade;
        
        if (fadeImprovements >= 3 && !oldFade) {
          console.log('   ✅ Fade-Verbesserungen vollständig implementiert');
        } else {
          console.log('   ⚠️  Fade-Verbesserungen könnten unvollständig sein');
        }
        
        resolve(fadeImprovements >= 3 && !oldFade);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Fade-Verbesserungen nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Hauptfunktion
async function runTests() {
  console.log('🚀 Starte Footer Grid Enhancement Tests...\n');
  
  const homepageOk = await testHomepage();
  if (!homepageOk) {
    console.log('\n❌ Homepage nicht erreichbar!');
    console.log('Bitte starten Sie: npm run dev');
    return;
  }
  
  console.log('');
  const cssOk = await testFooterGridCSS();
  
  console.log('');
  const htmlOk = await testFooterHTML();
  
  console.log('');
  const gridOk = await testGridPatternImprovements();
  
  console.log('');
  const fadeOk = await testFadeImprovements();
  
  console.log('\n📊 Test-Ergebnisse:');
  console.log('==================');
  console.log(`Homepage erreichbar: ${homepageOk ? '✅' : '❌'}`);
  console.log(`Footer Grid CSS: ${cssOk ? '✅' : '❌'}`);
  console.log(`Footer HTML: ${htmlOk ? '✅' : '❌'}`);
  console.log(`Grid-Pattern Verbesserungen: ${gridOk ? '✅' : '❌'}`);
  console.log(`Fade-Verbesserungen: ${fadeOk ? '✅' : '❌'}`);
  
  if (homepageOk && cssOk && htmlOk && gridOk && fadeOk) {
    console.log('\n🎉 Alle Tests erfolgreich!');
    console.log('   Footer Grid Pattern wurde erfolgreich verstärkt und vergrößert!');
    console.log('\n📋 Was wurde verbessert:');
    console.log('   1. ✅ Grid-Opazität von 0.08 auf 0.25 erhöht (3x stärker)');
    console.log('   2. ✅ Grid-Größe von 40px auf 60px vergrößert (50% größer)');
    console.log('   3. ✅ Linien-Dicke von 1px auf 2px erhöht (2x dicker)');
    console.log('   4. ✅ Mask-Bereich von 70% auf 80% erweitert');
    console.log('   5. ✅ Fade-Opazität von 0.12 auf 0.35 erhöht (3x stärker)');
    console.log('   6. ✅ Mehr Fade-Schritte für sanfteren Übergang');
    console.log('\n🎨 Verbesserungen im Detail:');
    console.log('   - Grid-Pattern: Deutlich sichtbarer und größer');
    console.log('   - Linien: Dicker und kontrastreicher');
    console.log('   - Fade: Sanfterer Übergang mit mehr Stufen');
    console.log('   - Mask: Erweiterter Bereich für bessere Sichtbarkeit');
    console.log('\n🌐 URLs:');
    console.log('   Homepage: http://localhost:3002/de');
    console.log('   Mobile: https://sharp-lamps-pull.loca.lt/de');
  } else {
    console.log('\n⚠️  Einige Tests fehlgeschlagen.');
    console.log('   Bitte überprüfen Sie den Footer manuell.');
  }
}

// Tests ausführen
runTests().catch(console.error);
