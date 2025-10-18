#!/usr/bin/env node

/**
 * Test-Script: Gemstone Editor Tabs Styling
 * Testet das Styling der Tabs im GemstoneEditor (Grunddaten, Details, Bilder, Technisch)
 */

const http = require('http');

console.log('🎨 Gemstone Editor Tabs Styling Test');
console.log('====================================\n');

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

// Test 2: GemstoneEditor Tabs Styling prüfen
function testGemstoneEditorTabs() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/admin', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasFlexLayout = data.includes('flex space-x-1');
        const hasMutedBackground = data.includes('bg-muted');
        const hasRoundedLayout = data.includes('rounded-lg');
        const hasDataStateActive = data.includes('data-[state=active]:bg-primary');
        const hasDataStateText = data.includes('data-[state=active]:text-primary-foreground');
        const hasDataStateShadow = data.includes('data-[state=active]:shadow-sm');
        const hasTransition = data.includes('transition-all duration-300');
        const hasRoundedCorners = data.includes('rounded-md');
        
        console.log('✅ GemstoneEditor Tabs Styling geprüft');
        console.log(`   Flex Layout: ${hasFlexLayout}`);
        console.log(`   Muted Background: ${hasMutedBackground}`);
        console.log(`   Rounded Layout: ${hasRoundedLayout}`);
        console.log(`   data-[state=active]:bg-primary: ${hasDataStateActive}`);
        console.log(`   data-[state=active]:text-primary-foreground: ${hasDataStateText}`);
        console.log(`   data-[state=active]:shadow-sm: ${hasDataStateShadow}`);
        console.log(`   Transition: ${hasTransition}`);
        console.log(`   Rounded Corners: ${hasRoundedCorners}`);
        
        if (hasFlexLayout && hasMutedBackground && hasRoundedLayout && hasDataStateActive && hasDataStateText && hasDataStateShadow && hasTransition && hasRoundedCorners) {
          console.log('   ✅ GemstoneEditor Tabs haben korrektes Styling');
        } else {
          console.log('   ⚠️  GemstoneEditor Tabs Styling könnte unvollständig sein');
        }
        
        resolve(hasFlexLayout && hasMutedBackground && hasRoundedLayout && hasDataStateActive && hasDataStateText && hasDataStateShadow && hasTransition && hasRoundedCorners);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ GemstoneEditor Tabs Styling nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 3: Tab-Namen prüfen
function testTabNames() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/admin', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasGrunddaten = data.includes('Grunddaten');
        const hasDetails = data.includes('Details');
        const hasBilder = data.includes('Bilder');
        const hasTechnisch = data.includes('Technisch');
        
        console.log('✅ Tab-Namen geprüft');
        console.log(`   "Grunddaten": ${hasGrunddaten}`);
        console.log(`   "Details": ${hasDetails}`);
        console.log(`   "Bilder": ${hasBilder}`);
        console.log(`   "Technisch": ${hasTechnisch}`);
        
        if (hasGrunddaten && hasDetails && hasBilder && hasTechnisch) {
          console.log('   ✅ Alle 4 Tab-Namen sind vorhanden');
        } else {
          console.log('   ⚠️  Einige Tab-Namen könnten fehlen');
        }
        
        resolve(hasGrunddaten && hasDetails && hasBilder && hasTechnisch);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Tab-Namen nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 4: Newsletter-Styling Vergleich
