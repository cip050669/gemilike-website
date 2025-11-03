'use client';

import { useEffect, useState } from 'react';

export type GemstoneFormValues = {
  id?: string;
  name: string;
  gemstoneType: string;
  type: 'cut' | 'rough';
  cut: string;
  cutForm: string;
  origin: string;
  price: string;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  color: string;
  colorSaturation: string;
  colorBrightness: number; // 0-10
  clarity: string;
  treatment: string;
  certification: string;
  images: string[];
  videos: string[];
  isNew: boolean;
  isSold: boolean;
  description: string;
};

interface GemstoneEditorProps {
  initialValues?: GemstoneFormValues | null;
  onCancel: () => void;
  onSubmit: (values: GemstoneFormValues) => void;
}

type OptionItem = {
  value: string;
  label?: string;
  group?: string;
};

const GEMSTONE_TYPE_OPTIONS: OptionItem[] = [
  'Diamant',
  'Smaragd',
  'Rubin',
  'Saphir',
  'Aquamarin',
  'Tansanit',
  'Turmalin',
  'Opal',
  'Amethyst',
  'Topas',
  'Morganit',
  'Spinell',
  'Zirkon',
  'Peridot',
  'Alexandrit',
  'Granat',
  'Kunzit',
  'Mondstein',
].map((value) => ({ value }));

const CUT_STYLE_OPTIONS: OptionItem[] = [
  'Brillant',
  'Princess',
  'Emerald',
  'Oval',
  'Radiant',
  'Asscher',
  'Marquise',
  'Herz',
  'Tropfen',
  'Baguette',
  'Cushion',
  'Trillion',
].map((value) => ({ value }));

const CUT_FORM_OPTIONS: OptionItem[] = [
  'Rund',
  'Oval',
  'Kissen',
  'Herz',
  'Tropfen',
  'Marquise',
  'Princess',
  'Brillant',
  'Smaragd',
  'Baguette',
  'Asscher',
  'Trillion',
].map((value) => ({ value }));

const ORIGIN_OPTIONS: OptionItem[] = [
  'Kolumbien',
  'Myanmar',
  'Sri Lanka',
  'Thailand',
  'Indien',
  'Tansania',
  'Sambia',
  'Brasilien',
  'Südafrika',
  'Madagaskar',
  'Australien',
  'Pakistan',
  'Afghanistan',
  'USA',
  'Kanada',
  'China',
  'Russland',
  'Äthiopien',
  'Kenia',
  'Mosambik',
].map((value) => ({ value }));

const COLOR_OPTIONS: OptionItem[] = [
  'Farblos',
  'Weiß',
  'Gelb',
  'Champagner',
  'Orange',
  'Rot',
  'Pink',
  'Violett',
  'Blau',
  'Türkis',
  'Grün',
  'Olivgrün',
  'Teal',
  'Braun',
  'Grau',
  'Schwarz',
].map((value) => ({ value }));

const SATURATION_OPTIONS: OptionItem[] = [
  { value: 'Pale', label: 'Pale (sehr hell)' },
  { value: 'Light', label: 'Light (hell)' },
  { value: 'Medium', label: 'Medium (mittel)' },
  { value: 'Intense', label: 'Intense (intensiv)' },
  { value: 'Vivid', label: 'Vivid (sehr intensiv)' },
  { value: 'Deep', label: 'Deep (dunkel)' },
  { value: 'Rich', label: 'Rich (satt)' },
];

const CLARITY_OPTIONS: OptionItem[] = [
  { value: 'FL', label: 'FL - Flawless' },
  { value: 'IF', label: 'IF - Internally Flawless' },
  { value: 'VVS1', label: 'VVS1 - Very Very Slightly Included 1' },
  { value: 'VVS2', label: 'VVS2 - Very Very Slightly Included 2' },
  { value: 'VS1', label: 'VS1 - Very Slightly Included 1' },
  { value: 'VS2', label: 'VS2 - Very Slightly Included 2' },
  { value: 'SI1', label: 'SI1 - Slightly Included 1' },
  { value: 'SI2', label: 'SI2 - Slightly Included 2' },
  { value: 'SI3', label: 'SI3 - Slightly Included 3' },
  { value: 'I1', label: 'I1 - Included 1' },
  { value: 'I2', label: 'I2 - Included 2' },
  { value: 'I3', label: 'I3 - Included 3' },
];

