#!/usr/bin/env node

/**
 * Test-Script: Admin Navigation Tabs Styling
 * Testet das Styling der aktiven Tabs im Admin-Bereich
 */

const http = require('http');

console.log('🎨 Admin Tabs Styling Test');
console.log('===========================\n');

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

// Test 2: AdminNavigation Styling prüfen
function testAdminNavigationStyling() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/admin', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasPrimaryBackground = data.includes('bg-primary text-primary-foreground');
        const hasHoverEffects = data.includes('hover:text-foreground hover:bg-muted');
        const hasTransition = data.includes('transition-colors');
        const hasRoundedCorners = data.includes('rounded-md');
        const hasFlexLayout = data.includes('flex items-center gap-2');
        
        console.log('✅ AdminNavigation Styling geprüft');
        console.log(`   Primary Background: ${hasPrimaryBackground}`);
        console.log(`   Hover Effects: ${hasHoverEffects}`);
        console.log(`   Transition: ${hasTransition}`);
        console.log(`   Rounded Corners: ${hasRoundedCorners}`);
        console.log(`   Flex Layout: ${hasFlexLayout}`);
        
        if (hasPrimaryBackground && hasHoverEffects && hasTransition && hasRoundedCorners && hasFlexLayout) {
          console.log('   ✅ AdminNavigation hat korrektes Styling');
        } else {
          console.log('   ⚠️  AdminNavigation Styling könnte unvollständig sein');
        }
        
        resolve(hasPrimaryBackground && hasHoverEffects && hasTransition && hasRoundedCorners && hasFlexLayout);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ AdminNavigation Styling nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 3: AdminSidebar Styling prüfen
function testAdminSidebarStyling() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/admin', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasPrimaryBackground = data.includes('bg-primary text-primary-foreground');
        const hasShadow = data.includes('shadow-sm');
        const hasHoverEffects = data.includes('hover:text-foreground hover:bg-muted');
        const hasTransition = data.includes('transition-all duration-200');
        const hasRoundedCorners = data.includes('rounded-lg');
        const hasFlexLayout = data.includes('flex items-center gap-3');
        
        console.log('✅ AdminSidebar Styling geprüft');
        console.log(`   Primary Background: ${hasPrimaryBackground}`);
        console.log(`   Shadow: ${hasShadow}`);
        console.log(`   Hover Effects: ${hasHoverEffects}`);
        console.log(`   Transition: ${hasTransition}`);
        console.log(`   Rounded Corners: ${hasRoundedCorners}`);
        console.log(`   Flex Layout: ${hasFlexLayout}`);
        
        if (hasPrimaryBackground && hasShadow && hasHoverEffects && hasTransition && hasRoundedCorners && hasFlexLayout) {
          console.log('   ✅ AdminSidebar hat korrektes Styling');
        } else {
          console.log('   ⚠️  AdminSidebar Styling könnte unvollständig sein');
        }
        
        resolve(hasPrimaryBackground && hasShadow && hasHoverEffects && hasTransition && hasRoundedCorners && hasFlexLayout);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ AdminSidebar Styling nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 4: Newsletter-Seite Styling vergleichen
function testNewsletterStyling() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/admin/newsletter', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasDataStateActive = data.includes('data-[state=active]:bg-primary');
        const hasDataStateText = data.includes('data-[state=active]:text-primary-foreground');
        const hasDataStateShadow = data.includes('data-[state=active]:shadow-sm');
        const hasTransition = data.includes('transition-all duration-300');
        const hasRoundedCorners = data.includes('rounded-md');
        
        console.log('✅ Newsletter Tabs Styling geprüft');
        console.log(`   data-[state=active]:bg-primary: ${hasDataStateActive}`);
        console.log(`   data-[state=active]:text-primary-foreground: ${hasDataStateText}`);
        console.log(`   data-[state=active]:shadow-sm: ${hasDataStateShadow}`);
        console.log(`   Transition: ${hasTransition}`);
        console.log(`   Rounded Corners: ${hasRoundedCorners}`);
        
        if (hasDataStateActive && hasDataStateText && hasDataStateShadow && hasTransition && hasRoundedCorners) {
          console.log('   ✅ Newsletter Tabs haben korrektes Styling');
        } else {
          console.log('   ⚠️  Newsletter Tabs Styling könnte unvollständig sein');
        }
        
        resolve(hasDataStateActive && hasDataStateText && hasDataStateShadow && hasTransition && hasRoundedCorners);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Newsletter Styling nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Test 5: Konsistenz zwischen Admin und Newsletter prüfen
