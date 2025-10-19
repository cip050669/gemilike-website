import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Truck } from 'lucide-react';

interface FeatureProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
}

const features: FeatureProps[] = [
  {
    icon: Sparkles,
    title: 'Höchste Qualität',
    description: 'Jeder Edelstein wird von Experten handverlesen und zertifiziert, um höchste Qualität zu gewährleisten.',
    color: 'text-blue-400'
  },
  {
    icon: Shield,
    title: 'Sichere Zahlung',
    description: 'Wir bieten SSL-verschlüsselte und sichere Zahlungsabwicklung für ein sorgenfreies Einkaufserlebnis.',
    color: 'text-green-400'
  },
  {
    icon: Truck,
    title: 'Schnelle Lieferung',
    description: 'Profitieren Sie von schnellem und kostenlosem Versand innerhalb Deutschlands für alle Bestellungen.',
    color: 'text-purple-400'
  }
];

export default function HomePage(): React.JSX.Element {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative flex items-center justify-center overflow-hidden py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" 
        style={{ minHeight: 'calc(100vh - 8rem)' }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.05),transparent_50%)]"></div>

        {/* Subtle Logo Background */}
        <div className="absolute inset-0 opacity-5">
          <Image
            src="/fulllogo_transparent_nobuffer.png"
            alt="Gemilike Logo Background"
            fill
            style={{ objectFit: 'contain' }}
            className="animate-pulse"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center container-responsive max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display mb-6 gemilike-text-gradient">
            Exklusive Edelsteine
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-body text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Handverlesene Edelsteine von höchster Qualität aus aller Welt. Entdecken Sie die Schönheit der Natur in ihrer reinsten Form.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
            <Link
              href="/de/shop"
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-subheading transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              Jetzt entdecken
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <Link
              href="/de/about"
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 border border-slate-600 hover:border-slate-500 text-white rounded-lg font-subheading transition-all duration-300 text-sm sm:text-base"
            >
              Mehr erfahren
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding container-responsive">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-center mb-12 md:mb-16 gemilike-text-gradient">
            Warum Gemilike?
          </h2>
          <div className="grid-responsive">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center p-6 sm:p-8 bg-slate-700/80 rounded-lg backdrop-blur-sm shadow-xl border border-slate-600/50 hover:bg-slate-700/90 transition-all duration-300"
              >
                <feature.icon className={`h-12 w-12 sm:h-16 sm:w-16 ${feature.color} mx-auto mb-4 sm:mb-6`} />
                <h3 className="text-lg sm:text-xl md:text-2xl font-subheading mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-300 font-body text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
