'use client';

interface HeroSectionProps {
  settings: any;
}

export function HeroSection({ settings }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">
          {settings?.title || 'Gemilike - Heroes in Gems'}
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          {settings?.subtitle || 'Ihr Spezialist für rohe und geschliffene Edelsteine'}
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100">
          Entdecken Sie unsere Edelsteine
        </button>
      </div>
    </section>
  );
}
