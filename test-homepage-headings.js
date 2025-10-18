#!/usr/bin/env node

/**
 * Test-Script: Homepage Headings Formatting
 * Testet die Formatierung der Überschriften auf der Homepage
 */

const http = require('http');

console.log('🎨 Homepage Headings Formatting Test');
console.log('====================================\n');

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

// Test 2: Überschriften-Formatierung prüfen
function testHeadingsFormatting() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasGradientText = data.includes('gradient-text animate-glow');
        const hasEdelsteineHeading = data.includes('Neue Edelsteine');
        const hasNewsletterHeading = data.includes('Newsletter');
        const hasEdelsteineGradient = data.includes('<span class="gradient-text animate-glow">Neue Edelsteine</span>');
        const hasNewsletterGradient = data.includes('<span class="gradient-text animate-glow">Newsletter</span>');
        
        console.log('✅ Homepage Überschriften geprüft');
        console.log(`   Gradient-Text CSS-Klassen gefunden: ${hasGradientText}`);
        console.log(`   "Neue Edelsteine" Überschrift: ${hasEdelsteineHeading}`);
        console.log(`   "Newsletter" Überschrift: ${hasNewsletterHeading}`);
        console.log(`   "Neue Edelsteine" mit Gradient: ${hasEdelsteineGradient}`);
        console.log(`   "Newsletter" mit Gradient: ${hasNewsletterGradient}`);
        
        if (hasEdelsteineGradient && hasNewsletterGradient) {
          console.log('   ✅ Beide Überschriften haben die korrekte Gradient-Formatierung');
        } else {
          console.log('   ⚠️  Einige Überschriften haben möglicherweise nicht die korrekte Formatierung');
        }
        
        resolve(hasEdelsteineGradient && hasNewsletterGradient);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Homepage Inhalt nicht lesbar:', err.message);
      resolve(false);
    });
  });
}

// Test 3: CSS-Klassen prüfen
function testCSSClasses() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3002/de', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasGradientClass = data.includes('gradient-text');
        const hasAnimateClass = data.includes('animate-glow');
        const hasBothClasses = data.includes('gradient-text animate-glow');
        
        console.log('✅ CSS-Klassen geprüft');
        console.log(`   gradient-text Klasse: ${hasGradientClass}`);
        console.log(`   animate-glow Klasse: ${hasAnimateClass}`);
        console.log(`   Beide Klassen zusammen: ${hasBothClasses}`);
        
        resolve(hasBothClasses);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ CSS-Klassen nicht prüfbar:', err.message);
      resolve(false);
    });
  });
}

// Hauptfunktion
async function runTests() {
  console.log('🚀 Starte Homepage Headings Tests...\n');
  
  const homepageOk = await testHomepage();
  if (!homepageOk) {
    console.log('\n❌ Homepage nicht erreichbar!');
    console.log('Bitte starten Sie: npm run dev');
    return;
  }
  
  console.log('');
  const headingsOk = await testHeadingsFormatting();
  
  console.log('');
  const cssOk = await testCSSClasses();
  
  console.log('\n📊 Test-Ergebnisse:');
  console.log('==================');
  console.log(`Homepage erreichbar: ${homepageOk ? '✅' : '❌'}`);
  console.log(`Überschriften formatiert: ${headingsOk ? '✅' : '❌'}`);
  console.log(`CSS-Klassen vorhanden: ${cssOk ? '✅' : '❌'}`);
  
  if (homepageOk && headingsOk && cssOk) {
    console.log('\n🎉 Alle Tests erfolgreich!');
    console.log('   Überschriften "Neue Edelsteine" und "Newsletter" sind korrekt formatiert!');
    console.log('\n📋 Was wurde gemacht:');
    console.log('   1. ✅ "Neue Edelsteine" Überschrift mit gradient-text animate-glow formatiert');
    console.log('   2. ✅ "Newsletter" Überschrift mit gradient-text animate-glow formatiert');
    console.log('   3. ✅ Formatierung entspricht der Hero Section');
    console.log('\n🎨 Formatierung:');
    console.log('   - gradient-text: Verlaufseffekt für den Text');
    console.log('   - animate-glow: Leuchteffekt-Animation');
    console.log('   - Gleiche Formatierung wie Hero Section');
    console.log('\n🌐 URLs:');
    console.log('   Homepage: http://localhost:3002/de');
    console.log('   Mobile: https://sharp-lamps-pull.loca.lt/de');
  } else {
    console.log('\n⚠️  Einige Tests fehlgeschlagen.');
    console.log('   Bitte überprüfen Sie die Homepage manuell.');
  }
}

// Tests ausführen
runTests().catch(console.error);
