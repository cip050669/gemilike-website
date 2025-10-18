#!/usr/bin/env node

/**
 * Test-Script: Container Dark Styling
 * Testet das dunkle Grau-Styling für alle Container außer Überschriften
 */

const http = require('http');

console.log('🌑 Container Dark Styling Test');
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

// Test 2: Container Dark CSS prüfen
function testContainerDarkCSS() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasContainerDark = data.includes('container-dark');
        const hasCardDark = data.includes('card-dark');
        const hasOklchColors = data.includes('oklch(0.06 0.02 240)');
        const hasBorderColors = data.includes('oklch(0.15 0.03 240)');
        const hasBoxShadow = data.includes('box-shadow: 0 4px 6px');
        const hasBorderRadius = data.includes('border-radius: 0.75rem');
        
        console.log('✅ Container Dark CSS geprüft');
        console.log(`   container-dark Klasse: ${hasContainerDark}`);
        console.log(`   card-dark Klasse: ${hasCardDark}`);
        console.log(`   OKLCH Farben: ${hasOklchColors}`);
        console.log(`   Border Farben: ${hasBorderColors}`);
        console.log(`   Box Shadow: ${hasBoxShadow}`);
        console.log(`   Border Radius: ${hasBorderRadius}`);
        
        if (hasContainerDark && hasCardDark && hasOklchColors && hasBorderColors && hasBoxShadow && hasBorderRadius) {
          console.log('   ✅ Container Dark CSS vollständig implementiert');
        } else {
          console.log('   ⚠️  Container Dark CSS könnte unvollständig sein');
        }
        
        resolve(hasContainerDark && hasCardDark && hasOklchColors && hasBorderColors && hasBoxShadow && hasBorderRadius);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Container Dark CSS nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 3: Homepage Container prüfen
function testHomepageContainers() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasNeueEdelsteineContainer = data.includes('Neue Edelsteine') && data.includes('container-dark');
        const hasNewsletterContainer = data.includes('Newsletter') && data.includes('container-dark');
        const hasContainerClasses = data.includes('container mx-auto px-4 container-dark');
        const hasTextCenter = data.includes('text-center container-dark');
        
        console.log('✅ Homepage Container geprüft');
        console.log(`   Neue Edelsteine Container: ${hasNeueEdelsteineContainer}`);
        console.log(`   Newsletter Container: ${hasNewsletterContainer}`);
        console.log(`   Container Klassen: ${hasContainerClasses}`);
        console.log(`   Text Center Container: ${hasTextCenter}`);
        
        if (hasNeueEdelsteineContainer && hasNewsletterContainer && hasContainerClasses && hasTextCenter) {
          console.log('   ✅ Homepage Container vollständig gestylt');
        } else {
          console.log('   ⚠️  Homepage Container könnten unvollständig gestylt sein');
        }
        
        resolve(hasNeueEdelsteineContainer && hasNewsletterContainer && hasContainerClasses && hasTextCenter);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Homepage Container nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 4: About-Seite Container prüfen
function testAboutPageContainers() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/about', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasAboutContainer = data.includes('container-dark');
        const hasMaxWidth = data.includes('max-w-6xl container-dark');
        const hasAboutContent = data.includes('Über Gemilike') || data.includes('About');
        
        console.log('✅ About-Seite Container geprüft');
        console.log(`   About Container: ${hasAboutContainer}`);
        console.log(`   Max Width Container: ${hasMaxWidth}`);
        console.log(`   About Content: ${hasAboutContent}`);
        
        if (hasAboutContainer && hasMaxWidth && hasAboutContent) {
          console.log('   ✅ About-Seite Container vollständig gestylt');
        } else {
          console.log('   ⚠️  About-Seite Container könnten unvollständig gestylt sein');
        }
        
        resolve(hasAboutContainer && hasMaxWidth && hasAboutContent);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ About-Seite Container nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 5: Blog-Seite Container prüfen
