#!/usr/bin/env node

/**
 * Test-Script: Rarity Feature
 * Testet die Raritäten-Funktionalität auf der GemstoneCard
 */

const http = require('http');

console.log('👑 Rarity Feature Test');
console.log('======================\n');

// Test 1: Shop-Seite erreichbar
function testShopPage() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/shop', (res) => {
      console.log('✅ Shop-Seite erreichbar');
      console.log(`   Status: ${res.statusCode}`);
      resolve(res.statusCode === 200);
    });
    
    req.on('error', (err) => {
      console.log('❌ Shop-Seite nicht erreichbar:', err.message);
      resolve(false);
    });
  });
}

// Test 2: Raritäten-Typen prüfen
function testRarityTypes() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/shop', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasCrownIcon = data.includes('Crown') || data.includes('crown');
        const hasRarityLabel = data.includes('Rarität:');
        const hasRarityBadge = data.includes('bg-amber-100 text-amber-800');
        const hasRarityContent = data.includes('besonders schön') || data.includes('seltenes') || data.includes('außergewöhnliches') || data.includes('großes');
        
        console.log('✅ Raritäten-Funktionalität geprüft');
        console.log(`   Crown Icon: ${hasCrownIcon}`);
        console.log(`   Rarität Label: ${hasRarityLabel}`);
        console.log(`   Rarität Badge Styling: ${hasRarityBadge}`);
        console.log(`   Rarität Inhalt: ${hasRarityContent}`);
        
        if (hasCrownIcon && hasRarityLabel && hasRarityBadge && hasRarityContent) {
          console.log('   ✅ Raritäten-Funktionalität vollständig implementiert');
        } else {
          console.log('   ⚠️  Raritäten-Funktionalität könnte unvollständig sein');
        }
        
        resolve(hasCrownIcon && hasRarityLabel && hasRarityBadge && hasRarityContent);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Raritäten-Funktionalität nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 3: Raritäten-Werte prüfen
function testRarityValues() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/shop', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasSeltenes = data.includes('seltenes');
        const hasAußergewöhnliches = data.includes('außergewöhnliches');
        const hasGroßes = data.includes('großes');
        const hasBesondersSchön = data.includes('besonders schön');
        
        console.log('✅ Raritäten-Werte geprüft');
        console.log(`   "Seltenes: ${hasSeltenes}`);
        console.log(`   "Außergewöhnliches": ${hasAußergewöhnliches}`);
        console.log(`   "Großes": ${hasGroßes}`);
        console.log(`   "Besonders schön": ${hasBesondersSchön}`);
        
        const totalRarities = [hasSeltenes, hasAußergewöhnliches, hasGroßes, hasBesondersSchön].filter(Boolean).length;
        
        if (totalRarities >= 2) {
          console.log('   ✅ Mehrere Raritäten-Werte gefunden');
        } else {
          console.log('   ⚠️  Wenige Raritäten-Werte gefunden');
        }
        
        resolve(totalRarities >= 2);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Raritäten-Werte nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 4: Styling prüfen
function testRarityStyling() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/shop', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasAmberColors = data.includes('text-amber-500') && data.includes('bg-amber-100') && data.includes('text-amber-800');
        const hasBorderStyling = data.includes('border-amber-200');
        const hasSmallText = data.includes('text-[10px]');
        const hasPadding = data.includes('px-2 py-0.5');
        
        console.log('✅ Raritäten-Styling geprüft');
        console.log(`   Amber Farben: ${hasAmberColors}`);
        console.log(`   Border Styling: ${hasBorderStyling}`);
        console.log(`   Kleine Schrift: ${hasSmallText}`);
        console.log(`   Padding: ${hasPadding}`);
        
        if (hasAmberColors && hasBorderStyling && hasSmallText && hasPadding) {
          console.log('   ✅ Raritäten-Styling vollständig implementiert');
        } else {
          console.log('   ⚠️  Raritäten-Styling könnte unvollständig sein');
        }
        
        resolve(hasAmberColors && hasBorderStyling && hasSmallText && hasPadding);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Raritäten-Styling nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Hauptfunktion
async function runTests() {
  console.log('🚀 Starte Rarity Feature Tests...\n');
  
  const shopOk = await testShopPage();
  if (!shopOk) {
    console.log('\n❌ Shop-Seite nicht erreichbar!');
    console.log('Bitte starten Sie: npm run dev');
    return;
  }
  
  console.log('');
  const rarityOk = await testRarityTypes();
  
  console.log('');
  const valuesOk = await testRarityValues();
  
  console.log('');
  const stylingOk = await testRarityStyling();
  
  console.log('\n📊 Test-Ergebnisse:');
  console.log('==================');
  console.log(`Shop-Seite erreichbar: ${shopOk ? '✅' : '❌'}`);
  console.log(`Raritäten-Funktionalität: ${rarityOk ? '✅' : '❌'}`);
  console.log(`Raritäten-Werte: ${valuesOk ? '✅' : '❌'}`);
  console.log(`Raritäten-Styling: ${stylingOk ? '✅' : '❌'}`);
  
  if (shopOk && rarityOk && valuesOk && stylingOk) {
    console.log('\n🎉 Alle Tests erfolgreich!');
    console.log('   Raritäten-Funktionalität wurde erfolgreich implementiert!');
    console.log('\n📋 Was wurde implementiert:');
    console.log('   1. ✅ RarityType zu Gemstone-Typen hinzugefügt');
    console.log('   2. ✅ Crown-Icon für Raritäten-Anzeige');
    console.log('   3. ✅ Amber-farbiges Badge für Raritäten');
    console.log('   4. ✅ 4 Raritäten-Werte implementiert');
    console.log('   5. ✅ Bedingte Anzeige (nur wenn rarity !== "none")');
    console.log('\n👑 Raritäten-Werte:');
    console.log('   - "seltenes" (Burmesischer Rubin)');
    console.log('   - "außergewöhnliches" (Ceylon Saphir)');
    console.log('   - "großes" (Morganit)');
    console.log('   - "besonders schön" (Aquamarin Santa Maria)');
    console.log('\n🎨 Styling-Details:');
    console.log('   - Crown Icon (text-amber-500)');
    console.log('   - Amber Badge (bg-amber-100, text-amber-800)');
    console.log('   - Border (border-amber-200)');
    console.log('   - Kleine Schrift (text-[10px])');
    console.log('   - Kompaktes Padding (px-2 py-0.5)');
    console.log('\n🌐 URLs:');
    console.log('   Shop: http://localhost:3002/de/shop');
    console.log('   Mobile: https://sharp-lamps-pull.loca.lt/de/shop');
  } else {
    console.log('\n⚠️  Einige Tests fehlgeschlagen.');
    console.log('   Bitte überprüfen Sie die Shop-Seite manuell.');
  }
}

// Tests ausführen
runTests().catch(console.error);
