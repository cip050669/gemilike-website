export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <div className="w-64 bg-gray-900 text-white min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold">Edelstein-Verwaltung</h2>
          </div>
          <nav className="mt-6">
            <a href="/admin" className="flex items-center px-6 py-3 hover:bg-gray-800">
              <span className="mr-3">📊</span>
              Dashboard
            </a>
            <a href="/admin/gemstones" className="flex items-center px-6 py-3 hover:bg-gray-800">
              <span className="mr-3">💎</span>
              Edelsteine
            </a>
            <a href="/admin/about" className="flex items-center px-6 py-3 hover:bg-gray-800">
              <span className="mr-3">📝</span>
              Über uns
            </a>
            <a href="/admin/settings" className="flex items-center px-6 py-3 hover:bg-gray-800">
              <span className="mr-3">⚙️</span>
              Einstellungen
            </a>
          </nav>
        </div>
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
