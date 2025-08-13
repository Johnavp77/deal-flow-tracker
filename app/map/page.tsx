'use client';

import { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const containerStyle = {
  width: '100%',
  height: '80vh',
};

export default function MapPage() {
  const supabase = createClientComponentClient();
  const [deals, setDeals] = useState<any[]>([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  useEffect(() => {
    const fetchDeals = async () => {
      const { data } = await supabase
        .from('deals')
        .select('id, name, latitude, longitude')
        .limit(100);
      setDeals(data || []);
    };
    fetchDeals();
  }, []);

  if (!isLoaded) return <p className="p-6">Loading map…</p>;

  const defaultCenter = deals.length
    ? { lat: deals[0].latitude, lng: deals[0].longitude }
    : { lat: 39.5, lng: -98.35 }; // USA centroid fallback

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Deal Locations</h1>
      <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={4}>
        {deals.map((deal) => (
          <Marker
            key={deal.id}
            position={{ lat: deal.latitude, lng: deal.longitude }}
            title={deal.name}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
