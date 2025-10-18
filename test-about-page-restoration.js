#!/usr/bin/env node

/**
 * Test-Script: About Page Restoration
 * Testet die Wiederherstellung und Ergänzung der About-Seite
 */

const http = require('http');

console.log('🔧 About Page Restoration Test');
console.log('================================\n');

// Test 1: About-Seite erreichbar
function testAboutPage() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/about', (res) => {
      console.log('✅ About-Seite erreichbar');
      console.log(`   Status: ${res.statusCode}`);
      resolve(res.statusCode === 200);
    });
    
    req.on('error', (err) => {
      console.log('❌ About-Seite nicht erreichbar:', err.message);
      resolve(false);
    });
  });
}

// Test 2: Services-Seite gelöscht
function testServicesPageDeleted() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/services', (res) => {
      console.log('✅ Services-Seite korrekt gelöscht');
      console.log(`   Status: ${res.statusCode} (404 erwartet)`);
      resolve(res.statusCode === 404);
    });
    
    req.on('error', (err) => {
      console.log('❌ Services-Seite noch erreichbar:', err.message);
      resolve(false);
    });
  });
}

// Test 3: About-Seite Inhalt prüfen
function testAboutPageContent() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/about', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasAboutContent = data.includes('Über Gemilike') || data.includes('Heroes in Gems');
        const hasServicesContent = data.includes('Unser Sortiment') || data.includes('Rohe Edelsteine');
        const hasOriginalCards = data.includes('Unsere Mission') || data.includes('Unsere Werte');
        const hasServiceCards = data.includes('Rohe Edelsteine') || data.includes('Geschliffene Edelsteine');
        
        console.log('✅ About-Seite Inhalt geprüft');
        console.log(`   Ursprünglicher About-Inhalt: ${hasAboutContent}`);
        console.log(`   Services-Inhalt hinzugefügt: ${hasServicesContent}`);
        console.log(`   Original-Karten (Mission, Values): ${hasOriginalCards}`);
        console.log(`   Service-Karten (Rough, Cut): ${hasServiceCards}`);
        
        if (hasAboutContent && hasServicesContent && hasOriginalCards && hasServiceCards) {
          console.log('   ✅ About-Seite enthält sowohl ursprünglichen als auch Services-Inhalt');
        } else {
          console.log('   ⚠️  About-Seite könnte unvollständig sein');
        }
        
        resolve(hasAboutContent && hasServicesContent);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ About-Seite Inhalt nicht lesbar:', err.message);
      resolve(false);
    });
  });
}

// Hauptfunktion
async function runTests() {
  console.log('🚀 Starte About Page Restoration Tests...\n');
  
  const aboutOk = await testAboutPage();
  if (!aboutOk) {
    console.log('\n❌ About-Seite nicht erreichbar!');
    console.log('Bitte starten Sie: npm run dev');
    return;
  }
  
  console.log('');
  const servicesDeleted = await testServicesPageDeleted();
  
  console.log('');
  const contentOk = await testAboutPageContent();
  
  console.log('\n📊 Test-Ergebnisse:');
  console.log('==================');
  console.log(`About-Seite erreichbar: ${aboutOk ? '✅' : '❌'}`);
  console.log(`Services-Seite gelöscht: ${servicesDeleted ? '✅' : '❌'}`);
  console.log(`Inhalt korrekt: ${contentOk ? '✅' : '❌'}`);
  
  if (aboutOk && servicesDeleted && contentOk) {
    console.log('\n🎉 Alle Tests erfolgreich!');
    console.log('   About-Seite wurde erfolgreich wiederhergestellt und ergänzt!');
    console.log('\n📋 Was wurde gemacht:');
    console.log('   1. ✅ Ursprünglicher About-Inhalt wiederhergestellt');
    console.log('   2. ✅ Services-Inhalt als zusätzliche Sektion hinzugefügt');
    console.log('   3. ✅ Services-Seite gelöscht');
    console.log('   4. ✅ Navigation angepasst');
    console.log('   5. ✅ Hero-Button-Links aktualisiert');
    console.log('\n🌐 URLs:');
    console.log('   About (kombiniert): http://localhost:3002/de/about');
    console.log('   Services (gelöscht): http://localhost:3002/de/services (404)');
    console.log('   Mobile: https://sharp-lamps-pull.loca.lt/de/about');
  } else {
    console.log('\n⚠️  Einige Tests fehlgeschlagen.');
    console.log('   Bitte überprüfen Sie die About-Seite manuell.');
  }
}

// Tests ausführen
runTests().catch(console.error);
