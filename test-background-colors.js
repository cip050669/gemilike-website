#!/usr/bin/env node

/**
 * Test-Script: Background Colors
 * Testet die neuen Hintergrundfarben (Schwarz) und Container-Farben (mittleres dunkles Grau)
 */

const http = require('http');

console.log('🎨 Background Colors Test');
console.log('=========================\n');

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

// Test 2: CSS-Variablen prüfen
function testCSSVariables() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasBlackBackground = data.includes('oklch(0.05 0.01 240)') || data.includes('Schwarz');
        const hasDarkGrayCards = data.includes('oklch(0.25 0.02 240)') || data.includes('Mittleres dunkles Grau');
        const hasContainerDark = data.includes('container-dark');
        const hasCardDark = data.includes('card-dark');
        const hasOKLCHColors = data.includes('oklch(');
        
        console.log('✅ CSS-Variablen geprüft');
        console.log(`   Schwarzer Hintergrund: ${hasBlackBackground}`);
        console.log(`   Dunkle Grau-Container: ${hasDarkGrayCards}`);
        console.log(`   Container-Dark Klasse: ${hasContainerDark}`);
        console.log(`   Card-Dark Klasse: ${hasCardDark}`);
        console.log(`   OKLCH-Farben: ${hasOKLCHColors}`);
        
        if (hasBlackBackground && hasDarkGrayCards && hasContainerDark && hasCardDark && hasOKLCHColors) {
          console.log('   ✅ CSS-Variablen korrekt implementiert');
        } else {
          console.log('   ⚠️  CSS-Variablen könnten unvollständig sein');
        }
        
        resolve(hasBlackBackground && hasDarkGrayCards && hasContainerDark && hasCardDark && hasOKLCHColors);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ CSS-Variablen nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 3: Container-Styling prüfen
function testContainerStyling() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasContainerDarkClass = data.includes('container-dark');
        const hasCardDarkClass = data.includes('card-dark');
        const hasBoxShadow = data.includes('box-shadow: 0 4px 6px');
        const hasBorderRadius = data.includes('border-radius: 0.75rem');
        const hasBorderColors = data.includes('oklch(0.35 0.03 240)');
        
        console.log('✅ Container-Styling geprüft');
        console.log(`   Container-Dark Klasse: ${hasContainerDarkClass}`);
        console.log(`   Card-Dark Klasse: ${hasCardDarkClass}`);
        console.log(`   Box Shadow: ${hasBoxShadow}`);
        console.log(`   Border Radius: ${hasBorderRadius}`);
        console.log(`   Border Colors: ${hasBorderColors}`);
        
        if (hasContainerDarkClass && hasCardDarkClass && hasBoxShadow && hasBorderRadius && hasBorderColors) {
          console.log('   ✅ Container-Styling vollständig implementiert');
        } else {
          console.log('   ⚠️  Container-Styling könnte unvollständig sein');
        }
        
        resolve(hasContainerDarkClass && hasCardDarkClass && hasBoxShadow && hasBorderRadius && hasBorderColors);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Container-Styling nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 4: Homepage Container prüfen
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

// Test 5: About-Seite Container prüfen
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

// Test 6: Shop-Seite Container prüfen
function testShopPageContainers() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/shop', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasShopContainer = data.includes('container-dark');
        const hasShopContent = data.includes('Shop') || data.includes('shop');
        const hasGemstoneCards = data.includes('GemstoneCard') || data.includes('gemstone');
        
        console.log('✅ Shop-Seite Container geprüft');
        console.log(`   Shop Container: ${hasShopContainer}`);
        console.log(`   Shop Content: ${hasShopContent}`);
        console.log(`   Gemstone Cards: ${hasGemstoneCards}`);
        
        if (hasShopContainer && hasShopContent && hasGemstoneCards) {
          console.log('   ✅ Shop-Seite Container vollständig gestylt');
        } else {
          console.log('   ⚠️  Shop-Seite Container könnten unvollständig gestylt sein');
        }
        
        resolve(hasShopContainer && hasShopContent && hasGemstoneCards);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Shop-Seite Container nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Hauptfunktion
async function runTests() {
  console.log('🚀 Starte Background Colors Tests...\n');
  
  const homepageOk = await testHomepage();
  if (!homepageOk) {
    console.log('\n❌ Homepage nicht erreichbar!');
    console.log('Bitte starten Sie: npm run dev');
    return;
  }
  
  console.log('');
  const cssOk = await testCSSVariables();
  
  console.log('');
  const containerOk = await testContainerStyling();
  
  console.log('');
  const homepageOk2 = await testHomepageContainers();
  
  console.log('');
  const aboutOk = await testAboutPageContainers();
  
  console.log('');
  const shopOk = await testShopPageContainers();
  
  console.log('\n📊 Test-Ergebnisse:');
  console.log('==================');
  console.log(`Homepage erreichbar: ${homepageOk ? '✅' : '❌'}`);
  console.log(`CSS-Variablen: ${cssOk ? '✅' : '❌'}`);
  console.log(`Container-Styling: ${containerOk ? '✅' : '❌'}`);
  console.log(`Homepage Container: ${homepageOk2 ? '✅' : '❌'}`);
  console.log(`About-Seite Container: ${aboutOk ? '✅' : '❌'}`);
  console.log(`Shop-Seite Container: ${shopOk ? '✅' : '❌'}`);
  
  if (homepageOk && cssOk && containerOk && homepageOk2 && aboutOk && shopOk) {
    console.log('\n🎉 Alle Tests erfolgreich!');
    console.log('   Hintergrundfarben wurden erfolgreich geändert!');
    console.log('\n📋 Was wurde implementiert:');
    console.log('   1. ✅ Schwarzer Hintergrund (oklch(0.05 0.01 240))');
    console.log('   2. ✅ Mittleres dunkles Grau für Container (oklch(0.25 0.02 240))');
    console.log('   3. ✅ Container-Dark und Card-Dark Klassen aktualisiert');
    console.log('   4. ✅ Box-Shadow für bessere Tiefe');
    console.log('   5. ✅ Border-Radius für abgerundete Ecken');
    console.log('\n🎨 Farb-Schema:');
    console.log('   - Hintergrund: Schwarz (oklch(0.05 0.01 240))');
    console.log('   - Container: Mittleres dunkles Grau (oklch(0.25 0.02 240))');
    console.log('   - Border: Dunkleres Grau (oklch(0.35 0.03 240))');
    console.log('   - Box-Shadow: Verstärkt für besseren Kontrast');
    console.log('\n🌐 Betroffene Seiten:');
    console.log('   - Homepage (Neue Edelsteine, Newsletter)');
    console.log('   - About-Seite (Hauptcontainer)');
    console.log('   - Shop-Seite (GemstoneCards)');
    console.log('   - Alle Cards und Container');
    console.log('\n🌐 URLs:');
    console.log('   Homepage: http://localhost:3002/de');
    console.log('   About: http://localhost:3002/de/about');
    console.log('   Shop: http://localhost:3002/de/shop');
    console.log('   Mobile: https://sharp-lamps-pull.loca.lt/de');
  } else {
    console.log('\n⚠️  Einige Tests fehlgeschlagen.');
    console.log('   Bitte überprüfen Sie die Seiten manuell.');
  }
}

// Tests ausführen
runTests().catch(console.error);