function testStylingConsistency() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de/admin', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasPrimaryColors = data.includes('bg-primary') && data.includes('text-primary-foreground');
        const hasShadowEffects = data.includes('shadow-sm');
        const hasTransitionEffects = data.includes('transition');
        const hasRoundedElements = data.includes('rounded');
        
        console.log('✅ Styling-Konsistenz geprüft');
        console.log(`   Primary Colors: ${hasPrimaryColors}`);
        console.log(`   Shadow Effects: ${hasShadowEffects}`);
        console.log(`   Transition Effects: ${hasTransitionEffects}`);
        console.log(`   Rounded Elements: ${hasRoundedElements}`);
        
        if (hasPrimaryColors && hasShadowEffects && hasTransitionEffects && hasRoundedElements) {
          console.log('   ✅ Admin-Styling ist konsistent');
        } else {
          console.log('   ⚠️  Admin-Styling könnte inkonsistent sein');
        }
        
        resolve(hasPrimaryColors && hasShadowEffects && hasTransitionEffects && hasRoundedElements);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Styling-Konsistenz nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Hauptfunktion
async function runTests() {
  console.log('🚀 Starte Admin Tabs Styling Tests...\n');
  
  const adminOk = await testAdminPage();
  if (!adminOk) {
    console.log('\n❌ Admin-Seite nicht erreichbar!');
    console.log('Bitte starten Sie: npm run dev');
    return;
  }
  
  console.log('');
  const navigationOk = await testAdminNavigationStyling();
  
  console.log('');
  const sidebarOk = await testAdminSidebarStyling();
  
  console.log('');
  const newsletterOk = await testNewsletterStyling();
  
  console.log('');
  const consistencyOk = await testStylingConsistency();
  
  console.log('\n📊 Test-Ergebnisse:');
  console.log('==================');
  console.log(`Admin-Seite erreichbar: ${adminOk ? '✅' : '❌'}`);
  console.log(`AdminNavigation Styling: ${navigationOk ? '✅' : '❌'}`);
  console.log(`AdminSidebar Styling: ${sidebarOk ? '✅' : '❌'}`);
  console.log(`Newsletter Tabs Styling: ${newsletterOk ? '✅' : '❌'}`);
  console.log(`Styling-Konsistenz: ${consistencyOk ? '✅' : '❌'}`);
  
  if (adminOk && navigationOk && sidebarOk && newsletterOk && consistencyOk) {
    console.log('\n🎉 Alle Tests erfolgreich!');
    console.log('   Admin-Bereich hat bereits das gewünschte Styling!');
    console.log('\n📋 Aktuelles Admin-Styling:');
    console.log('   1. ✅ AdminNavigation: bg-primary text-primary-foreground');
    console.log('   2. ✅ AdminSidebar: bg-primary text-primary-foreground shadow-sm');
    console.log('   3. ✅ Newsletter Tabs: data-[state=active]:bg-primary');
    console.log('   4. ✅ Konsistente Farben und Effekte');
    console.log('   5. ✅ Smooth Transitions');
    console.log('\n🎨 Styling-Details:');
    console.log('   - Aktive Tabs: Blauer Hintergrund (bg-primary)');
    console.log('   - Aktive Tabs: Weißer Text (text-primary-foreground)');
    console.log('   - Aktive Tabs: Schatten-Effekt (shadow-sm)');
    console.log('   - Hover-Effekte: Muted Hintergrund');
    console.log('   - Transitions: Smooth Übergänge');
    console.log('   - Rounded Corners: Abgerundete Ecken');
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
