export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen public-page-bg text-foreground">
      <div className="container py-12 md:py-20 flex justify-center">
        <div className="w-full max-w-6xl container-dark px-4">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 whitespace-nowrap">
              <span className="gradient-text animate-glow">Blog</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Entdecken Sie die faszinierende Welt der Edelsteine
            </p>
          </div>

          <div className="text-center py-12">
            <p className="text-muted-foreground">Blog-Funktionalität wird bald verfügbar sein.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