const TREATMENT_OPTIONS: OptionItem[] = [
  'Keine Behandlung',
  'Erhitzt',
  'Geölt',
  'Bestrahlt',
  'Diffusionsbehandlung',
  'Beschichtet',
  'Gebleicht',
  'Gefüllt (Fracture Filling)',
  'Stabilisiert',
].map((value) => ({ value }));

const CERTIFICATION_OPTIONS: OptionItem[] = [
  'GIA',
  'IGI',
  'HRD',
  'SSEF',
  'Gübelin',
  'DSEF',
  'AIGS',
  'GRS',
  'GemResearch Swisslab',
  'Keine Zertifizierung',
].map((value) => ({ value }));

const EMPTY_FORM: GemstoneFormValues = {
  name: '',
  gemstoneType: '',
  type: 'cut',
  cut: '',
  cutForm: '',
  origin: '',
  price: '',
  weight: '',
  dimensions: {
    length: '',
    width: '',
    height: '',
  },
  color: '',
  colorSaturation: '',
  colorBrightness: 5, // Default: Mittelwert
  clarity: '',
  treatment: '',
  certification: '',
  images: [''],
  videos: [''],
  isNew: false,
  isSold: false,
  description: '',
};

export function GemstoneEditor({ initialValues, onCancel, onSubmit }: GemstoneEditorProps) {
  const [formValues, setFormValues] = useState<GemstoneFormValues>(EMPTY_FORM);

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        ...EMPTY_FORM,
        ...initialValues,
        cut: initialValues.cut ?? '',
        cutForm: initialValues.cutForm ?? '',
        colorBrightness: initialValues.colorBrightness ?? 5,
        images: initialValues.images.length ? initialValues.images.slice(0, 10) : [''],
        videos: initialValues.videos.length ? initialValues.videos.slice(0, 2) : [''],
      });
    } else {
      setFormValues(EMPTY_FORM);
    }
  }, [initialValues]);

  const handleChange = <K extends keyof GemstoneFormValues>(field: K, value: GemstoneFormValues[K]) => {
    setFormValues((prev) => {
      const next: GemstoneFormValues = { ...prev, [field]: value } as GemstoneFormValues;
      if (field === 'type' && value === 'rough') {
        next.cut = '';
        next.cutForm = '';
      }
      return next;
    });
  };

  const updateDimension = (field: keyof GemstoneFormValues['dimensions'], value: string) => {
    setFormValues((prev) => ({
      ...prev,
      dimensions: { ...prev.dimensions, [field]: value },
    }));
  };

  const updateArrayValue = (field: 'images' | 'videos', index: number, value: string) => {
    setFormValues((prev) => {
      const items = [...prev[field]];
      items[index] = value;
      return { ...prev, [field]: items };
    });
  };

  const addArrayField = (field: 'images' | 'videos', max: number) => {
    setFormValues((prev) => {
      if (prev[field].length >= max) return prev;
      return { ...prev, [field]: [...prev[field], ''] };
    });
  };

  const removeArrayField = (field: 'images' | 'videos', index: number) => {
    setFormValues((prev) => {
      const items = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: items.length ? items : [''] };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };


  const weightLabel = formValues.type === 'cut' ? 'Gewicht (Karat)' : 'Gewicht (Gramm)';

  return (
    <div className="bg-gradient-to-b from-black via-black to-slate-950 text-white">
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
      <div className="px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">
            {formValues.id ? 'Edelstein bearbeiten' : 'Neuer Edelstein'}
          </h1>
          <p className="text-gray-300">
            {formValues.id ? 'Bearbeiten Sie die Eigenschaften des Edelsteins' : 'Fügen Sie einen neuen Edelstein zu Ihrer Kollektion hinzu'}
          </p>
        </div>

        {/* Form */}
        <div className="border-white/10 bg-gray-800/50/50 rounded-lg shadow-sm border p-6">
          <form id="gemstone-editor-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="gem-name" className="block text-sm font-medium text-gray-200 mb-2">
                  Name des Edelsteins *
                </label>
                <input
                  type="text"
                  id="gem-name"
                  value={formValues.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                  placeholder="z.B. Smaragd, Rubin, Diamant"
                />
              </div>

              {/* Karat/Gewicht */}
              <div>
                <label htmlFor="gem-weight" className="block text-sm font-medium text-gray-200 mb-2">
                  {weightLabel}
                </label>
                <input
                  type="number"
                  id="gem-weight"
                  value={formValues.weight}
                  onChange={(event) => handleChange('weight', event.target.value)}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                  placeholder="z.B. 2.5"
                />
              </div>
            </div>

            {/* Select Lists - Completely Separate from Grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Edelstein-Eigenschaften</h3>
              
              {/* Art */}
              <div className="flex flex-col">
                <label htmlFor="gem-type" className="block text-sm font-medium text-gray-200 mb-2">
                  Art *
                </label>
                <select
                  id="gem-type"
                  value={formValues.type}
                  onChange={(e) => handleChange('type', e.target.value as 'cut' | 'rough')}
                  required
                  className="w-1/4 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                >
                  <option value="cut">Geschliffen</option>
                  <option value="rough">Rohstein</option>
                </select>
              </div>

              {/* Edelsteinart */}
              <div className="flex flex-col">
                <label htmlFor="gemstoneType" className="block text-sm font-medium text-gray-200 mb-2">
                  Edelsteinart *
                </label>
                <select
                  id="gemstoneType"
                  value={formValues.gemstoneType}
                  onChange={(e) => handleChange('gemstoneType', e.target.value)}
                  required
                  className="w-1/4 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                >
                  <option value="">Edelsteinart wählen</option>
                  {GEMSTONE_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.value}</option>
                  ))}
                </select>
              </div>

              {/* Farbe */}
              <div className="flex flex-col">
                <label htmlFor="color" className="block text-sm font-medium text-gray-200 mb-2">
                  Farbe
                </label>
                <select
                  id="color"
                  value={formValues.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="w-1/4 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                >
                  <option value="">Farbe wählen</option>
                  {COLOR_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.value}</option>
                  ))}
                </select>
              </div>

              {/* Farbsättigung */}
              <div className="flex flex-col">
                <label htmlFor="colorSaturation" className="block text-sm font-medium text-gray-200 mb-2">
                  Farbsättigung
                </label>
                <select
                  id="colorSaturation"
                  value={formValues.colorSaturation}
                  onChange={(e) => handleChange('colorSaturation', e.target.value)}
                  className="w-1/4 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                >
                  <option value="">Farbsättigung wählen</option>
                  {SATURATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label || opt.value}</option>
                  ))}
                </select>
              </div>

              {/* Farbhelligkeit */}
              <div>
                <label htmlFor="color-brightness" className="block text-sm font-medium text-gray-200 mb-2">
                  Farbhelligkeit
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    id="color-brightness"
                    min="0"
                    max="10"
                    step="1"
                    value={formValues.colorBrightness}
                    onChange={(e) => handleChange('colorBrightness', parseInt(e.target.value))}
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
                    <span className="font-medium text-blue-600">{formValues.colorBrightness}</span>
                    <span>Schwarz (10)</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    Aktueller Wert: {formValues.colorBrightness} ({formValues.colorBrightness === 0 ? 'Weiß' : formValues.colorBrightness === 10 ? 'Schwarz' : `Stufe ${formValues.colorBrightness}`})
                  </div>
                </div>
              </div>

              {/* Schliff */}
              {formValues.type === 'cut' && (
                <>
                  <div className="flex flex-col">
                    <label htmlFor="cut" className="block text-sm font-medium text-gray-200 mb-2">
                      Schliff
                    </label>
                    <select
                      id="cut"
                      value={formValues.cut}
                      onChange={(e) => handleChange('cut', e.target.value)}
                      className="w-1/4 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                    >
                      <option value="">Schliff wählen</option>
                      {CUT_STYLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.value}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="cutForm" className="block text-sm font-medium text-gray-200 mb-2">
                      Schliffform
                    </label>
                    <select
                      id="cutForm"
                      value={formValues.cutForm}
                      onChange={(e) => handleChange('cutForm', e.target.value)}
                      className="w-1/4 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                    >
                      <option value="">Schliffform wählen</option>
                      {CUT_FORM_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.value}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Reinheit */}
              <div className="flex flex-col">
                <label htmlFor="clarity" className="block text-sm font-medium text-gray-200 mb-2">
                  Reinheit
                </label>
                <select
                  id="clarity"
                  value={formValues.clarity}
                  onChange={(e) => handleChange('clarity', e.target.value)}
                  className="w-1/4 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                >
                  <option value="">Reinheit wählen</option>
                  {CLARITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label || opt.value}</option>
                  ))}
                </select>
              </div>

              {/* Herkunft */}
              <div className="flex flex-col">
                <label htmlFor="origin" className="block text-sm font-medium text-gray-200 mb-2">
                  Herkunft
                </label>
                <select
                  id="origin"
                  value={formValues.origin}
                  onChange={(e) => handleChange('origin', e.target.value)}
                  className="w-1/4 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                >
                  <option value="">Herkunft wählen</option>
                  {ORIGIN_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.value}</option>
                  ))}
                </select>
              </div>

              {/* Zertifizierung */}
              <div className="flex flex-col">
                <label htmlFor="certification" className="block text-sm font-medium text-gray-200 mb-2">
                  Zertifizierung
                </label>
                <select
                  id="certification"
                  value={formValues.certification}
                  onChange={(e) => handleChange('certification', e.target.value)}
                  className="w-1/4 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                >
                  <option value="">Zertifizierung wählen</option>
                  {CERTIFICATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.value}</option>
                  ))}
                </select>
              </div>

              {/* Behandlung */}
              <div className="flex flex-col">
                <label htmlFor="treatment" className="block text-sm font-medium text-gray-200 mb-2">
                  Behandlung
                </label>
                <select
                  id="treatment"
                  value={formValues.treatment}
                  onChange={(e) => handleChange('treatment', e.target.value)}
                  className="w-1/4 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                >
                  <option value="">Behandlung wählen</option>
                  {TREATMENT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.value}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preis */}
              <div>
                <label htmlFor="gem-price" className="block text-sm font-medium text-gray-200 mb-2">
                  Preis (€)
                </label>
                <input
                  type="number"
                  id="gem-price"
                  value={formValues.price}
                  onChange={(event) => handleChange('price', event.target.value)}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                  placeholder="z.B. 1500.00"
                />
              </div>

              {/* Maße */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Maße (mm) - Länge × Breite × Höhe
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Länge"
                    value={formValues.dimensions.length}
                    onChange={(event) => updateDimension('length', event.target.value)}
                    className="px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Breite"
                    value={formValues.dimensions.width}
                    onChange={(event) => updateDimension('width', event.target.value)}
                    className="px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Höhe"
                    value={formValues.dimensions.height}
                    onChange={(event) => updateDimension('height', event.target.value)}
                    className="px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Beschreibung */}
            <div>
              <label htmlFor="gem-description" className="block text-sm font-medium text-gray-200 mb-2">
                Beschreibung
              </label>
              <textarea
                id="gem-description"
                value={formValues.description}
                onChange={(event) => handleChange('description', event.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                placeholder="Beschreiben Sie den Edelstein..."
              />
            </div>

            {/* Bilder Upload */}
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-200 mb-2">
                Bilder
              </label>
              <div className="space-y-2">
                {formValues.images.map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => updateArrayValue('images', index, e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                    />
                    {formValues.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('images', index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {formValues.images.length < 10 && (
                  <button
                    type="button"
                    onClick={() => addArrayField('images', 10)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    + Bild hinzufügen
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Sie können bis zu 10 Bilder als URLs eingeben
              </p>
            </div>

            {/* Videos Upload */}
            <div>
              <label htmlFor="videos" className="block text-sm font-medium text-gray-200 mb-2">
                Videos
              </label>
              <div className="space-y-2">
                {formValues.videos.map((video, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      value={video}
                      onChange={(e) => updateArrayValue('videos', index, e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white"
                    />
                    {formValues.videos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('videos', index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {formValues.videos.length < 2 && (
                  <button
                    type="button"
                    onClick={() => addArrayField('videos', 2)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    + Video hinzufügen
                  </button>
                )}
              </div>
            </div>

            {/* Status Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isNew"
                  checked={formValues.isNew}
                  onChange={(e) => handleChange('isNew', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isNew" className="text-sm font-medium text-gray-200">
                  Neu im Sortiment
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isSold"
                  checked={formValues.isSold}
                  onChange={(e) => handleChange('isSold', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isSold" className="text-sm font-medium text-gray-200">
                  Verkauft
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={!formValues.name || !formValues.gemstoneType}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formValues.id ? 'Änderungen speichern' : 'Edelstein speichern'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
