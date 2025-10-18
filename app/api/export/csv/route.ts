import { NextResponse } from "next/server";

type Point = { site: string; country: string; gem: string; lat: number; lon: number };

function toCSV(points: Point[]): string {
  const header = ["site", "country", "gem", "lat", "lon"];
  const escape = (s: string) => '"' + s.replaceAll('"', '""') + '"';
  const rows = points.map(p => [escape(p.site), escape(p.country), escape(p.gem), p.lat, p.lon].join(","));
  return header.join(",") + "\n" + rows.join("\n");
}

export async function POST(req: Request) {
  try {
    const { points } = await req.json();
    const csv = toCSV(points || []);
    
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=edelstein_lagerstaetten_${(points?.length) || 0}.csv`
      }
    });
  } catch (error) {
    console.error("CSV Export Error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
