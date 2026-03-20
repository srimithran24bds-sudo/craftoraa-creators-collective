import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Seller {
  name: string;
  location: string;
  lat: number;
  lng: number;
}

// Known seller coordinates mapped by name
const sellerCoordinates: Record<string, { lat: number; lng: number }> = {
  "Priya Crafts Studio": { lat: 13.0524, lng: 80.2508 },
  "CraftNest Workshop": { lat: 13.0674, lng: 80.2376 },
  "Priya Crafts": { lat: 13.0524, lng: 80.2508 },
  "CraftNest": { lat: 13.0674, lng: 80.2376 },
  "ArtByMeera": { lat: 13.0412, lng: 80.2338 },
  "KeepSakeArt": { lat: 13.0827, lng: 80.2707 },
  "StarResin": { lat: 13.0358, lng: 80.2468 },
  "MittiCraft Pottery": { lat: 11.9416, lng: 79.8083 },
  "MittiCraft": { lat: 13.0285, lng: 80.2522 },
  "WoodCraft Studio": { lat: 12.6269, lng: 80.1927 },
  "WoodCraft": { lat: 12.6269, lng: 80.1927 },
  "GreenCraft Hub": { lat: 13.0478, lng: 80.2190 },
  "EarthTones": { lat: 13.0500, lng: 80.2121 },
  "LightCraft": { lat: 13.0611, lng: 80.2209 },
  "KnottyVibes": { lat: 13.0342, lng: 80.2604 },
  "Kanchipuram Weavers Co-op": { lat: 12.8342, lng: 79.7036 },
  "LoomArt Handlooms": { lat: 11.6643, lng: 78.1460 },
  "ThreadWorks Artisans": { lat: 9.9252, lng: 78.1198 },
  "KhadiCraft Collective": { lat: 11.0168, lng: 76.9558 },
  "WrapJoy Studio": { lat: 13.0560, lng: 80.2580 },
  "PaperLove Crafts": { lat: 13.0430, lng: 80.2330 },
  "PrintHouse Custom": { lat: 13.0600, lng: 80.2400 },
  "TinyGifts Studio": { lat: 13.0480, lng: 80.2550 },
  "CardCraft Workshop": { lat: 13.0700, lng: 80.2200 },
  "WeaveArt": { lat: 13.0450, lng: 80.2350 },
};

// Default center: Chennai
const DEFAULT_CENTER = { lat: 13.0827, lng: 80.2707 };

interface NearbySellerMapProps {
  category: string;
  selectedSeller?: string;
}

const NearbySellerMap = ({ category, selectedSeller }: NearbySellerMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Get sellers for the category from the known coordinates
  const sellers: Seller[] = Object.entries(sellerCoordinates)
    .map(([name, coords]) => ({
      name,
      location: "",
      lat: coords.lat,
      lng: coords.lng,
    }));

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(
      [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng],
      11
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      maxZoom: 18,
    }).addTo(map);

    // Custom icon
    const defaultIcon = L.divIcon({
      html: `<div style="background:#f97316;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
      className: "",
      iconSize: [28, 28],
      iconAnchor: [14, 28],
    });

    const selectedIcon = L.divIcon({
      html: `<div style="background:#16a34a;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.4)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
      className: "",
      iconSize: [34, 34],
      iconAnchor: [17, 34],
    });

    const bounds: [number, number][] = [];

    sellers.forEach((seller) => {
      const isSelected = selectedSeller === seller.name;
      const marker = L.marker([seller.lat, seller.lng], {
        icon: isSelected ? selectedIcon : defaultIcon,
        zIndexOffset: isSelected ? 1000 : 0,
      }).addTo(map);

      marker.bindPopup(
        `<div style="font-size:13px;font-weight:600">${seller.name}</div>`,
        { closeButton: false }
      );

      if (isSelected) marker.openPopup();
      bounds.push([seller.lat, seller.lng]);
    });

    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [selectedSeller]);

  return (
    <div className="craft-card overflow-hidden">
      <div className="p-3 flex items-center gap-2 border-b border-border">
        <MapPin className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-display font-semibold text-foreground">Nearby Sellers</h3>
      </div>
      <div ref={mapRef} className="w-full h-48" style={{ zIndex: 0 }} />
    </div>
  );
};

export default NearbySellerMap;
