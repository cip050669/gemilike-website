#!/usr/bin/env node

/**
 * Test-Skript für Hero-Bilder
 * Überprüft verfügbare Bilder und deren Erreichbarkeit
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

console.log('🖼️  Hero-Bilder Test gestartet...\n');

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

// Verfügbare Bilder im products-Verzeichnis finden
function findAvailableImages() {
  console.log('📁 Verfügbare Bilder im products-Verzeichnis:');
  
  const productsDir = path.join(__dirname, 'public', 'products');
  
  if (!fs.existsSync(productsDir)) {
    console.log('❌ Products-Verzeichnis nicht gefunden');
    return [];
  }
  
  const files = fs.readdirSync(productsDir);
  const imageFiles = files.filter(file => 
    file.toLowerCase().endsWith('.jpg') || 
    file.toLowerCase().endsWith('.jpeg') || 
    file.toLowerCase().endsWith('.png')
  );
  
  console.log(`✅ ${imageFiles.length} Bilder gefunden`);
  
  // Kategorisiere Bilder
  const categories = {
    grün: imageFiles.filter(f => f.toLowerCase().includes('grün') || f.toLowerCase().includes('green')),
    blau: imageFiles.filter(f => f.toLowerCase().includes('blau') || f.toLowerCase().includes('blue')),
    rot: imageFiles.filter(f => f.toLowerCase().includes('rot') || f.toLowerCase().includes('red')),
    gelb: imageFiles.filter(f => f.toLowerCase().includes('gelb') || f.toLowerCase().includes('yellow')),
    pink: imageFiles.filter(f => f.toLowerCase().includes('pink') || f.toLowerCase().includes('rose')),
    turmalin: imageFiles.filter(f => f.toLowerCase().includes('turmalin')),
    saphir: imageFiles.filter(f => f.toLowerCase().includes('saphir')),
    tansanit: imageFiles.filter(f => f.toLowerCase().includes('tansanit')),
    morganit: imageFiles.filter(f => f.toLowerCase().includes('morganit')),
    zirkon: imageFiles.filter(f => f.toLowerCase().includes('zirkon')),
    zultanit: imageFiles.filter(f => f.toLowerCase().includes('zultanit')),
    hessonit: imageFiles.filter(f => f.toLowerCase().includes('hessonit'))
  };
  
  Object.entries(categories).forEach(([category, files]) => {
    if (files.length > 0) {
      console.log(`  🎨 ${category}: ${files.length} Bilder`);
      if (files.length <= 3) {
        files.forEach(file => console.log(`    - ${file}`));
      } else {
        console.log(`    - ${files[0]} (und ${files.length - 1} weitere)`);
      }
    }
  });
  
  return imageFiles;
}

// Teste Bild-Erreichbarkeit
async function testImageAccessibility(images) {
  console.log('\n🌐 Teste Bild-Erreichbarkeit:');
  
  const testImages = images.slice(0, 10); // Teste nur die ersten 10 Bilder
  
  for (const image of testImages) {
    const imageUrl = `${BASE_URL}/products/${encodeURIComponent(image)}`;
    
    try {
      const response = await makeRequest(imageUrl);
      
      if (response.statusCode === 200) {
        const size = response.headers['content-length'] ? 
          Math.round(parseInt(response.headers['content-length']) / 1024) : 'unbekannt';
        console.log(`✅ ${image} (${size}KB)`);
      } else {
        console.log(`❌ ${image} (Status: ${response.statusCode})`);
      }
    } catch (error) {
      console.log(`❌ ${image} (Fehler: ${error.message})`);
    }
  }
}

// Empfehlungen für Hero-Bilder
function recommendHeroImages(images) {
  console.log('\n💎 Empfohlene Hero-Bilder:');
  
  const recommendations = [
    {
      category: 'Grüne Edelsteine (Smaragd-ähnlich)',
      files: images.filter(f => f.toLowerCase().includes('grün')),
      reason: 'Perfekt für Edelstein-Website, grün = Natur, Luxus'
    },
    {
      category: 'Blaue Edelsteine (Saphir-ähnlich)',
      files: images.filter(f => f.toLowerCase().includes('blau')),
      reason: 'Elegant, vertrauenswürdig, professionell'
    },
    {
      category: 'Pink/Rosa Edelsteine',
      files: images.filter(f => f.toLowerCase().includes('pink')),
      reason: 'Warm, einladend, feminin'
    },
    {
      category: 'Turmalin (Mehrfarbig)',
      files: images.filter(f => f.toLowerCase().includes('turmalin')),
      reason: 'Spektakulär, zeigt Vielfalt der Edelsteine'
    }
  ];
  
  recommendations.forEach(rec => {
    if (rec.files.length > 0) {
      console.log(`\n🎨 ${rec.category}:`);
      console.log(`   Grund: ${rec.reason}`);
      console.log(`   Verfügbar: ${rec.files.length} Bilder`);
      
      // Zeige die besten Optionen
      const bestOptions = rec.files.slice(0, 3);
      bestOptions.forEach(file => {
        console.log(`   ✅ ${file}`);
      });
    }
  });
}

// Hauptfunktion
async function runTests() {
  console.log('🚀 Starte Hero-Bilder Tests...\n');
  
  const images = findAvailableImages();
  
  if (images.length === 0) {
    console.log('❌ Keine Bilder gefunden!');
    return;
  }
  
  await testImageAccessibility(images);
  recommendHeroImages(images);
  
  console.log('\n✅ Hero-Bilder Tests abgeschlossen!');
  console.log('\n📋 Nächste Schritte:');
  console.log('1. Wählen Sie ein passendes Hero-Bild aus den Empfehlungen');
  console.log('2. Aktualisieren Sie den imageUrl in HeroSection.tsx');
  console.log('3. Testen Sie das Bild im Browser');
  console.log('4. Optimieren Sie die Bildgröße für bessere Performance');
}

// Test ausführen
runTests().catch(console.error);


