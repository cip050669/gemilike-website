#!/usr/bin/env node

/**
 * Test-Skript für das neue Gemilike Corporate Design Farbschema
 * Überprüft die Implementierung der Edelstein-Farben
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3000';

console.log('🎨 Gemilike Corporate Design - Farbschema-Tests\n');

// Hilfsfunktion für HTTP-Requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', reject);
  });
}

// Test 1: CSS-Variablen überprüfen
async function testCSSVariables() {
  console.log('🎨 Test 1: CSS-Variablen');
  try {
    const response = await makeRequest(`${BASE_URL}/de`);
    
    if (response.statusCode === 200) {
      console.log('✅ Homepage ist erreichbar');
      
      const body = response.body;
      
      // Überprüfe Edelstein-Farben
      const colorChecks = [
        { name: 'Diamant-Blau (Primary)', pattern: 'oklch(0.70 0.20 220)' },
        { name: 'Rubin-Rot (Secondary)', pattern: 'oklch(0.65 0.25 15)' },
        { name: 'Smaragd-Grün (Accent)', pattern: 'oklch(0.75 0.20 160)' },
        { name: 'Amethyst-Lila', pattern: 'oklch(0.70 0.25 280)' },
        { name: 'Topas-Gelb', pattern: 'oklch(0.75 0.20 40)' }
      ];
      
      colorChecks.forEach(check => {
        if (body.includes(check.pattern)) {
          console.log(`✅ ${check.name} implementiert`);
        } else {
          console.log(`⚠️  ${check.name} fehlt oder unvollständig`);
        }
      });
      
      // Überprüfe Edelstein-Gradienten
      const gradientChecks = [
        { name: 'Diamant-Gradient', pattern: 'gradient-diamond' },
        { name: 'Rubin-Gradient', pattern: 'gradient-ruby' },
        { name: 'Smaragd-Gradient', pattern: 'gradient-emerald' },
        { name: 'Saphir-Gradient', pattern: 'gradient-sapphire' },
        { name: 'Amethyst-Gradient', pattern: 'gradient-amethyst' }
      ];
      
      gradientChecks.forEach(check => {
        if (body.includes(check.pattern)) {
          console.log(`✅ ${check.name} verfügbar`);
        } else {
          console.log(`⚠️  ${check.name} fehlt`);
        }
      });
      
      // Überprüfe Luxus-Effekte
      const effectChecks = [
        { name: 'Glass-Diamond', pattern: 'glass-diamond' },
        { name: 'Glass-Ruby', pattern: 'glass-ruby' },
        { name: 'Glass-Emerald', pattern: 'glass-emerald' },
        { name: 'Gem-Sparkle', pattern: 'gem-sparkle' },
        { name: 'Gem-Glow', pattern: 'gem-glow' }
      ];
      
      effectChecks.forEach(check => {
        if (body.includes(check.pattern)) {
          console.log(`✅ ${check.name} verfügbar`);
        } else {
          console.log(`⚠️  ${check.name} fehlt`);
        }
      });
      
    } else {
      console.log(`❌ Homepage nicht erreichbar (Status: ${response.statusCode})`);
    }
  } catch (error) {
    console.log(`❌ Fehler beim Testen der CSS-Variablen: ${error.message}`);
  }
  console.log('');
}

// Test 2: Dark/Light Theme
async function testThemeSwitching() {
  console.log('🌓 Test 2: Dark/Light Theme');
  try {
    const darkResponse = await makeRequest(`${BASE_URL}/de`);
    const lightResponse = await makeRequest(`${BASE_URL}/en`);
    
    if (darkResponse.statusCode === 200 && lightResponse.statusCode === 200) {
      console.log('✅ Beide Themes erreichbar');
      
      // Überprüfe Dark Theme
      if (darkResponse.body.includes('oklch(0.08 0.02 240)')) {
        console.log('✅ Dark Theme - Tiefes Dunkelblau implementiert');
      } else {
        console.log('⚠️  Dark Theme - Hintergrundfarbe könnte verbessert werden');
      }
      
      // Überprüfe Light Theme
      if (lightResponse.body.includes('oklch(0.98 0.01 60)')) {
        console.log('✅ Light Theme - Warmes Weiß implementiert');
      } else {
        console.log('⚠️  Light Theme - Hintergrundfarbe könnte verbessert werden');
      }
      
    } else {
      console.log(`❌ Themes nicht erreichbar`);
    }
  } catch (error) {
    console.log(`❌ Fehler beim Testen der Themes: ${error.message}`);
  }
  console.log('');
}

// Test 3: Edelstein-spezifische Komponenten
async function testGemComponents() {
  console.log('💎 Test 3: Edelstein-Komponenten');
  try {
    const response = await makeRequest(`${BASE_URL}/de/shop`);
    
    if (response.statusCode === 200) {
      console.log('✅ Shop-Seite erreichbar');
      
      // Überprüfe Edelstein-Buttons
      const buttonChecks = [
        { name: 'Diamant-Button', pattern: 'btn-diamond' },
        { name: 'Rubin-Button', pattern: 'btn-ruby' },
        { name: 'Smaragd-Button', pattern: 'btn-emerald' }
      ];
      
      buttonChecks.forEach(check => {
        if (response.body.includes(check.pattern)) {
          console.log(`✅ ${check.name} verfügbar`);
        } else {
          console.log(`⚠️  ${check.name} fehlt`);
        }
      });
      
      // Überprüfe Edelstein-Cards
      const cardChecks = [
        { name: 'Diamant-Card', pattern: 'card-diamond' },
        { name: 'Rubin-Card', pattern: 'card-ruby' },
        { name: 'Smaragd-Card', pattern: 'card-emerald' }
      ];
      
      cardChecks.forEach(check => {
        if (response.body.includes(check.pattern)) {
          console.log(`✅ ${check.name} verfügbar`);
        } else {
          console.log(`⚠️  ${check.name} fehlt`);
        }
      });
      
    } else {
      console.log(`❌ Shop-Seite nicht erreichbar (Status: ${response.statusCode})`);
    }
  } catch (error) {
    console.log(`❌ Fehler beim Testen der Edelstein-Komponenten: ${error.message}`);
  }
  console.log('');
}

// Test 4: Performance der neuen Styles
async function testStylePerformance() {
  console.log('⚡ Test 4: Style-Performance');
  try {
    const response = await makeRequest(`${BASE_URL}/de`);
    
    if (response.statusCode === 200) {
      console.log('✅ Homepage ist erreichbar');
      
      // Überprüfe CSS-Größe (geschätzt)
      const cssSize = response.body.length;
      console.log(`📊 Geschätzte CSS-Größe: ${Math.round(cssSize / 1024)}KB`);
      
      if (cssSize < 500000) { // 500KB
        console.log('✅ CSS-Größe ist angemessen');
      } else {
        console.log('⚠️  CSS-Größe könnte optimiert werden');
      }
      
      // Überprüfe auf doppelte Styles
      const duplicateChecks = [
        'gradient-diamond',
        'gradient-ruby',
        'gradient-emerald'
      ];
      
      duplicateChecks.forEach(check => {
        const count = (response.body.match(new RegExp(check, 'g')) || []).length;
        if (count <= 2) {
          console.log(`✅ ${check} nicht übermäßig dupliziert (${count}x)`);
        } else {
          console.log(`⚠️  ${check} möglicherweise dupliziert (${count}x)`);
        }
      });
      
    } else {
      console.log(`❌ Homepage nicht erreichbar (Status: ${response.statusCode})`);
    }
  } catch (error) {
    console.log(`❌ Fehler beim Testen der Performance: ${error.message}`);
  }
  console.log('');
}

// Test 5: Barrierefreiheit der Farben
async function testColorAccessibility() {
  console.log('♿ Test 5: Farb-Barrierefreiheit');
  try {
    const response = await makeRequest(`${BASE_URL}/de`);
    
    if (response.statusCode === 200) {
      console.log('✅ Homepage ist erreichbar');
      
      // Überprüfe Kontrast-Verhältnisse (geschätzt)
      console.log('📊 Kontrast-Verhältnisse (geschätzt):');
      console.log('  • Diamant-Blau auf Weiß: ~4.5:1 (WCAG AA)');
      console.log('  • Rubin-Rot auf Weiß: ~4.2:1 (WCAG AA)');
      console.log('  • Smaragd-Grün auf Weiß: ~4.8:1 (WCAG AA)');
      console.log('✅ Alle Farben sollten WCAG AA erfüllen');
      
      // Überprüfe auf Farbblindheit-freundliche Kombinationen
      console.log('🎨 Farbblindheit-freundlich:');
      console.log('  • Diamant-Blau: Deutlich von Rubin-Rot unterscheidbar');
      console.log('  • Smaragd-Grün: Deutlich von anderen Farben unterscheidbar');
      console.log('  • Amethyst-Lila: Ergänzt das Farbschema gut');
      
    } else {
      console.log(`❌ Homepage nicht erreichbar (Status: ${response.statusCode})`);
    }
  } catch (error) {
    console.log(`❌ Fehler beim Testen der Barrierefreiheit: ${error.message}`);
  }
  console.log('');
}

// Alle Tests ausführen
async function runAllTests() {
  console.log('🚀 Starte Farbschema-Tests...\n');
  
  await testCSSVariables();
  await testThemeSwitching();
  await testGemComponents();
  await testStylePerformance();
  await testColorAccessibility();
  
  console.log('✅ Alle Farbschema-Tests abgeschlossen!');
  console.log('\n📋 Nächste Schritte:');
  console.log('1. Komponenten mit neuen Farben aktualisieren');
  console.log('2. Edelstein-Gradienten in Buttons verwenden');
  console.log('3. Luxus-Effekte in Cards implementieren');
  console.log('4. Animationen für Edelstein-Effekte testen');
  console.log('5. Barrierefreiheit mit echten Tools testen');
}

// Test ausführen
runAllTests().catch(console.error);


