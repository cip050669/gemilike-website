"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft, MapPin, Globe } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Dynamically import react-leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

// Kommerziell wichtige Edelstein-Lagerstätten weltweit
const COUNTRY_DATA = [
  // AFRIKA
  {
    country: "Südafrika",
    lat: -25.6703,
    lng: 28.5231,
    locationCount: 8,
    gemTypes: ["Diamond", "Emerald", "Garnet", "Tourmaline"],
    locations: [
      { name: "Cullinan Mine", lat: -25.6703, lng: 28.5231, gem: "Diamond" },
      { name: "Jwaneng Mine", lat: -24.5, lng: 24.7, gem: "Diamond" },
      { name: "Venetia Mine", lat: -22.4, lng: 29.3, gem: "Diamond" },
      { name: "Finsch Mine", lat: -28.2, lng: 23.1, gem: "Diamond" },
      { name: "Somerset West", lat: -34.1, lng: 18.8, gem: "Emerald" },
      { name: "Northern Cape", lat: -29.0, lng: 22.0, gem: "Garnet" },
      { name: "Kuruman", lat: -27.5, lng: 23.4, gem: "Tourmaline" },
      { name: "Steinkopf", lat: -29.3, lng: 17.7, gem: "Tourmaline" }
    ]
  },
  {
    country: "Botswana",
    lat: -22.0,
    lng: 24.0,
    locationCount: 6,
    gemTypes: ["Diamond"],
    locations: [
      { name: "Orapa Mine", lat: -21.3, lng: 25.4, gem: "Diamond" },
      { name: "Letlhakane Mine", lat: -21.4, lng: 25.6, gem: "Diamond" },
      { name: "Damtshaa Mine", lat: -21.2, lng: 25.3, gem: "Diamond" },
      { name: "Karowe Mine", lat: -20.5, lng: 25.8, gem: "Diamond" },
      { name: "Lerala Mine", lat: -22.8, lng: 27.5, gem: "Diamond" },
      { name: "Ghaghoo Mine", lat: -21.0, lng: 24.0, gem: "Diamond" }
    ]
  },
  {
    country: "Namibia",
    lat: -22.0,
    lng: 17.0,
    locationCount: 4,
    gemTypes: ["Diamond", "Tourmaline"],
    locations: [
      { name: "Oranjemund", lat: -28.6, lng: 16.4, gem: "Diamond" },
      { name: "Elizabeth Bay", lat: -26.9, lng: 15.2, gem: "Diamond" },
      { name: "Pomona", lat: -26.0, lng: 15.0, gem: "Diamond" },
      { name: "Kunene Region", lat: -17.0, lng: 13.0, gem: "Tourmaline" }
    ]
  },
  {
    country: "Tansania",
    lat: -6.0,
    lng: 35.0,
    locationCount: 7,
    gemTypes: ["Tanzanite", "Ruby", "Sapphire", "Emerald"],
    locations: [
      { name: "Merelani Hills", lat: -3.5, lng: 35.75, gem: "Tanzanite" },
      { name: "Winza", lat: -4.5, lng: 33.0, gem: "Ruby" },
      { name: "Songea", lat: -10.7, lng: 35.7, gem: "Ruby" },
      { name: "Longido", lat: -2.7, lng: 36.7, gem: "Ruby" },
      { name: "Umba Valley", lat: -4.8, lng: 38.2, gem: "Sapphire" },
      { name: "Taita Hills", lat: -3.4, lng: 38.3, gem: "Ruby" },
      { name: "Manyara", lat: -3.5, lng: 35.5, gem: "Emerald" }
    ]
  },
  {
    country: "Kenia",
    lat: 1.0,
    lng: 38.0,
    locationCount: 3,
    gemTypes: ["Ruby", "Sapphire", "Garnet"],
    locations: [
      { name: "Tsavo", lat: -2.5, lng: 38.0, gem: "Ruby" },
      { name: "Taita Hills", lat: -3.4, lng: 38.3, gem: "Sapphire" },
      { name: "Kitui", lat: -1.4, lng: 38.0, gem: "Garnet" }
    ]
  },
  {
    country: "Uganda",
    lat: 1.0,
    lng: 32.0,
    locationCount: 2,
    gemTypes: ["Emerald", "Garnet"],
    locations: [
      { name: "Karamoja", lat: 2.0, lng: 34.0, gem: "Emerald" },
      { name: "Kampala Region", lat: 0.3, lng: 32.6, gem: "Garnet" }
    ]
  },
  {
    country: "Madagaskar",
    lat: -20.0,
    lng: 47.0,
    locationCount: 6,
    gemTypes: ["Sapphire", "Ruby", "Emerald", "Tourmaline"],
    locations: [
      { name: "Ilakaka", lat: -22.5, lng: 45.0, gem: "Sapphire" },
      { name: "Andranondambo", lat: -22.3, lng: 45.2, gem: "Sapphire" },
      { name: "Bemainty", lat: -22.4, lng: 45.1, gem: "Ruby" },
      { name: "Didy", lat: -18.2, lng: 48.3, gem: "Emerald" },
      { name: "Anjanabonoina", lat: -18.5, lng: 48.0, gem: "Tourmaline" },
      { name: "Antsirabe", lat: -19.9, lng: 47.0, gem: "Tourmaline" }
    ]
  },
  {
    country: "Mosambik",
    lat: -18.0,
    lng: 35.0,
    locationCount: 3,
    gemTypes: ["Ruby", "Tourmaline"],
    locations: [
      { name: "Montepuez", lat: -13.0, lng: 39.0, gem: "Ruby" },
      { name: "Niassa", lat: -12.8, lng: 37.0, gem: "Ruby" },
      { name: "Alto Ligonha", lat: -15.0, lng: 37.0, gem: "Tourmaline" }
    ]
  },
  {
    country: "Sambia",
    lat: -15.0,
    lng: 30.0,
    locationCount: 2,
    gemTypes: ["Emerald"],
    locations: [
      { name: "Kagem Mine", lat: -12.5, lng: 28.0, gem: "Emerald" },
      { name: "Grizzly Mine", lat: -12.3, lng: 28.2, gem: "Emerald" }
    ]
  },

  // ASIEN
  {
    country: "Myanmar",
    lat: 22.0,
    lng: 96.0,
    locationCount: 8,
    gemTypes: ["Ruby", "Sapphire", "Spinel", "Jade"],
    locations: [
      { name: "Mogok Valley", lat: 22.9167, lng: 96.5167, gem: "Ruby" },
      { name: "Mong Hsu", lat: 20.8, lng: 99.4, gem: "Ruby" },
      { name: "Namya", lat: 25.4, lng: 97.0, gem: "Ruby" },
      { name: "Sapphire Valley", lat: 22.0, lng: 96.0, gem: "Sapphire" },
      { name: "Kachin State", lat: 25.0, lng: 97.0, gem: "Jade" },
      { name: "Hpakant", lat: 25.3, lng: 96.3, gem: "Jade" },
      { name: "Momeik", lat: 22.5, lng: 96.8, gem: "Spinel" },
      { name: "Bernardmyo", lat: 22.8, lng: 96.6, gem: "Spinel" }
    ]
  },
  {
    country: "Thailand",
    lat: 15.0,
    lng: 101.0,
    locationCount: 4,
    gemTypes: ["Ruby", "Sapphire"],
    locations: [
      { name: "Bangkok", lat: 13.8, lng: 100.5, gem: "Ruby" },
      { name: "Chanthaburi", lat: 12.6, lng: 102.1, gem: "Sapphire" },
      { name: "Kanchanaburi", lat: 14.0, lng: 99.5, gem: "Ruby" },
      { name: "Trat", lat: 12.2, lng: 102.5, gem: "Sapphire" }
    ]
  },
  {
    country: "Sri Lanka",
    lat: 7.0,
    lng: 81.0,
    locationCount: 5,
    gemTypes: ["Sapphire", "Ruby", "Spinel", "Zircon"],
    locations: [
      { name: "Ratnapura", lat: 6.7, lng: 80.4, gem: "Sapphire" },
      { name: "Elahera", lat: 7.2, lng: 80.8, gem: "Sapphire" },
      { name: "Balangoda", lat: 6.7, lng: 80.7, gem: "Ruby" },
      { name: "Kataragama", lat: 6.4, lng: 81.3, gem: "Spinel" },
      { name: "Hambantota", lat: 6.1, lng: 81.1, gem: "Zircon" }
    ]
  },
  {
    country: "Indien",
    lat: 20.0,
    lng: 77.0,
    locationCount: 12,
    gemTypes: ["Diamond", "Emerald", "Garnet", "Sapphire"],
    locations: [
      { name: "Panna", lat: 24.7, lng: 80.2, gem: "Diamond" },
      { name: "Bunder", lat: 24.5, lng: 80.0, gem: "Diamond" },
      { name: "Jaipur", lat: 26.9, lng: 75.8, gem: "Emerald" },
      { name: "Udaipur", lat: 24.6, lng: 73.7, gem: "Emerald" },
      { name: "Rajasthan", lat: 27.0, lng: 73.0, gem: "Emerald" },
      { name: "Orissa", lat: 20.2, lng: 85.8, gem: "Garnet" },
      { name: "Tamil Nadu", lat: 11.0, lng: 78.0, gem: "Garnet" },
      { name: "Jharkhand", lat: 23.0, lng: 85.0, gem: "Garnet" },
      { name: "Kashmir", lat: 34.0, lng: 76.0, gem: "Sapphire" },
      { name: "Andhra Pradesh", lat: 15.8, lng: 78.0, gem: "Diamond" },
      { name: "Madhya Pradesh", lat: 22.0, lng: 78.0, gem: "Diamond" },
      { name: "Karnataka", lat: 15.0, lng: 76.0, gem: "Diamond" }
    ]
  },
  {
    country: "Vietnam",
    lat: 16.0,
    lng: 108.0,
    locationCount: 6,
    gemTypes: ["Ruby", "Sapphire", "Spinel"],
    locations: [
      { name: "Luc Yen", lat: 21.8, lng: 105.0, gem: "Ruby" },
      { name: "Yen Bai", lat: 21.7, lng: 104.9, gem: "Ruby" },
      { name: "Quy Chau", lat: 19.0, lng: 105.0, gem: "Ruby" },
      { name: "Binh Thuan", lat: 10.9, lng: 108.1, gem: "Sapphire" },
      { name: "Dak Lak", lat: 12.7, lng: 108.0, gem: "Sapphire" },
      { name: "Gia Lai", lat: 13.8, lng: 108.1, gem: "Spinel" }
    ]
  },
  {
    country: "Kambodscha",
    lat: 13.0,
    lng: 105.0,
    locationCount: 2,
    gemTypes: ["Ruby", "Zircon"],
    locations: [
      { name: "Pailin", lat: 12.9, lng: 102.6, gem: "Ruby" },
      { name: "Ratanakiri", lat: 13.5, lng: 107.0, gem: "Zircon" }
    ]
  },
  {
    country: "Indonesien",
    lat: -5.0,
    lng: 120.0,
    locationCount: 4,
    gemTypes: ["Diamond", "Ruby", "Sapphire"],
    locations: [
      { name: "Borneo", lat: -0.5, lng: 114.0, gem: "Diamond" },
      { name: "Sumatra", lat: -0.5, lng: 101.0, gem: "Ruby" },
      { name: "Java", lat: -7.5, lng: 110.0, gem: "Sapphire" },
      { name: "Sulawesi", lat: -2.0, lng: 120.0, gem: "Ruby" }
    ]
  },
  {
    country: "Philippinen",
    lat: 13.0,
    lng: 122.0,
    locationCount: 3,
    gemTypes: ["Jade", "Ruby", "Pearl"],
    locations: [
      { name: "Luzon", lat: 15.0, lng: 121.0, gem: "Jade" },
      { name: "Mindanao", lat: 8.0, lng: 125.0, gem: "Ruby" },
      { name: "Palawan", lat: 10.0, lng: 119.0, gem: "Pearl" }
    ]
  },

  // AMERIKA
  {
    country: "Kolumbien",
    lat: 4.0,
    lng: -74.0,
    locationCount: 6,
    gemTypes: ["Emerald"],
    locations: [
      { name: "Muzo", lat: 5.5353, lng: -73.3678, gem: "Emerald" },
      { name: "Chivor", lat: 4.9, lng: -73.3, gem: "Emerald" },
      { name: "Coscuez", lat: 5.7, lng: -73.2, gem: "Emerald" },
      { name: "Gachala", lat: 4.7, lng: -73.5, gem: "Emerald" },
      { name: "La Pita", lat: 5.6, lng: -73.1, gem: "Emerald" },
      { name: "La Pava", lat: 5.4, lng: -73.4, gem: "Emerald" }
    ]
  },
  {
    country: "Brasilien",
    lat: -14.0,
    lng: -51.0,
    locationCount: 12,
    gemTypes: ["Emerald", "Tourmaline", "Aquamarine", "Topaz", "Alexandrite"],
    locations: [
      { name: "Minas Gerais", lat: -20.0, lng: -44.0, gem: "Emerald" },
      { name: "Bahia", lat: -12.0, lng: -42.0, gem: "Emerald" },
      { name: "Paraíba", lat: -7.0, lng: -35.0, gem: "Tourmaline" },
      { name: "Governador Valadares", lat: -18.9, lng: -41.9, gem: "Tourmaline" },
      { name: "Teofilo Otoni", lat: -17.9, lng: -41.5, gem: "Aquamarine" },
      { name: "Ouro Preto", lat: -20.4, lng: -43.5, gem: "Topaz" },
      { name: "Hematita", lat: -19.0, lng: -43.0, gem: "Alexandrite" },
      { name: "Santa Maria", lat: -19.5, lng: -43.0, gem: "Emerald" },
      { name: "Itabira", lat: -19.6, lng: -43.2, gem: "Emerald" },
      { name: "Nova Era", lat: -19.7, lng: -43.0, gem: "Emerald" },
      { name: "Capoeirana", lat: -19.8, lng: -42.8, gem: "Emerald" },
      { name: "Belo Horizonte", lat: -19.9, lng: -43.9, gem: "Emerald" }
    ]
  },
  {
    country: "USA",
    lat: 39.0,
    lng: -98.0,
    locationCount: 8,
    gemTypes: ["Diamond", "Sapphire", "Opal", "Tourmaline", "Topaz"],
    locations: [
      { name: "Crater of Diamonds", lat: 34.0, lng: -93.0, gem: "Diamond" },
      { name: "Yogo Gulch", lat: 47.0, lng: -110.0, gem: "Sapphire" },
      { name: "Montana Sapphire", lat: 45.0, lng: -111.0, gem: "Sapphire" },
      { name: "Virgin Valley", lat: 41.0, lng: -118.0, gem: "Opal" },
      { name: "Maine", lat: 44.0, lng: -70.0, gem: "Tourmaline" },
      { name: "California", lat: 35.0, lng: -120.0, gem: "Tourmaline" },
      { name: "Utah", lat: 39.0, lng: -111.0, gem: "Topaz" },
      { name: "Texas", lat: 31.0, lng: -100.0, gem: "Topaz" }
    ]
  },
  {
    country: "Kanada",
    lat: 60.0,
    lng: -95.0,
    locationCount: 3,
    gemTypes: ["Diamond", "Jade"],
    locations: [
      { name: "Diavik Mine", lat: 64.5, lng: -110.3, gem: "Diamond" },
      { name: "Ekati Mine", lat: 64.7, lng: -110.6, gem: "Diamond" },
      { name: "British Columbia", lat: 54.0, lng: -125.0, gem: "Jade" }
    ]
  },
  {
    country: "Australien",
    lat: -25.0,
    lng: 135.0,
    locationCount: 8,
    gemTypes: ["Opal", "Sapphire", "Diamond", "Garnet"],
    locations: [
      { name: "Coober Pedy", lat: -29.0, lng: 134.7, gem: "Opal" },
      { name: "Lightning Ridge", lat: -29.4, lng: 147.9, gem: "Opal" },
      { name: "Andamooka", lat: -30.4, lng: 137.2, gem: "Opal" },
      { name: "White Cliffs", lat: -32.3, lng: 143.0, gem: "Opal" },
      { name: "Rubyvale", lat: -23.4, lng: 147.7, gem: "Sapphire" },
      { name: "Anakie", lat: -23.0, lng: 147.0, gem: "Sapphire" },
      { name: "Argyle Mine", lat: -16.7, lng: 128.4, gem: "Diamond" },
      { name: "Harts Range", lat: -23.0, lng: 134.0, gem: "Garnet" }
    ]
  },

  // EUROPA
  {
    country: "Russland",
    lat: 60.0,
    lng: 100.0,
    locationCount: 4,
    gemTypes: ["Diamond", "Alexandrite", "Demantoid", "Uvarovite"],
    locations: [
      { name: "Mir Mine", lat: 62.5, lng: 113.0, gem: "Diamond" },
      { name: "Ural Mountains", lat: 60.0, lng: 60.0, gem: "Alexandrite" },
      { name: "Ural Demantoid", lat: 58.0, lng: 60.0, gem: "Demantoid" },
      { name: "Ural Uvarovite", lat: 59.0, lng: 61.0, gem: "Uvarovite" }
    ]
  },
  {
    country: "Tschechien",
    lat: 49.0,
    lng: 15.0,
    locationCount: 2,
    gemTypes: ["Garnet"],
    locations: [
      { name: "Bohemia", lat: 50.0, lng: 14.0, gem: "Garnet" },
      { name: "Turnov", lat: 50.6, lng: 15.2, gem: "Garnet" }
    ]
  },

  // NAHER OSTEN
  {
    country: "Ägypten",
    lat: 26.0,
    lng: 30.0,
    locationCount: 2,
    gemTypes: ["Peridot"],
    locations: [
      { name: "Zabargad Island", lat: 23.5, lng: 36.0, gem: "Peridot" },
      { name: "Red Sea", lat: 25.0, lng: 35.0, gem: "Peridot" }
    ]
  },
  {
    country: "Tadschikistan",
    lat: 39.0,
    lng: 71.0,
    locationCount: 2,
    gemTypes: ["Spinel"],
    locations: [
      { name: "Kuh-i-Lal", lat: 37.5, lng: 71.5, gem: "Spinel" },
      { name: "Pamir Mountains", lat: 38.0, lng: 72.0, gem: "Spinel" }
    ]
  }
];

