import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Spinner, Alert } from 'react-bootstrap';

// Configure default marker icons
const configureLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

configureLeafletIcons();

// Threat level configuration
const THREAT_LEVELS = {
  high: {
    icon: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    color: 'red',
    label: 'High Threat'
  },
  medium: {
    icon: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    color: 'orange',
    label: 'Medium Threat'
  },
  low: {
    icon: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
    color: 'yellow',
    label: 'Low Threat'
  }
};

const createCustomIcon = (threatLevel) => {
  return new L.Icon({
    iconUrl: THREAT_LEVELS[threatLevel]?.icon || THREAT_LEVELS.low.icon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

export default function FlaggedAreas() {
  const [flaggedAreas, setFlaggedAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([-1.2684, 36.7965]); // Default center (Nairobi coordinates)
  const [rawResponse, setRawResponse] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  // Using Vite's environment variables
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const fetchFlaggedAreas = async () => {
    try {
      setLoading(true);
      setError(null);
      setRawResponse('');

      const endpoint = `${API_BASE_URL}/api/emergencies/flagged-areas/`;
      console.log('Fetching from:', endpoint);

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      const contentType = response.headers.get('content-type');
      const responseText = await response.text();
      setRawResponse(responseText);

      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON but got ${contentType}. Response start: ${responseText.substring(0, 100)}...`);
      }

      const data = JSON.parse(responseText);
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      // Handle nested paginated response structure
      let areas = [];
      if (data.results?.results) {
        // Case: { results: { results: [...] } }
        areas = data.results.results;
      } else if (Array.isArray(data.results)) {
        // Case: { results: [...] }
        areas = data.results;
      } else if (Array.isArray(data)) {
        // Case: [...]
        areas = data;
      }

      if (!Array.isArray(areas)) {
        throw new Error(`Invalid data format. Expected array but got: ${JSON.stringify(data)}`);
      }

      setFlaggedAreas(areas);
      setLastUpdated(new Date());

      if (areas.length > 0) {
        setMapCenter([areas[0].latitude, areas[0].longitude]);
      }

    } catch (err) {
      console.error('API Error:', {
        error: err,
        rawResponse,
        authToken: localStorage.getItem('access_token')
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlaggedAreas();

    // Set up refresh every 30 seconds
    const interval = setInterval(fetchFlaggedAreas, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderLoadingState = () => (
    <div className="d-flex justify-content-center align-items-center py-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <span className="ms-3">Loading security data...</span>
    </div>
  );

  const renderErrorState = () => (
    <div>
      <Alert variant="danger" className="m-3">
        <Alert.Heading>Error loading data</Alert.Heading>
        <p className="mb-2">{error}</p>
        <p className="mb-0"><small>Endpoint: {API_BASE_URL}/api/emergencies/flagged-areas/</small></p>

        <div className="mt-3">
          <button
            className="btn btn-sm btn-outline-danger me-2"
            onClick={fetchFlaggedAreas}
          >
            Retry
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => navigator.clipboard.writeText(rawResponse)}
          >
            Copy Response
          </button>
        </div>
      </Alert>

      {rawResponse && (
        <Alert variant="secondary" className="m-3">
          <h5>Raw Response:</h5>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {rawResponse}
          </pre>
        </Alert>
      )}
    </div>
  );

  const renderMapControls = () => (
    <div className="d-flex justify-content-between mb-3">
      <div>
        <span className="badge bg-danger me-2">High Threat</span>
        <span className="badge bg-warning me-2">Medium Threat</span>
        <span className="badge bg-secondary">Low Threat</span>
      </div>
      {lastUpdated && (
        <small className="text-muted">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </small>
      )}
    </div>
  );

  const renderMap = () => (
    <div className="card">
      <div className="card-body p-0" style={{ height: '500px' }}>
        <MapContainer
          center={mapCenter}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {flaggedAreas.map((area, index) => {
            const threatLevel = area.threat_level?.toLowerCase() || 'low';
            const threatConfig = THREAT_LEVELS[threatLevel] || THREAT_LEVELS.low;

            return (
              <React.Fragment key={`${area.id}-${index}` || `${area.latitude}-${area.longitude}-${index}`}>
                <Circle
                  center={[area.latitude, area.longitude]}
                  radius={area.radius || 100}
                  pathOptions={{
                    color: threatConfig.color,
                    fillColor: threatConfig.color,
                    fillOpacity: 0.2
                  }}
                />
                <Marker
                  position={[area.latitude, area.longitude]}
                  icon={createCustomIcon(threatLevel)}
                >
                  <Popup>
                    <div>
                      <h5>{area.title || 'Security Alert'}</h5>
                      <p><strong>Threat Level:</strong> {threatConfig.label}</p>
                      <p><strong>Description:</strong> {area.description || 'No description available'}</p>
                      <p><strong>Incidents:</strong> {area.incident_count || 'N/A'}</p>
                      <p><strong>Last Incident:</strong> {area.last_incident ?
                        new Date(area.last_incident).toLocaleString() : 'N/A'}</p>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Security Flagged Areas</h2>
      {renderMapControls()}
      {loading ? renderLoadingState() :
       error ? renderErrorState() :
       renderMap()}
    </div>
  );
}