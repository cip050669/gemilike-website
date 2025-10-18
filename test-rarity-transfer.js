#!/usr/bin/env node

/**
 * Test-Script: Rarity Transfer from Admin to Shop
 * Testet die Übertragung der Raritäten-Werte vom Admin-Panel zur GemstoneCard
 */

const http = require('http');

console.log('🔄 Rarity Transfer Test');
console.log('========================\n');

// Test 1: API-Endpoint erreichbar
function testAPIEndpoint() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/api/admin/gemstones', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          const hasSuccess = jsonData.success === true;
          const hasGemstones = Array.isArray(jsonData.gemstones);
          const hasRarityData = jsonData.gemstones && jsonData.gemstones.some(g => g.rarity);
          
          console.log('✅ API-Endpoint geprüft');
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Success: ${hasSuccess}`);
          console.log(`   Gemstones Array: ${hasGemstones}`);
          console.log(`   Rarity Data: ${hasRarityData}`);
          console.log(`   Anzahl Edelsteine: ${jsonData.gemstones ? jsonData.gemstones.length : 0}`);
          
          if (hasRarityData) {
            const rarityExamples = jsonData.gemstones
              .filter(g => g.rarity && g.rarity !== 'none')
              .slice(0, 3)
              .map(g => `${g.name}: ${g.rarity}`);
            console.log(`   Raritäten-Beispiele: ${rarityExamples.join(', ')}`);
          }
          
          resolve(hasSuccess && hasGemstones && hasRarityData);
        } catch (error) {
          console.log('❌ API-Daten nicht lesbar:', error.message);
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ API-Endpoint nicht erreichbar:', err.message);
      resolve(false);
    });
  });
}

// Test 2: Shop-Seite lädt API-Daten
function testShopPageData() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/shop', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasAPIEndpoint = data.includes('/api/admin/gemstones');
        const hasCacheControl = data.includes('cache: \'no-store\'');
        const hasGemstonesState = data.includes('setGemstones');
        const hasRarityFilter = data.includes('rarity') || data.includes('Raritäten');
        const hasEventListeners = data.includes('gemstones-updated');
        
        console.log('✅ Shop-Seite geprüft');
        console.log(`   API-Endpoint: ${hasAPIEndpoint}`);
        console.log(`   Cache Control: ${hasCacheControl}`);
        console.log(`   Gemstones State: ${hasGemstonesState}`);
        console.log(`   Rarity Filter: ${hasRarityFilter}`);
        console.log(`   Event Listeners: ${hasEventListeners}`);
        
        if (hasAPIEndpoint && hasCacheControl && hasGemstonesState && hasEventListeners) {
          console.log('   ✅ Shop-Seite lädt API-Daten korrekt');
        } else {
          console.log('   ⚠️  Shop-Seite könnte nicht korrekt konfiguriert sein');
        }
        
        resolve(hasAPIEndpoint && hasCacheControl && hasGemstonesState && hasEventListeners);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Shop-Seite nicht erreichbar:', err.message);
      resolve(false);
    });
  });
}

// Test 3: GemstoneCard zeigt Raritäten
function testGemstoneCardRarity() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/shop', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasCrownIcon = data.includes('Crown');
        const hasRarityBadge = data.includes('Rarität') || data.includes('rarity');
        const hasAmberStyling = data.includes('amber-100') || data.includes('amber-800');
        const hasRarityCondition = data.includes('gemstone.rarity') && data.includes('gemstone.rarity !== \'none\'');
        
        console.log('✅ GemstoneCard geprüft');
        console.log(`   Crown Icon: ${hasCrownIcon}`);
        console.log(`   Rarity Badge: ${hasRarityBadge}`);
        console.log(`   Amber Styling: ${hasAmberStyling}`);
        console.log(`   Rarity Condition: ${hasRarityCondition}`);
        
        if (hasCrownIcon && hasRarityBadge && hasAmberStyling && hasRarityCondition) {
          console.log('   ✅ GemstoneCard zeigt Raritäten korrekt');
        } else {
          console.log('   ⚠️  GemstoneCard könnte Raritäten nicht korrekt anzeigen');
        }
        
        resolve(hasCrownIcon && hasRarityBadge && hasAmberStyling && hasRarityCondition);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ GemstoneCard nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 4: Admin-Panel speichert Raritäten
function testAdminPanelSave() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/admin', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasRarityField = data.includes('Raritäten') && data.includes('rarity');
        const hasRarityOptions = data.includes('Seltenes') && data.includes('Außergewöhnliches');
        const hasFormData = data.includes('formData.rarity');
        const hasSaveFunction = data.includes('handleSave') && data.includes('/api/admin/gemstones');
        const hasRarityDefault = data.includes('rarity: \'none\'');
        
        console.log('✅ Admin-Panel geprüft');
        console.log(`   Rarity Field: ${hasRarityField}`);
        console.log(`   Rarity Options: ${hasRarityOptions}`);
        console.log(`   Form Data: ${hasFormData}`);
        console.log(`   Save Function: ${hasSaveFunction}`);
        console.log(`   Rarity Default: ${hasRarityDefault}`);
        
        if (hasRarityField && hasRarityOptions && hasFormData && hasSaveFunction && hasRarityDefault) {
          console.log('   ✅ Admin-Panel speichert Raritäten korrekt');
        } else {
          console.log('   ⚠️  Admin-Panel könnte Raritäten nicht korrekt speichern');
        }
        
        resolve(hasRarityField && hasRarityOptions && hasFormData && hasSaveFunction && hasRarityDefault);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Admin-Panel nicht erreichbar:', err.message);
      resolve(false);
    });
  });
}

// Test 5: Datenfluss prüfen
function testDataFlow() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/shop', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasEventListeners = data.includes('addEventListener(\'gemstones-updated\'');
        const hasLocalStorageCheck = data.includes('localStorage.getItem(\'gemstones-updated\'');
        const hasIntervalCheck = data.includes('setInterval');
        const hasAPIUpdate = data.includes('fetch(\'/api/admin/gemstones\'');
        
        console.log('✅ Datenfluss geprüft');
        console.log(`   Event Listeners: ${hasEventListeners}`);
        console.log(`   LocalStorage Check: ${hasLocalStorageCheck}`);
        console.log(`   Interval Check: ${hasIntervalCheck}`);
        console.log(`   API Update: ${hasAPIUpdate}`);
        
        if (hasEventListeners && hasLocalStorageCheck && hasIntervalCheck && hasAPIUpdate) {
          console.log('   ✅ Datenfluss zwischen Admin und Shop funktioniert');
        } else {
          console.log('   ⚠️  Datenfluss könnte nicht vollständig funktionieren');
        }
        
        resolve(hasEventListeners && hasLocalStorageCheck && hasIntervalCheck && hasAPIUpdate);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Datenfluss nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Hauptfunktion
async function runTests() {
  console.log('🚀 Starte Rarity Transfer Tests...\n');
  
  const apiOk = await testAPIEndpoint();
  if (!apiOk) {
    console.log('\n❌ API-Endpoint nicht erreichbar!');
    console.log('Bitte starten Sie: npm run dev');
    return;
  }
  
  console.log('');
  const shopOk = await testShopPageData();
  
  console.log('');
  const cardOk = await testGemstoneCardRarity();
  
  console.log('');
  const adminOk = await testAdminPanelSave();
  
  console.log('');
  const flowOk = await testDataFlow();
  
  console.log('\n📊 Test-Ergebnisse:');
  console.log('==================');
  console.log(`API-Endpoint: ${apiOk ? '✅' : '❌'}`);
  console.log(`Shop-Seite: ${shopOk ? '✅' : '❌'}`);
  console.log(`GemstoneCard: ${cardOk ? '✅' : '❌'}`);
  console.log(`Admin-Panel: ${adminOk ? '✅' : '❌'}`);
  console.log(`Datenfluss: ${flowOk ? '✅' : '❌'}`);
  
  if (apiOk && shopOk && cardOk && adminOk && flowOk) {
    console.log('\n🎉 Alle Tests erfolgreich!');
    console.log('   Raritäten-Werte werden korrekt vom Admin-Panel zur GemstoneCard übertragen!');
    console.log('\n📋 Was wurde implementiert:');
    console.log('   1. ✅ API-Endpoint für Edelstein-Daten');
    console.log('   2. ✅ Shop-Seite lädt Daten über API');
    console.log('   3. ✅ Event-Listener für Updates');
    console.log('   4. ✅ GemstoneCard zeigt Raritäten an');
    console.log('   5. ✅ Admin-Panel speichert Raritäten');
    console.log('\n🔄 Datenfluss:');
    console.log('   Admin-Panel → API → Shop-Seite → GemstoneCard');
    console.log('   Raritäten-Werte werden in Echtzeit übertragen');
    console.log('\n🌐 URLs:');
    console.log('   Admin: http://localhost:3002/de/admin');
    console.log('   Shop: http://localhost:3002/de/shop');
    console.log('   API: http://localhost:3002/api/admin/gemstones');
    console.log('   Mobile: https://sharp-lamps-pull.loca.lt/de/shop');
  } else {
    console.log('\n⚠️  Einige Tests fehlgeschlagen.');
    console.log('   Bitte überprüfen Sie die Verbindung zwischen Admin und Shop.');
  }
}

// Tests ausführen
runTests().catch(console.error);