// Gemstone colors - erweiterte Palette für alle Edelstein-Typen
const GEM_COLORS: Record<string, string> = {
  // Hauptedelsteine
  Ruby: "#ef4444",
  Sapphire: "#3b82f6", 
  Emerald: "#10b981",
  Diamond: "#6b7280",
  
  // Seltene Edelsteine
  Tanzanite: "#6366f1",
  Alexandrite: "#14b8a6",
  Demantoid: "#059669",
  Uvarovite: "#65a30d",
  
  // Farbige Edelsteine
  Opal: "#f59e0b",
  Tourmaline: "#ec4899",
  Garnet: "#b91c1c",
  Spinel: "#a78bfa",
  Zircon: "#0ea5e9",
  Peridot: "#65a30d",
  Aquamarine: "#22d3ee",
  Topaz: "#f97316",
  Jade: "#059669",
  
  // Organische Edelsteine
  Pearl: "#f3f4f6"
};

export default function WorldMap() {
  const [viewMode, setViewMode] = useState<"countries" | "locations">("countries");
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!searchTerm.trim()) return COUNTRY_DATA;
    return COUNTRY_DATA.filter(country => 
      country.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Filter locations based on search
  const filteredLocations = useMemo(() => {
    if (!selectedCountry) return [];
    if (!searchTerm.trim()) return selectedCountry.locations;
    return selectedCountry.locations.filter((location: any) => 
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.gem.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [selectedCountry, searchTerm]);

  const selectCountry = (country: any) => {
    console.log("Selecting country:", country.country);
    setSelectedCountry(country);
    setViewMode("locations");
    setSearchTerm("");
  };

  const backToCountries = () => {
    setSelectedCountry(null);
    setViewMode("countries");
    setSearchTerm("");
  };

  // Create country marker icon
  const createCountryIcon = (count: number) => {
    const size = Math.min(50, Math.max(30, 20 + Math.log(count) * 8));
    return L.divIcon({
      className: "country-marker",
      html: `<div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        color: white;
        font-weight: bold;
        font-size: ${Math.max(12, size * 0.3)}px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3), 0 0 0 3px #fff;
      ">${count}</div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  // Create gemstone marker icon
  const createGemIcon = (gem: string) => {
    const color = GEM_COLORS[gem] || "#333";
    return L.divIcon({
      className: "gem-marker",
      html: `<div style="
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: ${color};
        box-shadow: 0 0 0 2px #fff, 0 0 0 3px rgba(0,0,0,0.2);
      "></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      {viewMode === "locations" && selectedCountry && (
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
          <button
            onClick={backToCountries}
            className="flex items-center gap-2 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 px-4 py-2 text-sm font-medium shadow-sm border border-gray-200 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zur Länderübersicht
          </button>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800">{selectedCountry.country}</h3>
            <p className="text-sm text-gray-600">
              {selectedCountry.locationCount} Lagerstätten • {selectedCountry.gemTypes.length} Edelstein-Typen
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder={viewMode === "countries" ? "Suche nach Land..." : "Suche nach Lagerstätte..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded-2xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Map */}
      <div className="relative h-[70vh] w-full overflow-hidden rounded-2xl shadow">
        <MapContainer
          center={[10, 10]}
          zoom={2}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {viewMode === "countries" ? (
            // Länder-Ansicht
            <>
              {filteredCountries.map((country, index) => (
                <Marker
                  key={`country-${index}`}
                  position={[country.lat, country.lng]}
                  icon={createCountryIcon(country.locationCount)}
                  eventHandlers={{
                    click: () => selectCountry(country)
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <div className="font-bold text-base mb-2">{country.country}</div>
                      <div className="text-gray-600 mb-1">
                        <span className="font-semibold">{country.locationCount}</span> Lagerstätten
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {country.gemTypes.map((gem, idx) => (
                          <span key={idx} className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[11px]">
                            {gem}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 w-full text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                        Klicken Sie auf den Marker, um Lagerstätten anzuzeigen
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </>
          ) : (
            // Lagerstätten-Ansicht
            <>
              {filteredLocations.map((location: any, index: number) => (
                <Marker
                  key={`location-${index}`}
                  position={[location.lat, location.lng]}
                  icon={createGemIcon(location.gem)}
                >
                  <Popup>
                    <div className="text-sm">
                      <div className="font-semibold">{location.name}</div>
                      <div className="opacity-80">{selectedCountry?.country}</div>
                      <div className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[11px]">
                        {location.gem}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </>
          )}
        </MapContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-2 rounded-2xl bg-muted/50 p-3 text-sm md:grid-cols-2">
        <div>
          {viewMode === "countries" ? (
            <>
              <span className="font-semibold text-foreground">Länder:</span> <span className="text-foreground">{filteredCountries.length}</span> von <span className="text-foreground">{COUNTRY_DATA.length}</span>
              <span className="mx-2 opacity-50">•</span>
              <span className="font-semibold text-foreground">Gesamt:</span> <span className="text-foreground">{COUNTRY_DATA.reduce((sum, c) => sum + c.locationCount, 0)}</span> Lagerstätten
            </>
          ) : (
            <>
              <span className="font-semibold text-foreground">Lagerstätten:</span> <span className="text-foreground">{filteredLocations.length}</span>
              {selectedCountry && <span className="text-foreground"> in {selectedCountry.country}</span>}
            </>
          )}
        </div>
        <div className="text-muted-foreground">
          {viewMode === "countries" 
            ? "Klicken Sie auf ein Land, um die Lagerstätten anzuzeigen." 
            : "Detaillierte Ansicht der Lagerstätten im ausgewählten Land."
          }
        </div>
      </div>
    </div>
  );
}
