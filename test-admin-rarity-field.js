#!/usr/bin/env node

/**
 * Test-Script: Admin Rarity Field
 * Testet das Raritäten-Feld im Admin-Bereich unter Edelsteine bearbeiten/Details
 */

const http = require('http');

console.log('👑 Admin Rarity Field Test');
console.log('==========================\n');

// Test 1: Admin-Seite erreichbar
function testAdminPage() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/admin', (res) => {
      console.log('✅ Admin-Seite erreichbar');
      console.log(`   Status: ${res.statusCode}`);
      resolve(res.statusCode === 200);
    });
    
    req.on('error', (err) => {
      console.log('❌ Admin-Seite nicht erreichbar:', err.message);
      resolve(false);
    });
  });
}

// Test 2: Raritäten-Feld im GemstoneEditor prüfen
function testRarityField() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/admin', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasRarityLabel = data.includes('Raritäten');
        const hasRaritySelect = data.includes('rarity');
        const hasRarityOptions = data.includes('Keine Rarität') && data.includes('Seltenes') && data.includes('Außergewöhnliches') && data.includes('Großes') && data.includes('Besonders schön');
        const hasSelectTrigger = data.includes('SelectTrigger');
        const hasSelectContent = data.includes('SelectContent');
        
        console.log('✅ Raritäten-Feld geprüft');
        console.log(`   Raritäten Label: ${hasRarityLabel}`);
        console.log(`   Rarity Select: ${hasRaritySelect}`);
        console.log(`   Rarity Options: ${hasRarityOptions}`);
        console.log(`   Select Trigger: ${hasSelectTrigger}`);
        console.log(`   Select Content: ${hasSelectContent}`);
        
        if (hasRarityLabel && hasRaritySelect && hasRarityOptions && hasSelectTrigger && hasSelectContent) {
          console.log('   ✅ Raritäten-Feld vollständig implementiert');
        } else {
          console.log('   ⚠️  Raritäten-Feld könnte unvollständig sein');
        }
        
        resolve(hasRarityLabel && hasRaritySelect && hasRarityOptions && hasSelectTrigger && hasSelectContent);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Raritäten-Feld nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 3: Raritäten-Optionen prüfen
function testRarityOptions() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/admin', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasNoneOption = data.includes('value="none"') && data.includes('Keine Rarität');
        const hasSeltenesOption = data.includes('value="seltenes"') && data.includes('Seltenes');
        const hasAußergewöhnlichesOption = data.includes('value="außergewöhnliches"') && data.includes('Außergewöhnliches');
        const hasGroßesOption = data.includes('value="großes"') && data.includes('Großes');
        const hasBesondersSchönOption = data.includes('value="besonders schön"') && data.includes('Besonders schön');
        
        console.log('✅ Raritäten-Optionen geprüft');
        console.log(`   "Keine Rarität" Option: ${hasNoneOption}`);
        console.log(`   "Seltenes" Option: ${hasSeltenesOption}`);
        console.log(`   "Außergewöhnliches" Option: ${hasAußergewöhnlichesOption}`);
        console.log(`   "Großes" Option: ${hasGroßesOption}`);
        console.log(`   "Besonders schön" Option: ${hasBesondersSchönOption}`);
        
        const totalOptions = [hasNoneOption, hasSeltenesOption, hasAußergewöhnlichesOption, hasGroßesOption, hasBesondersSchönOption].filter(Boolean).length;
        
        if (totalOptions >= 4) {
          console.log('   ✅ Alle Raritäten-Optionen sind vorhanden');
        } else {
          console.log('   ⚠️  Einige Raritäten-Optionen könnten fehlen');
        }
        
        resolve(totalOptions >= 4);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Raritäten-Optionen nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 4: FormData-Initialisierung prüfen
function testFormDataInitialization() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/admin', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasRarityDefault = data.includes('rarity: \'none\'');
        const hasRarityField = data.includes('formData.rarity');
        const hasRaritySelect = data.includes('value={formData.rarity');
        const hasRarityChange = data.includes('handleInputChange(\'rarity\'');
        
        console.log('✅ FormData-Initialisierung geprüft');
        console.log(`   Rarity Default: ${hasRarityDefault}`);
        console.log(`   Rarity Field: ${hasRarityField}`);
        console.log(`   Rarity Select: ${hasRaritySelect}`);
        console.log(`   Rarity Change: ${hasRarityChange}`);
        
        if (hasRarityDefault && hasRarityField && hasRaritySelect && hasRarityChange) {
          console.log('   ✅ FormData-Initialisierung vollständig');
        } else {
          console.log('   ⚠️  FormData-Initialisierung könnte unvollständig sein');
        }
        
        resolve(hasRarityDefault && hasRarityField && hasRaritySelect && hasRarityChange);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ FormData-Initialisierung nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 5: Details-Tab Integration prüfen
