#!/usr/bin/env node

/**
 * Test-Skript für technische SEO-Implementierung
 * Überprüft Sitemap, robots.txt und strukturierte Daten
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3000';

console.log('🔍 Technische SEO-Tests gestartet...\n');

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

// Test 1: Sitemap
async function testSitemap() {
  console.log('📋 Test 1: Sitemap');
  try {
    const response = await makeRequest(`${BASE_URL}/sitemap.xml`);
    
    if (response.statusCode === 200) {
      console.log('✅ Sitemap ist erreichbar');
      
      // Überprüfe XML-Struktur
      if (response.body.includes('<urlset') && response.body.includes('<url>')) {
        console.log('✅ Sitemap hat korrekte XML-Struktur');
        
        // Zähle URLs
        const urlCount = (response.body.match(/<url>/g) || []).length;
        console.log(`✅ Sitemap enthält ${urlCount} URLs`);
        
        // Überprüfe Locales
        if (response.body.includes('/de/') && response.body.includes('/en/')) {
          console.log('✅ Sitemap enthält beide Sprachen (DE/EN)');
        } else {
          console.log('⚠️  Sitemap könnte Locales verbessern');
        }
      } else {
        console.log('❌ Sitemap hat ungültige XML-Struktur');
      }
    } else {
      console.log(`❌ Sitemap nicht erreichbar (Status: ${response.statusCode})`);
    }
  } catch (error) {
    console.log(`❌ Fehler beim Testen der Sitemap: ${error.message}`);
  }
  console.log('');
}

// Test 2: robots.txt
async function testRobotsTxt() {
  console.log('🤖 Test 2: robots.txt');
  try {
    const response = await makeRequest(`${BASE_URL}/robots.txt`);
    
    if (response.statusCode === 200) {
      console.log('✅ robots.txt ist erreichbar');
      
      // Überprüfe Inhalt
      if (response.body.includes('User-agent:') && response.body.includes('Disallow:')) {
        console.log('✅ robots.txt hat korrekte Struktur');
        
        if (response.body.includes('Sitemap:')) {
          console.log('✅ robots.txt verweist auf Sitemap');
        } else {
          console.log('⚠️  robots.txt sollte Sitemap-Referenz haben');
        }
        
        if (response.body.includes('Disallow: /admin/')) {
          console.log('✅ Admin-Bereiche sind ausgeschlossen');
        } else {
          console.log('⚠️  Admin-Bereiche sollten ausgeschlossen sein');
        }
      } else {
        console.log('❌ robots.txt hat ungültige Struktur');
      }
    } else {
      console.log(`❌ robots.txt nicht erreichbar (Status: ${response.statusCode})`);
    }
  } catch (error) {
    console.log(`❌ Fehler beim Testen der robots.txt: ${error.message}`);
  }
  console.log('');
}

// Test 3: Meta-Tags
async function testMetaTags() {
  console.log('🏷️  Test 3: Meta-Tags');
  try {
    const response = await makeRequest(`${BASE_URL}/de`);
    
    if (response.statusCode === 200) {
      console.log('✅ Homepage ist erreichbar');
      
      const body = response.body;
      
      // Überprüfe wichtige Meta-Tags
      const metaChecks = [
        { tag: 'title', name: 'Title-Tag' },
        { tag: 'description', name: 'Meta-Description' },
        { tag: 'keywords', name: 'Meta-Keywords' },
        { tag: 'og:title', name: 'Open Graph Title' },
        { tag: 'og:description', name: 'Open Graph Description' },
        { tag: 'og:image', name: 'Open Graph Image' },
        { tag: 'twitter:card', name: 'Twitter Card' }
      ];
      
      metaChecks.forEach(check => {
        if (body.includes(`<meta name="${check.tag}"`) || 
            body.includes(`<meta property="${check.tag}"`) ||
            body.includes(`<title>`) && check.tag === 'title') {
          console.log(`✅ ${check.name} vorhanden`);
        } else {
          console.log(`⚠️  ${check.name} fehlt oder unvollständig`);
        }
      });
      
      // Überprüfe strukturierte Daten
      if (body.includes('application/ld+json')) {
        console.log('✅ Strukturierte Daten (JSON-LD) vorhanden');
      } else {
        console.log('⚠️  Strukturierte Daten fehlen');
      }
      
    } else {
      console.log(`❌ Homepage nicht erreichbar (Status: ${response.statusCode})`);
    }
  } catch (error) {
    console.log(`❌ Fehler beim Testen der Meta-Tags: ${error.message}`);
  }
  console.log('');
}

// Test 4: Performance-Headers
async function testPerformanceHeaders() {
  console.log('⚡ Test 4: Performance-Headers');
  try {
    const response = await makeRequest(`${BASE_URL}/de`);
    
    if (response.statusCode === 200) {
      console.log('✅ Homepage ist erreichbar');
      
      const headers = response.headers;
      
      // Überprüfe wichtige Headers
      const headerChecks = [
        { header: 'x-frame-options', name: 'X-Frame-Options' },
        { header: 'x-content-type-options', name: 'X-Content-Type-Options' },
        { header: 'referrer-policy', name: 'Referrer-Policy' },
        { header: 'content-encoding', name: 'Content-Encoding (Gzip)' }
      ];
      
      headerChecks.forEach(check => {
        if (headers[check.header]) {
          console.log(`✅ ${check.name}: ${headers[check.header]}`);
        } else {
          console.log(`⚠️  ${check.name} fehlt`);
        }
      });
      
      // Überprüfe Cache-Headers
      if (headers['cache-control']) {
        console.log(`✅ Cache-Control: ${headers['cache-control']}`);
      } else {
        console.log('⚠️  Cache-Control fehlt');
      }
      
    } else {
      console.log(`❌ Homepage nicht erreichbar (Status: ${response.statusCode})`);
    }
  } catch (error) {
    console.log(`❌ Fehler beim Testen der Headers: ${error.message}`);
  }
  console.log('');
}

// Test 5: Mehrsprachigkeit
async function testMultilingual() {
  console.log('🌍 Test 5: Mehrsprachigkeit');
  try {
    const locales = ['de', 'en'];
    
    for (const locale of locales) {
      const response = await makeRequest(`${BASE_URL}/${locale}`);
      
      if (response.statusCode === 200) {
        console.log(`✅ ${locale.toUpperCase()}-Version erreichbar`);
        
        // Überprüfe hreflang
        if (response.body.includes('hreflang')) {
          console.log(`✅ ${locale.toUpperCase()}-Version hat hreflang-Tags`);
        } else {
          console.log(`⚠️  ${locale.toUpperCase()}-Version sollte hreflang-Tags haben`);
        }
        
        // Überprüfe lang-Attribut
        if (response.body.includes(`lang="${locale}"`)) {
          console.log(`✅ ${locale.toUpperCase()}-Version hat korrektes lang-Attribut`);
        } else {
          console.log(`⚠️  ${locale.toUpperCase()}-Version sollte lang-Attribut haben`);
        }
      } else {
        console.log(`❌ ${locale.toUpperCase()}-Version nicht erreichbar (Status: ${response.statusCode})`);
      }
    }
  } catch (error) {
    console.log(`❌ Fehler beim Testen der Mehrsprachigkeit: ${error.message}`);
  }
  console.log('');
}

// Alle Tests ausführen
async function runAllTests() {
  console.log('🚀 Starte technische SEO-Tests...\n');
  
  await testSitemap();
  await testRobotsTxt();
  await testMetaTags();
  await testPerformanceHeaders();
  await testMultilingual();
  
  console.log('✅ Alle technischen SEO-Tests abgeschlossen!');
  console.log('\n📋 Nächste Schritte:');
  console.log('1. Google Search Console einrichten');
  console.log('2. Google Analytics konfigurieren');
  console.log('3. Lighthouse-Audit durchführen');
  console.log('4. Echte Inhalte für Content-SEO hinzufügen');
}

// Test ausführen
runAllTests().catch(console.error);

