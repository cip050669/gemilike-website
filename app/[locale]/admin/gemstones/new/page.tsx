'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropUpload } from '@/components/admin/DragDropUpload';

export default function NewGemstonePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [brightnessValue, setBrightnessValue] = useState(5);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsSubmitting(true);
    setMessage('');

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const gemstoneType = formData.get('type') || 'cut';
      const caratValue = formData.get('carat');
      const weightValue = caratValue && caratValue !== '' ? Number(caratValue) : null;
      
      // Validate name is required
      const name = formData.get('name');
      if (!name || String(name).trim() === '') {
        setMessage('❌ Der Name des Edelsteins ist erforderlich.');
        setIsSubmitting(false);
        const nameInput = form.querySelector('#name') as HTMLInputElement;
        if (nameInput) {
          nameInput.focus();
        }
        return;
      }
      
      const data = {
        name: formData.get('name'),
        category: formData.get('category') || 'Edelstein',
        type: gemstoneType,
        condition: gemstoneType === 'cut' ? 'CUT' : 'ROUGH',
        price: formData.get('price') ? Number(formData.get('price')) : 0,
        caratWeight: gemstoneType === 'cut' ? weightValue : null,
        gramWeight: gemstoneType === 'rough' ? weightValue : null,
        color: formData.get('color'),
        colorIntensity: formData.get('colorIntensity'),
        colorBrightness: formData.get('colorBrightness') ? Number(formData.get('colorBrightness')) : null,
        clarity: formData.get('clarity'),
        cut: formData.get('cut'),
        cutForm: formData.get('cutForm'),
        rarity: formData.get('rarity'),
        treatment: formData.get('treatment'),
        certification: formData.get('certification'),
        origin: formData.get('origin'),
        description: formData.get('description'),
        shortDescription: formData.get('description'),
        inStock: formData.get('inStock') !== 'off',
        isNew: formData.get('isNew') === 'on',
        isSold: false,
        images: uploadedImages.filter(Boolean),
        videos: uploadedVideos.filter(Boolean),
        status: 'PUBLISHED',
      };

      console.log('Sending gemstone data:', data);

      const response = await fetch('/api/admin/gemstones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Response status:', response.status);
      
      let result;
      try {
        const text = await response.text();
        console.log('Response text:', text);
        result = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Ungültige Antwort vom Server');
      }
      
      console.log('Response:', result);
      
      if (!response.ok) {
        throw new Error(result.error || `Server-Fehler: ${response.status}`);
      }
      
      if (result.success) {
        setMessage('✅ ' + (result.message || 'Edelstein erfolgreich erstellt'));
        setTimeout(() => {
          router.push('/de/admin/gemstones');
          router.refresh();
        }, 1500);
      } else {
        throw new Error(result.error || 'Fehler beim Speichern');
      }
    } catch (error) {
      console.error('Error saving gemstone:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      setMessage('❌ Fehler beim Speichern: ' + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-slate-950 text-white">
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
        <div className="border-white/10 bg-gray-800/50/50 rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Hidden field for type - default to cut */}
            <input type="hidden" name="type" value="cut" />
            
            {/* Basic Info */}
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
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
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
                  min="0"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                  placeholder="z.B. 2.5"
                />
              </div>
            </div>

            {/* Select Lists - Completely Separate from Grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Edelstein-Eigenschaften</h3>
              {/* Farbe */}
              <div className="flex flex-col">
                <label htmlFor="color" className="block text-sm font-medium text-gray-200 mb-2">
                  Farbe
                </label>
                <select
                  id="color"
                  name="color"
                  className="w-1/4 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
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
              <div className="flex flex-col">
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
                    formNoValidate
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Weiß (0)</span>
                    <span className="font-medium text-white">{brightnessValue}</span>
                    <span>Schwarz (10)</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    Aktueller Wert: {brightnessValue} ({brightnessValue === 0 ? 'Weiß' : brightnessValue === 10 ? 'Schwarz' : `Stufe ${brightnessValue}`})
                  </div>
                </div>
              </div>

              {/* Schliff */}
              <div className="flex flex-col">
                <label htmlFor="cut" className="block text-sm font-medium text-gray-200 mb-2">
                  Schliff
                </label>
                <select
                  id="cut"
                  name="cut"
                  className="w-1/4 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                >
                  <option value="">Schliff wählen</option>
                  <option value="Brillant">Brillant</option>
                  <option value="Princess">Princess</option>
                  <option value="Emerald">Emerald</option>
                  <option value="Oval">Oval</option>
                  <option value="Radiant">Radiant</option>
                  <option value="Asscher">Asscher</option>
                  <option value="Marquise">Marquise</option>
                  <option value="Herz">Herz</option>
                  <option value="Tropfen">Tropfen</option>
                  <option value="Baguette">Baguette</option>
                  <option value="Cushion">Cushion</option>
                  <option value="Trillion">Trillion</option>
                </select>
              </div>

              {/* Schliffform */}
              <div className="flex flex-col">
                <label htmlFor="cutForm" className="block text-sm font-medium text-gray-200 mb-2">
                  Schliffform
                </label>
                <select
                  id="cutForm"
                  name="cutForm"
                  className="w-1/4 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                >
                  <option value="">Schliffform wählen</option>
                  <option value="Rund">Rund</option>
                  <option value="Oval">Oval</option>
                  <option value="Kissen">Kissen</option>
                  <option value="Herz">Herz</option>
                  <option value="Tropfen">Tropfen</option>
                  <option value="Marquise">Marquise</option>
                  <option value="Princess">Princess</option>
                  <option value="Brillant">Brillant</option>
                  <option value="Smaragd">Smaragd</option>
                  <option value="Baguette">Baguette</option>
                  <option value="Asscher">Asscher</option>
                  <option value="Trillion">Trillion</option>
                </select>
              </div>

              {/* Rarität */}
              <div className="flex flex-col">
                <label htmlFor="rarity" className="block text-sm font-medium text-gray-200 mb-2">
                  Rarität
                </label>
                <select
                  id="rarity"
                  name="rarity"
                  className="w-1/4 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                >
                  <option value="">Rarität wählen</option>
                  <option value="Gewöhnlich">Gewöhnlich</option>
                  <option value="Häufig">Häufig</option>
                  <option value="Selten">Selten</option>
                  <option value="Sehr selten">Sehr selten</option>
                  <option value="Außergewöhnlich">Außergewöhnlich</option>
                  <option value="Einzigartig">Einzigartig</option>
                  <option value="Museumsqualität">Museumsqualität</option>
                </select>
              </div>

              {/* Reinheit */}
              <div className="flex flex-col">
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

              {/* Herkunft */}
              <div className="flex flex-col">
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
              <div className="flex flex-col">
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
              <div className="flex flex-col">
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

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  min="0"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                  placeholder="z.B. 1500.00"
                />
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
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                placeholder="Beschreiben Sie den Edelstein..."
              ></textarea>
            </div>

            {/* Bilder Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Bilder
              </label>
              <DragDropUpload
                accept="image"
                multiple={true}
                maxFiles={10}
                existingUrls={uploadedImages}
                onUploadComplete={setUploadedImages}
              />
            </div>

            {/* Videos Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2 mt-6">
                Videos
              </label>
              <DragDropUpload
                accept="video"
                multiple={true}
                maxFiles={2}
                existingUrls={uploadedVideos}
                onUploadComplete={setUploadedVideos}
              />
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-lg mt-4 ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={() => router.push('/de/admin/gemstones')}
                disabled={isSubmitting}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
