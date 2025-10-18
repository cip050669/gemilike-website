#!/usr/bin/env node

/**
 * Test-Script: Shop Tabs Update
 * Testet die Erweiterung der Shop-Tabs um "Raritäten" und das neue Styling
 */

const http = require('http');

console.log('🛍️  Shop Tabs Update Test');
console.log('=========================\n');

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

// Test 2: Neue Tabs prüfen
function testNewTabs() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/shop', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasAllTab = data.includes('Alle') || data.includes('all');
        const hasCutTab = data.includes('Geschliffen') || data.includes('cut');
        const hasRoughTab = data.includes('Roh') || data.includes('rough');
        const hasRareTab = data.includes('Raritäten') || data.includes('rare');
        const hasFourTabs = (data.match(/TabsTrigger/g) || []).length >= 4;
        
        console.log('✅ Shop-Tabs geprüft');
        console.log(`   "Alle" Tab: ${hasAllTab}`);
        console.log(`   "Geschliffen" Tab: ${hasCutTab}`);
        console.log(`   "Roh" Tab: ${hasRoughTab}`);
        console.log(`   "Raritäten" Tab: ${hasRareTab}`);
        console.log(`   Mindestens 4 Tabs: ${hasFourTabs}`);
        
        if (hasAllTab && hasCutTab && hasRoughTab && hasRareTab && hasFourTabs) {
          console.log('   ✅ Alle 4 Tabs sind vorhanden');
        } else {
          console.log('   ⚠️  Einige Tabs könnten fehlen');
        }
        
        resolve(hasAllTab && hasCutTab && hasRoughTab && hasRareTab && hasFourTabs);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Shop-Tabs nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 3: Neues Styling prüfen
function testNewStyling() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/shop', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasFlexLayout = data.includes('flex space-x-1');
        const hasMutedBackground = data.includes('bg-muted');
        const hasRoundedLayout = data.includes('rounded-lg');
        const hasActiveStyling = data.includes('data-[state=active]:bg-primary');
        const hasTransition = data.includes('transition-all duration-300');
        const hasShadow = data.includes('data-[state=active]:shadow-sm');
        
        console.log('✅ Neues Tab-Styling geprüft');
        console.log(`   Flex Layout: ${hasFlexLayout}`);
        console.log(`   Muted Background: ${hasMutedBackground}`);
        console.log(`   Rounded Layout: ${hasRoundedLayout}`);
        console.log(`   Active Primary Background: ${hasActiveStyling}`);
        console.log(`   Transition Animation: ${hasTransition}`);
        console.log(`   Active Shadow: ${hasShadow}`);
        
        if (hasFlexLayout && hasMutedBackground && hasRoundedLayout && hasActiveStyling && hasTransition && hasShadow) {
          console.log('   ✅ Newsletter-Admin-Styling erfolgreich angewendet');
        } else {
          console.log('   ⚠️  Styling könnte unvollständig sein');
        }
        
        resolve(hasFlexLayout && hasMutedBackground && hasRoundedLayout && hasActiveStyling && hasTransition && hasShadow);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Tab-Styling nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 4: Raritäten-Filter prüfen
function testRareFilter() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/shop', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasRareContent = data.includes('TabsContent value="rare"');
        const hasRareFilter = data.includes('rareGemstones');
        const hasRareMessage = data.includes('Keine Raritäten gefunden');
        
        console.log('✅ Raritäten-Filter geprüft');
        console.log(`   Raritäten TabsContent: ${hasRareContent}`);
        console.log(`   Raritäten Filter Variable: ${hasRareFilter}`);
        console.log(`   Raritäten Fehlermeldung: ${hasRareMessage}`);
        
        if (hasRareContent && hasRareFilter && hasRareMessage) {
          console.log('   ✅ Raritäten-Filter vollständig implementiert');
        } else {
          console.log('   ⚠️  Raritäten-Filter könnte unvollständig sein');
        }
        
        resolve(hasRareContent && hasRareFilter && hasRareMessage);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Raritäten-Filter nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Hauptfunktion
async function runTests() {
  console.log('🚀 Starte Shop Tabs Update Tests...\n');
  
  const shopOk = await testShopPage();
  if (!shopOk) {
    console.log('\n❌ Shop-Seite nicht erreichbar!');
    console.log('Bitte starten Sie: npm run dev');
    return;
  }
  
  console.log('');
  const tabsOk = await testNewTabs();
  
  console.log('');
  const stylingOk = await testNewStyling();
  
  console.log('');
  const rareOk = await testRareFilter();
  
  console.log('\n📊 Test-Ergebnisse:');
  console.log('==================');
  console.log(`Shop-Seite erreichbar: ${shopOk ? '✅' : '❌'}`);
  console.log(`Neue Tabs (4 Tabs): ${tabsOk ? '✅' : '❌'}`);
  console.log(`Newsletter-Styling: ${stylingOk ? '✅' : '❌'}`);
  console.log(`Raritäten-Filter: ${rareOk ? '✅' : '❌'}`);
  
  if (shopOk && tabsOk && stylingOk && rareOk) {
    console.log('\n🎉 Alle Tests erfolgreich!');
    console.log('   Shop-Tabs wurden erfolgreich erweitert und gestylt!');
    console.log('\n📋 Was wurde implementiert:');
    console.log('   1. ✅ "Raritäten" Tab hinzugefügt (4. Tab)');
    console.log('   2. ✅ Newsletter-Admin-Styling angewendet');
    console.log('   3. ✅ Aktiver Tab mit blauem Hintergrund');
    console.log('   4. ✅ Smooth Transitions und Shadows');
    console.log('   5. ✅ Raritäten-Filter implementiert');
    console.log('\n🎨 Styling-Details:');
    console.log('   - Flex Layout mit space-x-1');
    console.log('   - bg-muted Hintergrund');
    console.log('   - rounded-lg Ecken');
    console.log('   - data-[state=active]:bg-primary (blauer aktiver Tab)');
    console.log('   - transition-all duration-300');
    console.log('   - data-[state=active]:shadow-sm');
    console.log('\n🏷️  Verfügbare Tabs:');
    console.log('   - Alle (alle Edelsteine)');
    console.log('   - Geschliffen (cut)');
    console.log('   - Roh (rough)');
    console.log('   - Raritäten (rare)');
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
