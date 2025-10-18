import { NextResponse } from "next/server";

type Point = { site: string; country: string; gem: string; lat: number; lon: number };

function toGeoJSON(points: Point[]) {
  return {
    type: "FeatureCollection",
    features: (points || []).map(p => ({
      type: "Feature",
      properties: { site: p.site, country: p.country, gem: p.gem },
      geometry: { type: "Point", coordinates: [p.lon, p.lat] }
    }))
  };
}

export async function POST(req: Request) {
  try {
    const { points } = await req.json();
    const gj = JSON.stringify(toGeoJSON(points || []), null, 2);
    
    return new NextResponse(gj, {
      headers: {
        "Content-Type": "application/geo+json; charset=utf-8",
        "Content-Disposition": `attachment; filename=edelstein_lagerstaetten_${(points?.length) || 0}.geojson`
      }
    });
  } catch (error) {
    console.error("GeoJSON Export Error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
