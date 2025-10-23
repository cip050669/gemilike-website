export default function GemstonesManagementPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl space-y-6 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-lg shadow-black/30">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-white/40">Inventar</p>
            <h1 className="text-3xl font-bold text-white">Edelsteine verwalten</h1>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">
            Die Edelsteinverwaltung wurde vorübergehend deaktiviert. Der Menüpunkt bleibt bestehen,
            damit Sie sich später schnell wieder zurechtfinden – das neue Verwaltungserlebnis wird
            derzeit vorbereitet. Sobald die Arbeiten abgeschlossen sind, können Sie hier wieder
            Edelsteine anlegen, bearbeiten und verwalten.
          </p>
          <div className="rounded-2xl border border-dashed border-white/20 bg-black/40 p-6 text-sm text-white/50">
            <p className="font-medium text-white">Aktueller Status</p>
            <p>• Verwaltung wird neu aufgebaut</p>
            <p>• Bestehende Daten bleiben unverändert</p>
            <p>• Menüeintrag bleibt sichtbar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
