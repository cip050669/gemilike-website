#!/usr/bin/env node

/**
 * Test-Script: About Section Removal
 * Testet die Entfernung der "Über Gemilike" Sektion von der Homepage
 */

const http = require('http');

console.log('🗑️  About Section Removal Test');
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

// Test 2: About-Sektion entfernt prüfen
function testAboutSectionRemoved() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasAboutSection = data.includes('Über Gemilike') && data.includes('Erfahren Sie, wofür wir bei Gemilike stehen');
        const hasAboutImage = data.includes('/products/ruby-002-1.jpg');
        const hasAboutButton = data.includes('Mehr erfahren');
        const hasAboutGrid = data.includes('grid grid-cols-1 lg:grid-cols-2');
        
        console.log('✅ About-Sektion Prüfung');
        console.log(`   "Über Gemilike" Text gefunden: ${hasAboutSection}`);
        console.log(`   About-Bild gefunden: ${hasAboutImage}`);
        console.log(`   "Mehr erfahren" Button gefunden: ${hasAboutButton}`);
        console.log(`   About-Grid Layout gefunden: ${hasAboutGrid}`);
        
        if (!hasAboutSection && !hasAboutImage && !hasAboutButton && !hasAboutGrid) {
          console.log('   ✅ About-Sektion erfolgreich entfernt');
        } else {
          console.log('   ⚠️  About-Sektion möglicherweise noch vorhanden');
        }
        
        resolve(!hasAboutSection && !hasAboutImage && !hasAboutButton && !hasAboutGrid);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Homepage Inhalt nicht lesbar:', err.message);
      resolve(false);
    });
  });
}

// Test 3: Verbleibende Sektionen prüfen
function testRemainingSections() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasHeroSection = data.includes('HeroSection');
        const hasEdelsteineSection = data.includes('Neue Edelsteine');
        const hasNewsletterSection = data.includes('Newsletter');
        const hasGradientHeadings = data.includes('gradient-text animate-glow');
        
        console.log('✅ Verbleibende Sektionen geprüft');
        console.log(`   Hero Section: ${hasHeroSection}`);
        console.log(`   Edelsteine Section: ${hasEdelsteineSection}`);
        console.log(`   Newsletter Section: ${hasNewsletterSection}`);
        console.log(`   Gradient Headings: ${hasGradientHeadings}`);
        
        if (hasHeroSection && hasEdelsteineSection && hasNewsletterSection && hasGradientHeadings) {
          console.log('   ✅ Alle wichtigen Sektionen sind noch vorhanden');
        } else {
          console.log('   ⚠️  Einige wichtige Sektionen könnten fehlen');
        }
        
        resolve(hasHeroSection && hasEdelsteineSection && hasNewsletterSection);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Verbleibende Sektionen nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Hauptfunktion
async function runTests() {
  console.log('🚀 Starte About Section Removal Tests...\n');
  
  const homepageOk = await testHomepage();
  if (!homepageOk) {
    console.log('\n❌ Homepage nicht erreichbar!');
    console.log('Bitte starten Sie: npm run dev');
    return;
  }
  
  console.log('');
  const aboutRemoved = await testAboutSectionRemoved();
  
  console.log('');
  const sectionsOk = await testRemainingSections();
  
  console.log('\n📊 Test-Ergebnisse:');
  console.log('==================');
  console.log(`Homepage erreichbar: ${homepageOk ? '✅' : '❌'}`);
  console.log(`About-Sektion entfernt: ${aboutRemoved ? '✅' : '❌'}`);
  console.log(`Andere Sektionen intakt: ${sectionsOk ? '✅' : '❌'}`);
  
  if (homepageOk && aboutRemoved && sectionsOk) {
    console.log('\n🎉 Alle Tests erfolgreich!');
    console.log('   "Über Gemilike" Sektion wurde erfolgreich entfernt!');
    console.log('\n📋 Was wurde entfernt:');
    console.log('   1. ✅ "Über Gemilike" Überschrift');
    console.log('   2. ✅ Beschreibungstext');
    console.log('   3. ✅ Rubin-Bild (/products/ruby-002-1.jpg)');
    console.log('   4. ✅ "Mehr erfahren" Button');
    console.log('   5. ✅ Komplette Grid-Layout Sektion');
    console.log('\n🏠 Verbleibende Homepage-Sektionen:');
    console.log('   - Hero Section (verwaltbar über Admin)');
    console.log('   - Neue Edelsteine (mit Gradient-Formatierung)');
    console.log('   - Newsletter (mit Gradient-Formatierung)');
    console.log('\n🌐 URLs:');
    console.log('   Homepage: http://localhost:3002/de');
    console.log('   About-Seite: http://localhost:3002/de/about (separate Seite)');
    console.log('   Mobile: https://sharp-lamps-pull.loca.lt/de');
  } else {
    console.log('\n⚠️  Einige Tests fehlgeschlagen.');
    console.log('   Bitte überprüfen Sie die Homepage manuell.');
  }
}

// Tests ausführen
runTests().catch(console.error);
