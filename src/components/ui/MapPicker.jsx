import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ClickMarker = ({ value, onChange, readOnly }) => {
  useMapEvents({
    click(e) {
      if (!readOnly) onChange([e.latlng.lng, e.latlng.lat]);
    },
  });
  if (!value) return null;
  return <Marker position={[value[1], value[0]]} />;
};

const MapPicker = ({ value, onChange, readOnly = false }) => (
  <MapContainer center={[22.9734, 78.6569]} zoom={5} className="h-[350px] w-full rounded-xl">
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <ClickMarker value={value} onChange={onChange} readOnly={readOnly} />
  </MapContainer>
);

export default MapPicker;