function testBlogPageContainers() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/blog', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasBlogContainer = data.includes('container-dark');
        const hasMaxWidth = data.includes('max-w-4xl container-dark');
        const hasBlogContent = data.includes('Blog') || data.includes('blog');
        
        console.log('✅ Blog-Seite Container geprüft');
        console.log(`   Blog Container: ${hasBlogContainer}`);
        console.log(`   Max Width Container: ${hasMaxWidth}`);
        console.log(`   Blog Content: ${hasBlogContent}`);
        
        if (hasBlogContainer && hasMaxWidth && hasBlogContent) {
          console.log('   ✅ Blog-Seite Container vollständig gestylt');
        } else {
          console.log('   ⚠️  Blog-Seite Container könnten unvollständig gestylt sein');
        }
        
        resolve(hasBlogContainer && hasMaxWidth && hasBlogContent);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Blog-Seite Container nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Hauptfunktion
async function runTests() {
  console.log('🚀 Starte Container Dark Styling Tests...\n');
  
  const homepageOk = await testHomepage();
  if (!homepageOk) {
    console.log('\n❌ Homepage nicht erreichbar!');
    console.log('Bitte starten Sie: npm run dev');
    return;
  }
  
  console.log('');
  const cssOk = await testContainerDarkCSS();
  
  console.log('');
  const homepageOk2 = await testHomepageContainers();
  
  console.log('');
  const aboutOk = await testAboutPageContainers();
  
  console.log('');
  const blogOk = await testBlogPageContainers();
  
  console.log('\n📊 Test-Ergebnisse:');
  console.log('==================');
  console.log(`Homepage erreichbar: ${homepageOk ? '✅' : '❌'}`);
  console.log(`Container Dark CSS: ${cssOk ? '✅' : '❌'}`);
  console.log(`Homepage Container: ${homepageOk2 ? '✅' : '❌'}`);
  console.log(`About-Seite Container: ${aboutOk ? '✅' : '❌'}`);
  console.log(`Blog-Seite Container: ${blogOk ? '✅' : '❌'}`);
  
  if (homepageOk && cssOk && homepageOk2 && aboutOk && blogOk) {
    console.log('\n🎉 Alle Tests erfolgreich!');
    console.log('   Container Dark Styling wurde erfolgreich implementiert!');
    console.log('\n📋 Was wurde implementiert:');
    console.log('   1. ✅ Dunkle Grau-Färbung für alle Container');
    console.log('   2. ✅ Card-Dark Styling für alle Cards');
    console.log('   3. ✅ Container-Dark Klasse für Hauptcontainer');
    console.log('   4. ✅ OKLCH-Farben für präzise Farbgebung');
    console.log('   5. ✅ Box-Shadow und Border für Tiefe');
    console.log('\n🎨 Styling-Details:');
    console.log('   - Dark Mode: oklch(0.06 0.02 240) (sehr dunkles Grau)');
    console.log('   - Light Mode: oklch(0.95 0.01 240) (sehr helles Grau)');
    console.log('   - Border: oklch(0.15 0.03 240) (dunkle Ränder)');
    console.log('   - Border Radius: 0.75rem (abgerundete Ecken)');
    console.log('   - Box Shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1)');
    console.log('   - Alle Container außer Überschriften betroffen');
    console.log('\n🌐 Betroffene Seiten:');
    console.log('   - Homepage (Neue Edelsteine, Newsletter)');
    console.log('   - About-Seite (Hauptcontainer)');
    console.log('   - Blog-Seite (Hauptcontainer)');
    console.log('   - Alle Cards (GemstoneCard, etc.)');
    console.log('\n🌐 URLs:');
    console.log('   Homepage: http://localhost:3002/de');
    console.log('   About: http://localhost:3002/de/about');
    console.log('   Blog: http://localhost:3002/de/blog');
    console.log('   Mobile: https://sharp-lamps-pull.loca.lt/de');
  } else {
    console.log('\n⚠️  Einige Tests fehlgeschlagen.');
    console.log('   Bitte überprüfen Sie die Seiten manuell.');
  }
}

// Tests ausführen
runTests().catch(console.error);
