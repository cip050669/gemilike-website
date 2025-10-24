export default function StaticHomePage() {
  return (
    <div className="min-h-screen bg-gray-800/50 text-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Gemilike - Heroes in Gems</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Ihr Spezialist für rohe und geschliffene Edelsteine
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Über uns</h2>
            <p className="text-muted-foreground">
              Entdecken Sie unsere exquisite Auswahl an Diamanten, Smaragden, Rubinen und weiteren Edelsteinen.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Kontakt</h2>
            <p className="text-muted-foreground">
              Kontaktieren Sie uns für eine persönliche Beratung und finden Sie den perfekten Edelstein.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