function testNewsletterStylingComparison() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/admin/newsletter', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasSameDataStateActive = data.includes('data-[state=active]:bg-primary');
        const hasSameDataStateText = data.includes('data-[state=active]:text-primary-foreground');
        const hasSameDataStateShadow = data.includes('data-[state=active]:shadow-sm');
        const hasSameTransition = data.includes('transition-all duration-300');
        const hasSameRoundedCorners = data.includes('rounded-md');
        
        console.log('✅ Newsletter-Styling Vergleich');
        console.log(`   Gleiche data-[state=active]:bg-primary: ${hasSameDataStateActive}`);
        console.log(`   Gleiche data-[state=active]:text-primary-foreground: ${hasSameDataStateText}`);
        console.log(`   Gleiche data-[state=active]:shadow-sm: ${hasSameDataStateShadow}`);
        console.log(`   Gleiche Transition: ${hasSameTransition}`);
        console.log(`   Gleiche Rounded Corners: ${hasSameRoundedCorners}`);
        
        if (hasSameDataStateActive && hasSameDataStateText && hasSameDataStateShadow && hasSameTransition && hasSameRoundedCorners) {
          console.log('   ✅ Styling ist konsistent mit Newsletter-Seite');
        } else {
          console.log('   ⚠️  Styling könnte inkonsistent sein');
        }
        
        resolve(hasSameDataStateActive && hasSameDataStateText && hasSameDataStateShadow && hasSameTransition && hasSameRoundedCorners);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Newsletter-Styling Vergleich nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Hauptfunktion
async function runTests() {
  console.log('🚀 Starte Gemstone Editor Tabs Styling Tests...\n');
  
  const adminOk = await testAdminPage();
  if (!adminOk) {
    console.log('\n❌ Admin-Seite nicht erreichbar!');
    console.log('Bitte starten Sie: npm run dev');
    return;
  }
  
  console.log('');
  const tabsOk = await testGemstoneEditorTabs();
  
  console.log('');
  const namesOk = await testTabNames();
  
  console.log('');
  const comparisonOk = await testNewsletterStylingComparison();
  
  console.log('\n📊 Test-Ergebnisse:');
  console.log('==================');
  console.log(`Admin-Seite erreichbar: ${adminOk ? '✅' : '❌'}`);
  console.log(`GemstoneEditor Tabs Styling: ${tabsOk ? '✅' : '❌'}`);
  console.log(`Tab-Namen (4 Tabs): ${namesOk ? '✅' : '❌'}`);
  console.log(`Newsletter-Styling Konsistenz: ${comparisonOk ? '✅' : '❌'}`);
  
  if (adminOk && tabsOk && namesOk && comparisonOk) {
    console.log('\n🎉 Alle Tests erfolgreich!');
    console.log('   GemstoneEditor Tabs haben jetzt das gewünschte Styling!');
    console.log('\n📋 Was wurde implementiert:');
    console.log('   1. ✅ Newsletter-Styling auf GemstoneEditor Tabs angewendet');
    console.log('   2. ✅ data-[state=active]:bg-primary (blauer Hintergrund)');
    console.log('   3. ✅ data-[state=active]:text-primary-foreground (weißer Text)');
    console.log('   4. ✅ data-[state=active]:shadow-sm (Schatten-Effekt)');
    console.log('   5. ✅ transition-all duration-300 (smooth Transitions)');
    console.log('\n🎨 Styling-Details:');
    console.log('   - Flex Layout: flex space-x-1');
    console.log('   - Background: bg-muted');
    console.log('   - Rounded Layout: rounded-lg');
    console.log('   - Active Tab: data-[state=active]:bg-primary');
    console.log('   - Active Text: data-[state=active]:text-primary-foreground');
    console.log('   - Active Shadow: data-[state=active]:shadow-sm');
    console.log('   - Transitions: transition-all duration-300');
    console.log('   - Rounded Corners: rounded-md');
    console.log('\n🏷️  Verfügbare Tabs:');
    console.log('   - Grunddaten (Name, Typ, Beschreibung, Preis, etc.)');
    console.log('   - Details (Karat, Schliff, Reinheit, etc.)');
    console.log('   - Bilder (Bild-Upload, Hauptbild, etc.)');
    console.log('   - Technisch (Abmessungen, Behandlung, Zertifizierung)');
    console.log('\n🌐 URLs:');
    console.log('   Admin: http://localhost:3002/de/admin');
    console.log('   Newsletter: http://localhost:3002/de/admin/newsletter');
    console.log('   Mobile: https://sharp-lamps-pull.loca.lt/de/admin');
  } else {
    console.log('\n⚠️  Einige Tests fehlgeschlagen.');
    console.log('   Bitte überprüfen Sie die Admin-Seite manuell.');
  }
}

// Tests ausführen
runTests().catch(console.error);
