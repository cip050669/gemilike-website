'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewGemstonePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [brightnessValue, setBrightnessValue] = useState(5);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name'),
        category: formData.get('category') || 'Edelstein',
        type: formData.get('type') || 'cut',
        price: formData.get('price'),
        weight: formData.get('weight'),
        dimensions: formData.get('dimensions'),
        color: formData.get('color'),
        colorIntensity: formData.get('colorIntensity'),
        colorBrightness: formData.get('colorBrightness'),
        clarity: formData.get('clarity'),
        cut: formData.get('cut'),
        cutForm: formData.get('cutForm'),
        treatment: formData.get('treatment'),
        certification: formData.get('certification'),
        rarity: formData.get('rarity'),
        origin: formData.get('origin'),
        description: formData.get('description'),
        inStock: formData.get('inStock') === 'on',
        stock: formData.get('stock'),
        sku: formData.get('sku'),
        isNew: formData.get('isNew') === 'on'
      };

      const response = await fetch('/api/admin/gemstones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ ' + result.message);
        setTimeout(() => {
          router.push('/de/admin/gemstones');
        }, 1000);
      } else {
        setMessage('❌ ' + result.error);
      }
    } catch {
      setMessage('❌ Fehler beim Speichern');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-800/50">
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">Neuer Edelstein</h1>
          <p className="text-gray-300">
            Fügen Sie einen neuen Edelstein zu Ihrer Kollektion hinzu
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-800/30 rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                  Name des Edelsteins
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="z.B. Smaragd, Rubin, Diamant"
                />
              </div>

              {/* Karat */}
              <div>
                <label htmlFor="carat" className="block text-sm font-medium text-gray-200 mb-2">
                  Karat
                </label>
                <input
                  type="number"
                  id="carat"
                  name="carat"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="z.B. 2.5"
                />
              </div>

              {/* Farbe */}
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-200 mb-2">
                  Farbe
                </label>
                <select
                  id="color"
                  name="color"
                  className="w-1/4 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Farbe wählen</option>
                  <option value="rot">Rot</option>
                  <option value="blau">Blau</option>
                  <option value="grün">Grün</option>
                  <option value="gelb">Gelb</option>
                  <option value="weiß">Weiß</option>
                  <option value="schwarz">Schwarz</option>
                  <option value="pink">Pink</option>
                  <option value="lila">Lila</option>
                </select>
              </div>

              {/* Farbsättigung */}
              <div>
                <label htmlFor="colorIntensity" className="block text-sm font-medium text-gray-200 mb-2">
                  Farbsättigung
                </label>
                <select
                  id="colorIntensity"
                  name="colorIntensity"
                  className="w-1/4 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Farbsättigung wählen</option>
                  <option value="Pale">Pale (Blass)</option>
                  <option value="Light">Light (Hell)</option>
                  <option value="Medium">Medium (Mittel)</option>
                  <option value="Intense">Intense (Intensiv)</option>
                  <option value="Vivid">Vivid (Lebhaft)</option>
                  <option value="Deep">Deep (Tief)</option>
                </select>
              </div>

              {/* Farbhelligkeit */}
              <div>
                <label htmlFor="colorBrightness" className="block text-sm font-medium text-gray-200 mb-2">
                  Farbhelligkeit
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    id="colorBrightness"
                    name="colorBrightness"
                    min="0"
                    max="10"
                    step="1"
                    value={brightnessValue}
                    onChange={(e) => setBrightnessValue(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: 'linear-gradient(to right, #ffffff 0%, #f0f0f0 50%, #000000 100%)',
                      WebkitAppearance: 'none',
                      appearance: 'none',
                      height: '12px',
                      borderRadius: '6px',
                      outline: 'none'
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Weiß (0)</span>
                    <span className="font-medium text-blue-600">{brightnessValue}</span>
                    <span>Schwarz (10)</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    Aktueller Wert: {brightnessValue} ({brightnessValue === 0 ? 'Weiß' : brightnessValue === 10 ? 'Schwarz' : `Stufe ${brightnessValue}`})
                  </div>
                </div>
              </div>

              {/* Schliff */}
              <div>
                <label htmlFor="cut" className="block text-sm font-medium text-gray-200 mb-2">
                  Schliff
                </label>
                <select
                  id="cut"
                  name="cut"
                  className="w-1/4 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Schliff wählen</option>
                  <option value="brillant">Brillant</option>
                  <option value="princess">Princess</option>
                  <option value="emerald">Emerald</option>
                  <option value="oval">Oval</option>
                  <option value="marquise">Marquise</option>
                  <option value="pear">Pear</option>
                  <option value="cushion">Cushion</option>
                  <option value="asscher">Asscher</option>
                </select>
              </div>

              {/* Reinheit */}
              <div>
                <label htmlFor="clarity" className="block text-sm font-medium text-gray-200 mb-2">
                  Reinheit
                </label>
                <select
                  id="clarity"
                  name="clarity"
                  className="w-1/4 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Reinheit wählen</option>
                  <option value="FL">FL - Flawless</option>
                  <option value="IF">IF - Internally Flawless</option>
                  <option value="VVS1">VVS1 - Very Very Slightly Included</option>
                  <option value="VVS2">VVS2 - Very Very Slightly Included</option>
                  <option value="VS1">VS1 - Very Slightly Included</option>
                  <option value="VS2">VS2 - Very Slightly Included</option>
                  <option value="SI1">SI1 - Slightly Included</option>
                  <option value="SI2">SI2 - Slightly Included</option>
                </select>
              </div>

              {/* Preis */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-200 mb-2">
                  Preis (€)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="z.B. 1500.00"
                />
              </div>

              {/* Herkunft */}
              <div>
                <label htmlFor="origin" className="block text-sm font-medium text-gray-200 mb-2">
                  Herkunft
                </label>
                <select
                  id="origin"
                  name="origin"
                  className="w-1/4 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Herkunft wählen</option>
                  <option value="Afghanistan">Afghanistan</option>
                  <option value="Australien">Australien</option>
                  <option value="Brasilien">Brasilien</option>
                  <option value="Burma (Myanmar)">Burma (Myanmar)</option>
                  <option value="China">China</option>
                  <option value="Indien">Indien</option>
                  <option value="Kolumbien">Kolumbien</option>
                  <option value="Madagaskar">Madagaskar</option>
                  <option value="Mali">Mali</option>
                  <option value="Mosambik">Mosambik</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Russland">Russland</option>
                  <option value="Sambia">Sambia</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Tansania">Tansania</option>
                  <option value="Thailand">Thailand</option>
                  <option value="USA">USA</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Zimbabwe">Zimbabwe</option>
                  <option value="Sonstige">Sonstige</option>
                </select>
              </div>

              {/* Zertifizierung */}
              <div>
                <label htmlFor="certification" className="block text-sm font-medium text-gray-200 mb-2">
                  Zertifizierung
                </label>
                <select
                  id="certification"
                  name="certification"
                  className="w-1/4 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Zertifizierung wählen</option>
                  <option value="GIA">GIA - Gemological Institute of America</option>
                  <option value="IGI">IGI - International Gemological Institute</option>
                  <option value="AGS">AGS - American Gem Society</option>
                  <option value="HRD">HRD - Hoge Raad voor Diamant</option>
                  <option value="SSEF">SSEF - Swiss Gemmological Institute</option>
                  <option value="Gübelin">Gübelin Gem Lab</option>
                  <option value="EGL">EGL - European Gemological Laboratory</option>
                  <option value="Keine">Keine Zertifizierung</option>
                </select>
              </div>

              {/* Behandlung */}
              <div>
                <label htmlFor="treatment" className="block text-sm font-medium text-gray-200 mb-2">
                  Behandlung
                </label>
                <select
                  id="treatment"
                  name="treatment"
                  className="w-1/4 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Behandlung wählen</option>
                  <option value="Keine">Keine Behandlung</option>
                  <option value="Erhitzen">Erhitzen (Heating)</option>
                  <option value="Bestrahlen">Bestrahlen (Irradiation)</option>
                  <option value="Färben">Färben (Dyeing)</option>
                  <option value="Füllen">Füllen (Filling)</option>
                  <option value="Ölen">Ölen (Oiling)</option>
                  <option value="Wachsen">Wachsen (Waxing)</option>
                  <option value="Beschichten">Beschichten (Coating)</option>
                </select>
              </div>
            </div>

            {/* Beschreibung */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-2">
                Beschreibung
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Beschreiben Sie den Edelstein..."
              ></textarea>
            </div>

            {/* Bilder Upload */}
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-200 mb-2">
                Bilder
              </label>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Sie können mehrere Bilder gleichzeitig auswählen
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                Edelstein speichern
              </button>
              <form action="/de/admin/gemstones" method="get">
                <button
                  type="submit"
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
                >
                  Abbrechen
                </button>
              </form>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-lg ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/de/admin/gemstones')}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Speichern...' : 'Edelstein speichern'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
