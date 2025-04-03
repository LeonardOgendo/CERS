import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import {
  Spinner,
  Alert,
  Card,
  Badge,
  Button,
  Container,
  Row,
  Col,
  Table,
  Form
} from 'react-bootstrap';
import {
  FiRefreshCw,
  FiAlertTriangle,
  FiInfo,
  FiClock,
  FiMapPin,
  FiNavigation,
  FiList
} from 'react-icons/fi';
import styled from 'styled-components';
import haversine from 'haversine-distance';

// Styled components
const FullHeightContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 1rem;
  overflow: hidden;
`;

const MapCard = styled(Card)`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-grow: 1;
  min-height: 300px;

  .leaflet-container {
    height: 100%;
    width: 100%;
  }
`;

const ControlPanel = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StatusBadge = styled(Badge)`
  font-size: 0.8rem;
  padding: 0.5em 0.75em;
  margin-right: 0.5em;
`;

const LastUpdatedText = styled.small`
  display: flex;
  align-items: center;
  color: #6c757d;

  svg {
    margin-right: 0.3em;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;

  .spinner {
    margin-bottom: 1rem;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 1rem;
  overflow: hidden;
`;

// Kakamega coordinates
const KAKAMEGA_COORDINATES = [0.2827, 34.7519];
const DEFAULT_ZOOM_LEVEL = 13;

// Threat level configuration
const THREAT_LEVELS = {
  high: {
    icon: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    color: '#dc3545',
    label: 'High Threat',
    radius: 150
  },
  medium: {
    icon: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    color: '#fd7e14',
    label: 'Medium Threat',
    radius: 100
  },
  low: {
    icon: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
    color: '#ffc107',
    label: 'Low Threat',
    radius: 50
  },
  default: {
    icon: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    color: '#6c757d',
    label: 'Unknown Threat',
    radius: 30
  }
};

const createCustomIcon = (threatLevel = 'default') => {
  const level = threatLevel?.toLowerCase() in THREAT_LEVELS
    ? threatLevel.toLowerCase()
    : 'default';

  return new L.Icon({
    iconUrl: THREAT_LEVELS[level].icon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

const FlaggedAreas = () => {
  const [flaggedAreas, setFlaggedAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState(KAKAMEGA_COORDINATES);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showDistanceLines, setShowDistanceLines] = useState(true);
  const [activeTab, setActiveTab] = useState('map');
  const mapRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const fetchFlaggedAreas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/emergencies/flagged-areas/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const areas = Array.isArray(data)
        ? data
        : data.results?.results || data.results || [];

      if (!Array.isArray(areas)) {
        throw new Error('Invalid data format');
      }

      const areasWithDistance = areas.map(area => ({
        ...area,
        distance: calculateDistance(KAKAMEGA_COORDINATES, [area.latitude, area.longitude])
      }));

      setFlaggedAreas(areasWithDistance);
      setLastUpdated(new Date());

      if (areas.length > 0) {
        setMapCenter([areas[0].latitude, areas[0].longitude]);
      }

    } catch (err) {
      console.error('API Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const calculateDistance = (point1, point2) => {
    const [lat1, lng1] = point1;
    const [lat2, lng2] = point2;
    const distance = haversine(
      { latitude: lat1, longitude: lng1 },
      { latitude: lat2, longitude: lng2 }
    );
    return (distance / 1000).toFixed(2); // Return distance in km
  };

  useEffect(() => {
    // Fix for Leaflet marker icons
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    fetchFlaggedAreas();
    const interval = setInterval(fetchFlaggedAreas, 30000);
    return () => clearInterval(interval);
  }, [fetchFlaggedAreas]);

  const handleCenterMap = (location) => {
    setMapCenter(location);
    if (mapRef.current) {
      mapRef.current.setView(location, DEFAULT_ZOOM_LEVEL);
    }
  };

  const renderLoadingState = () => (
    <LoadingContainer>
      <Spinner animation="border" role="status" className="spinner" />
      <h5>Loading Security Data</h5>
      <p className="text-muted">Please wait while we retrieve the latest threat information</p>
    </LoadingContainer>
  );

  const renderErrorState = () => (
    <Alert variant="danger" className="mt-4">
      <div className="d-flex align-items-center">
        <FiAlertTriangle size={24} className="me-2" />
        <div>
          <h5>Error Loading Data</h5>
          <p className="mb-2">{error}</p>
        </div>
      </div>

      <div className="mt-3 d-flex gap-2">
        <Button
          variant="outline-danger"
          size="sm"
          onClick={fetchFlaggedAreas}
        >
          <FiRefreshCw className="me-1" /> Retry
        </Button>
      </div>
    </Alert>
  );

  const renderThreatLegend = () => (
    <div className="d-flex align-items-center mb-3">
      <StatusBadge bg="danger">High Threat</StatusBadge>
      <StatusBadge bg="warning" text="dark">Medium Threat</StatusBadge>
      <StatusBadge bg="secondary">Low Threat</StatusBadge>

      <div className="ms-auto d-flex align-items-center">
        <Form.Check
          type="switch"
          id="distance-lines-switch"
          label="Show distance lines"
          checked={showDistanceLines}
          onChange={() => setShowDistanceLines(!showDistanceLines)}
          className="me-3"
        />

        {lastUpdated && (
          <LastUpdatedText>
            <FiClock /> Last updated: {lastUpdated.toLocaleTimeString()}
          </LastUpdatedText>
        )}
      </div>
    </div>
  );

  const renderMap = () => (
    <MapCard>
      <MapContainer
        center={mapCenter}
        zoom={DEFAULT_ZOOM_LEVEL}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        whenCreated={mapInstance => { mapRef.current = mapInstance }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={KAKAMEGA_COORDINATES} icon={createCustomIcon()}>
          <Popup>
            <strong>Your Location</strong> <br />
            Kakamega Town
          </Popup>
        </Marker>

        {flaggedAreas.map((area, index) => {
          const threatLevel = area.threat_level?.toLowerCase() || 'default';
          const threatConfig = THREAT_LEVELS[threatLevel] || THREAT_LEVELS.default;
          const areaLocation = [area.latitude, area.longitude];

          return (
            <React.Fragment key={`${area.id || index}-${area.latitude}-${area.longitude}`}>
              {showDistanceLines && (
                <Polyline
                  positions={[KAKAMEGA_COORDINATES, areaLocation]}
                  color={threatConfig.color}
                  opacity={0.5}
                >
                  <Tooltip permanent direction="center">
                    {area.distance} km from Kakamega
                  </Tooltip>
                </Polyline>
              )}

              <Circle
                center={areaLocation}
                radius={area.radius || threatConfig.radius}
                pathOptions={{
                  color: threatConfig.color,
                  fillColor: threatConfig.color,
                  fillOpacity: 0.15
                }}
              />

              <Marker
                position={areaLocation}
                icon={createCustomIcon(threatLevel)}
              >
                <Popup className="custom-popup">
                  <div>
                    <h6 className="fw-bold mb-2">
                      <FiInfo className="me-1" />
                      {area.title || 'Security Alert'}
                    </h6>
                    <div className="mb-2">
                      <span className="badge" style={{
                        backgroundColor: threatConfig.color,
                        color: threatLevel === 'medium' ? '#212529' : 'white'
                      }}>
                        {threatConfig.label}
                      </span>
                    </div>
                    <p className="mb-1"><small>{area.description || 'No description available'}</small></p>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between">
                      <small className="text-muted">
                        Distance: <strong>{area.distance} km from Kakamega</strong>
                      </small>
                      <small className="text-muted">
                        Last: <strong>{area.last_incident ?
                          new Date(area.last_incident).toLocaleString() : 'N/A'}</strong>
                      </small>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </MapCard>
  );

  const renderCoordinatesTable = () => (
    <Card className="h-100">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Flagged Areas Records</h5>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleCenterMap(KAKAMEGA_COORDINATES)}
        >
          <FiNavigation className="me-1" /> Center to Kakamega
        </Button>
      </Card.Header>
      <Card.Body style={{ overflow: 'auto' }}>
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Coordinates</th>
                <th>Threat Level</th>
                <th>Distance (km)</th>
                <th>Last Incident</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flaggedAreas.map((area, index) => {
                const threatLevel = area.threat_level?.toLowerCase() || 'default';
                const threatConfig = THREAT_LEVELS[threatLevel] || THREAT_LEVELS.default;

                return (
                  <tr key={index}>
                    <td>{area.title || 'N/A'}</td>
                    <td>{area.latitude}, {area.longitude}</td>
                    <td>
                      <Badge
                        bg={
                          threatLevel === 'high' ? 'danger' :
                          threatLevel === 'medium' ? 'warning' : 'secondary'
                        }
                      >
                        {threatConfig.label}
                      </Badge>
                    </td>
                    <td>{area.distance}</td>
                    <td>{area.last_incident ? new Date(area.last_incident).toLocaleString() : 'N/A'}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleCenterMap([area.latitude, area.longitude])}
                      >
                        <FiMapPin /> View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <FullHeightContainer fluid>
      <Row className="mb-3">
        <Col>
          <h2 className="fw-bold">Security Flagged Areas</h2>
          <p className="text-muted">
            Real-time visualization of security threats in Kakamega and surrounding areas
          </p>
        </Col>
      </Row>

      <ControlPanel>
        <Card.Body>
          {renderThreatLegend()}

          <div className="d-flex justify-content-between mb-3">
            <Button
              variant={activeTab === 'map' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('map')}
            >
              <FiMapPin className="me-1" /> Map View
            </Button>
            <Button
              variant={activeTab === 'table' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('table')}
            >
              <FiList className="me-1" /> Coordinates Table
            </Button>
          </div>
        </Card.Body>
      </ControlPanel>

      <ContentWrapper>
        {loading ? renderLoadingState() :
         error ? renderErrorState() :
         activeTab === 'map' ? renderMap() : renderCoordinatesTable()}
      </ContentWrapper>
    </FullHeightContainer>
  );
};

export default FlaggedAreas;