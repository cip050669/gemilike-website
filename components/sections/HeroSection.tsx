'use client';

interface HeroSectionProps {
  settings: any;
}

export function HeroSection({ settings }: HeroSectionProps) {
  return (
    <section className="bg-gem-energy text-gem-text py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">
          {settings?.title || 'Gemilike - Heroes in Gems'}
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          {settings?.subtitle || 'Ihr Spezialist für rohe und geschliffene Edelsteine'}
        </p>
        <button className="bg-gem-fire text-gem-bgDark px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gem-fireLight hover:text-gem-bgDark transition-colors">
          Entdecken Sie unsere Edelsteine
        </button>
      </div>
    </section>
  );
}
