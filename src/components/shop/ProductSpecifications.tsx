'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductSpecificationsProps {
  product: Product;
  className?: string;
}

export default function ProductSpecifications({ product, className }: ProductSpecificationsProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>('specifications');

  const tabs = [
    { id: 'specifications', label: 'Spezifikationen' },
    { id: 'details', label: 'Details' },
    { id: 'certification', label: 'Zertifizierung' },
    { id: 'shipping', label: 'Versand' }
  ];

  const specifications = [
    { label: 'Karat', value: `${product.properties.carat} ct` },
    { label: 'Farbe', value: product.properties.color },
    { label: 'Klarheit', value: product.properties.clarity },
    { label: 'Schliff', value: product.properties.cut },
    { label: 'Herkunft', value: product.properties.origin },
    { label: 'Behandlung', value: product.properties.treatment },
    { label: 'Härte', value: `${product.properties.hardness} (Mohs-Skala)` },
    { label: 'Brechungsindex', value: product.properties.refractiveIndex.toString() },
    { label: 'Spezifisches Gewicht', value: product.properties.specificGravity.toString() },
    { label: 'Gewicht', value: `${product.weight} g` },
    { label: 'Abmessungen', value: `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} mm` }
  ];

  const renderSpecifications = (): JSX.Element => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {specifications.map((spec, index) => (
        <div key={index} className="flex justify-between py-2 border-b border-slate-700">
          <span className="text-slate-400">{spec.label}</span>
          <span className="text-white font-medium">{spec.value}</span>
        </div>
      ))}
    </div>
  );

  const renderDetails = (): JSX.Element => (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-semibold text-white mb-3">Beschreibung</h4>
        <p className="text-slate-300 leading-relaxed">
          {product.description}
        </p>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold text-white mb-3">Besondere Merkmale</h4>
        <ul className="space-y-2 text-slate-300">
          <li>• Handverlesen von unseren Experten</li>
          <li>• Professionell gereinigt und poliert</li>
          <li>• In hochwertiger Verpackung geliefert</li>
          <li>• Mit Echtheitszertifikat</li>
        </ul>
      </div>
    </div>
  );

  const renderCertification = (): JSX.Element => (
    <div className="space-y-4">
      {product.certification ? (
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Zertifizierungsdetails</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400">Zertifikat-Typ:</span>
              <span className="text-white ml-2">{product.certification.type}</span>
            </div>
            <div>
              <span className="text-slate-400">Zertifikat-Nummer:</span>
              <span className="text-white ml-2">{product.certification.number}</span>
            </div>
            <div>
              <span className="text-slate-400">Aussteller:</span>
              <span className="text-white ml-2">{product.certification.issuer}</span>
            </div>
            <div>
              <span className="text-slate-400">Ausstellungsdatum:</span>
              <span className="text-white ml-2">
                {new Date(product.certification.date).toLocaleDateString('de-DE')}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-400">Keine Zertifizierung verfügbar</p>
        </div>
      )}
    </div>
  );

  const renderShipping = (): JSX.Element => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Versandinformationen</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h5 className="font-medium text-white mb-2">Standardversand</h5>
            <p className="text-slate-300 text-sm mb-2">Kostenlos innerhalb Deutschlands</p>
            <p className="text-slate-400 text-xs">Lieferzeit: 2-3 Werktage</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h5 className="font-medium text-white mb-2">Expressversand</h5>
            <p className="text-slate-300 text-sm mb-2">€9.99 - Deutschland</p>
            <p className="text-slate-400 text-xs">Lieferzeit: 1-2 Werktage</p>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Rückgabe & Umtausch</h4>
        <div className="bg-slate-800/50 rounded-lg p-4">
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>• 30 Tage Rückgaberecht</li>
            <li>• Kostenlose Rücksendung</li>
            <li>• Originalverpackung erforderlich</li>
            <li>• Keine Beschädigungen</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderContent = (): JSX.Element => {
    switch (activeTab) {
      case 'specifications':
        return renderSpecifications();
      case 'details':
        return renderDetails();
      case 'certification':
        return renderCertification();
      case 'shipping':
        return renderShipping();
      default:
        return renderSpecifications();
    }
  };

  return (
    <div className={`bg-slate-800/30 rounded-lg ${className || ''}`}>
      {/* Tab Navigation */}
      <div className="border-b border-slate-700">
        <div className="flex flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
}