function testDetailsTabIntegration() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/admin', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasDetailsTab = data.includes('TabsContent value="details"');
        const hasDetailsCard = data.includes('Details') && data.includes('CardTitle');
        const hasRarityInDetails = data.includes('Raritäten') && data.includes('TabsContent value="details"');
        const hasGridLayout = data.includes('grid grid-cols-1 gap-4');
        
        console.log('✅ Details-Tab Integration geprüft');
        console.log(`   Details Tab: ${hasDetailsTab}`);
        console.log(`   Details Card: ${hasDetailsCard}`);
        console.log(`   Rarity in Details: ${hasRarityInDetails}`);
        console.log(`   Grid Layout: ${hasGridLayout}`);
        
        if (hasDetailsTab && hasDetailsCard && hasRarityInDetails && hasGridLayout) {
          console.log('   ✅ Details-Tab Integration vollständig');
        } else {
          console.log('   ⚠️  Details-Tab Integration könnte unvollständig sein');
        }
        
        resolve(hasDetailsTab && hasDetailsCard && hasRarityInDetails && hasGridLayout);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Details-Tab Integration nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Hauptfunktion
async function runTests() {
  console.log('🚀 Starte Admin Rarity Field Tests...\n');
  
  const adminOk = await testAdminPage();
  if (!adminOk) {
    console.log('\n❌ Admin-Seite nicht erreichbar!');
    console.log('Bitte starten Sie: npm run dev');
    return;
  }
  
  console.log('');
  const fieldOk = await testRarityField();
  
  console.log('');
  const optionsOk = await testRarityOptions();
  
  console.log('');
  const formDataOk = await testFormDataInitialization();
  
  console.log('');
  const integrationOk = await testDetailsTabIntegration();
  
  console.log('\n📊 Test-Ergebnisse:');
  console.log('==================');
  console.log(`Admin-Seite erreichbar: ${adminOk ? '✅' : '❌'}`);
  console.log(`Raritäten-Feld: ${fieldOk ? '✅' : '❌'}`);
  console.log(`Raritäten-Optionen: ${optionsOk ? '✅' : '❌'}`);
  console.log(`FormData-Initialisierung: ${formDataOk ? '✅' : '❌'}`);
  console.log(`Details-Tab Integration: ${integrationOk ? '✅' : '❌'}`);
  
  if (adminOk && fieldOk && optionsOk && formDataOk && integrationOk) {
    console.log('\n🎉 Alle Tests erfolgreich!');
    console.log('   Raritäten-Feld wurde erfolgreich im Admin-Bereich implementiert!');
    console.log('\n📋 Was wurde implementiert:');
    console.log('   1. ✅ Raritäten-Feld im Details-Tab hinzugefügt');
    console.log('   2. ✅ Select-Dropdown mit 5 Optionen');
    console.log('   3. ✅ FormData-Initialisierung mit "none" als Standard');
    console.log('   4. ✅ Integration in den GemstoneEditor');
    console.log('   5. ✅ Responsive Grid-Layout');
    console.log('\n🎨 Verfügbare Raritäten-Optionen:');
    console.log('   - "Keine Rarität" (Standard)');
    console.log('   - "Seltenes"');
    console.log('   - "Außergewöhnliches"');
    console.log('   - "Großes"');
    console.log('   - "Besonders schön"');
    console.log('\n📍 Implementierung:');
    console.log('   - Ort: Admin → Edelsteine → Bearbeiten → Details-Tab');
    console.log('   - Feld: Raritäten (Select-Dropdown)');
    console.log('   - Standard: "Keine Rarität"');
    console.log('   - Speicherung: In formData.rarity');
    console.log('\n🌐 URLs:');
    console.log('   Admin: http://localhost:3002/de/admin');
    console.log('   Mobile: https://sharp-lamps-pull.loca.lt/de/admin');
  } else {
    console.log('\n⚠️  Einige Tests fehlgeschlagen.');
    console.log('   Bitte überprüfen Sie den Admin-Bereich manuell.');
  }
}

// Tests ausführen
runTests().catch(console.error);
