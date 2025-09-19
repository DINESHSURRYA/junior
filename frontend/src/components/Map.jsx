import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Clock, AlertCircle, Wifi, WifiOff, Maximize2, Minimize2, RotateCcw, Zap, Users, Thermometer } from 'lucide-react';

// Enhanced custom bus icon with rotation support
const createBusIcon = (isMoving = false, busNumber = '', heading = 0) => {
  return L.divIcon({
    className: 'custom-bus-marker',
    html: `
      <div class="bus-marker-container" style="transform: rotate(${heading}deg);">
        <div class="bus-marker-body ${isMoving ? 'pulse-animation' : ''}">
          <div class="bus-marker-content">
            <span class="bus-number">${busNumber}</span>
            <div class="bus-marker-indicator ${isMoving ? 'moving' : 'stopped'}"></div>
          </div>
        </div>
        <div class="bus-marker-shadow"></div>
      </div>
    `,
    iconSize: [60, 32],
    iconAnchor: [30, 16],
    popupAnchor: [0, -16]
  });
};

// Create stop markers
const createStopIcon = (isNext = false) => {
  return L.divIcon({
    className: 'custom-stop-marker',
    html: `
      <div class="stop-marker ${isNext ? 'next-stop' : 'regular-stop'}">
        <div class="stop-marker-inner"></div>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

// Component to update map view when position changes
function MapUpdater({ position, shouldCenter, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (shouldCenter) {
      map.setView(position, zoom || map.getZoom());
    }
  }, [map, position, shouldCenter, zoom]);
  
  return null;
}

export default function Map({ 
  busId = "001", 
  position = [12.9716, 77.5946],
  busData = {},
  connectionStatus = 'connecting',
  lastUpdate = null,
  isMoving = false,
  autoCenter = true,
  showAccuracy = false,
  showRoute = true,
  showStops = true,
  isFullscreen = false,
  accuracy = 25,
  routePath = [],
  busStops = [],
  showControls = true,
  isMini = false,
  onAutoCenterChange,
  onFullscreenToggle,
  onShowAccuracyChange,
  onShowRouteChange,
  onShowStopsChange
}) {
  const [pos, setPos] = useState(position);
  const [lastUpdateTime, setLastUpdateTime] = useState(lastUpdate || new Date());
  const [connStatus, setConnStatus] = useState(connectionStatus);
  const [busInfo, setBusInfo] = useState({
    speed: 0,
    heading: 0,
    route: '',
    nextStop: '',
    passengers: 0,
    capacity: 50,
    temperature: 22,
    batteryLevel: 85,
    ...busData
  });
  const [isBusMoving, setIsBusMoving] = useState(isMoving);
  const [autoCenterMap, setAutoCenterMap] = useState(autoCenter);
  const [showAcc, setShowAcc] = useState(showAccuracy);
  const [showRt, setShowRt] = useState(showRoute);
  const [showStps, setShowStps] = useState(showStops);
  const [isFullscreenMode, setIsFullscreenMode] = useState(isFullscreen);
  const [acc, setAcc] = useState(accuracy);
  const [rtPath, setRtPath] = useState(routePath);
  const [busStps, setBusStps] = useState(busStops);
  
  const mapRef = useRef(null);
  const previousPosRef = useRef(pos);

  // Update internal state when props change
  useEffect(() => {
    setPos(position);
    setBusInfo(prev => ({ ...prev, ...busData }));
    setConnStatus(connectionStatus);
    setIsBusMoving(isMoving);
    setAutoCenterMap(autoCenter);
    setShowAcc(showAccuracy);
    setShowRt(showRoute);
    setShowStps(showStops);
    setIsFullscreenMode(isFullscreen);
    setAcc(accuracy);
    setRtPath(routePath);
    setBusStps(busStops);
    if (lastUpdate) setLastUpdateTime(lastUpdate);
  }, [position, busData, connectionStatus, isMoving, autoCenter, showAccuracy, 
      showRoute, showStops, isFullscreen, accuracy, routePath, busStops, lastUpdate]);

  // Generate mock route and stops if not provided
  useEffect(() => {
    if (rtPath.length === 0) {
      const basePoints = [
        [12.9716, 77.5946],
        [12.9750, 77.5980],
        [12.9785, 77.6015],
        [12.9820, 77.6050],
        [12.9855, 77.6085],
        [12.9890, 77.6120]
      ];
      setRtPath(basePoints);
    }
    
    if (busStps.length === 0) {
      const stops = [
        { id: 1, name: "Central Station", position: [12.9716, 77.5946], isNext: false },
        { id: 2, name: "Mall Plaza", position: [12.9750, 77.5980], isNext: true },
        { id: 3, name: "University", position: [12.9785, 77.6015], isNext: false },
        { id: 4, name: "Hospital", position: [12.9820, 77.6050], isNext: false },
        { id: 5, name: "Airport Terminal", position: [12.9855, 77.6085], isNext: false }
      ];
      setBusStps(stops);
    }
  }, [rtPath.length, busStps.length]);

  // Simulate data updates if no external data is provided
  useEffect(() => {
    if (!busData || Object.keys(busData).length === 0) {
      const interval = setInterval(() => {
        const routes = ['Route 42A', 'Route 42B', 'Route 42C', 'Route 42D'];
        const stops = ['Central Station', 'Mall Plaza', 'University', 'Hospital', 'Airport Terminal'];
        
        const mockData = {
          lat: pos[0] + (Math.random() - 0.5) * 0.002,
          lon: pos[1] + (Math.random() - 0.5) * 0.002,
          speed: Math.max(0, Math.min(60, Math.floor(Math.random() * 45) + 5)),
          heading: (Math.random() * 360),
          route: routes[Math.floor(Math.random() * routes.length)],
          nextStop: stops[Math.floor(Math.random() * stops.length)],
          accuracy: 15 + Math.random() * 20,
          passengers: Math.floor(Math.random() * 45) + 5,
          capacity: 50,
          temperature: 20 + Math.random() * 8,
          batteryLevel: 75 + Math.random() * 25
        };
        
        setPos([mockData.lat, mockData.lon]);
        setBusInfo({
          speed: mockData.speed,
          heading: mockData.heading,
          route: mockData.route,
          nextStop: mockData.nextStop,
          passengers: mockData.passengers,
          capacity: mockData.capacity,
          temperature: mockData.temperature,
          batteryLevel: mockData.batteryLevel
        });
        setAcc(mockData.accuracy);
        setLastUpdateTime(new Date());
        setConnStatus('connected');
        
        // Enhanced movement detection
        const prevPos = previousPosRef.current;
        const distance = Math.sqrt(
          Math.pow(mockData.lat - prevPos[0], 2) + 
          Math.pow(mockData.lon - prevPos[1], 2)
        );
        setIsBusMoving(distance > 0.00001 || mockData.speed > 3);
        previousPosRef.current = [mockData.lat, mockData.lon];
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [busData, pos]);

  const getConnectionStatusIcon = () => {
    const iconProps = { style: { width: 16, height: 16 } };
    switch (connStatus) {
      case 'connected':
        return <Wifi {...iconProps} style={{ ...iconProps.style, color: 'rgb(34, 197, 94)' }} />;
      case 'connecting':
        return <Wifi {...iconProps} style={{ ...iconProps.style, color: 'rgb(245, 158, 11)', animation: 'pulse 2s infinite' }} />;
      case 'error':
        return <WifiOff {...iconProps} style={{ ...iconProps.style, color: 'rgb(239, 68, 68)' }} />;
      default:
        return <AlertCircle {...iconProps} style={{ ...iconProps.style, color: 'rgb(156, 163, 175)' }} />;
    }
  };

  const formatLastUpdate = () => {
    if (!lastUpdateTime) return 'Never';
    const seconds = Math.floor((new Date() - lastUpdateTime) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  const getOccupancyColor = () => {
    const percentage = (busInfo.passengers / busInfo.capacity) * 100;
    if (percentage >= 90) return '#dc2626';
    if (percentage >= 70) return '#f59e0b';
    return '#10b981';
  };

  const resetView = () => {
    setAutoCenterMap(true);
    if (onAutoCenterChange) onAutoCenterChange(true);
  };

  const toggleFullscreen = () => {
    const newValue = !isFullscreenMode;
    setIsFullscreenMode(newValue);
    if (onFullscreenToggle) onFullscreenToggle(newValue);
  };

  const toggleShowAccuracy = () => {
    const newValue = !showAcc;
    setShowAcc(newValue);
    if (onShowAccuracyChange) onShowAccuracyChange(newValue);
  };

  const toggleShowRoute = () => {
    const newValue = !showRt;
    setShowRt(newValue);
    if (onShowRouteChange) onShowRouteChange(newValue);
  };

  const toggleShowStops = () => {
    const newValue = !showStps;
    setShowStps(newValue);
    if (onShowStopsChange) onShowStopsChange(newValue);
  };

  const toggleAutoCenter = () => {
    const newValue = !autoCenterMap;
    setAutoCenterMap(newValue);
    if (onAutoCenterChange) onAutoCenterChange(newValue);
  };

  return (
    <div className={`map-wrapper ${isFullscreenMode ? 'fullscreen' : ''} ${isMini ? 'mini' : ''}`}>
      <div className="map-container">
        {/* Enhanced Header */}
        {!isMini && (
          <div className="map-header">
            <div className="header-left">
              <div className="bus-icon">
                <MapPin style={{ width: 18, height: 18 }} />
              </div>
              <div className="bus-info">
                <h3 className="bus-title">Bus {busId}</h3>
                <p className="route-text">{busInfo.route}</p>
              </div>
            </div>
            
            <div className="header-right">
              <div className="connection-status">
                {getConnectionStatusIcon()}
                <span className="status-text">{connStatus}</span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Status Bar */}
        {!isMini && (
          <div className="status-bar">
            <div className="status-metrics">
              <div className="metric">
                <Navigation style={{ width: 14, height: 14 }} />
                <span>{busInfo.speed} km/h</span>
              </div>
              <div className="metric">
                <Users style={{ width: 14, height: 14 }} />
                <span>{busInfo.passengers}/{busInfo.capacity}</span>
              </div>
              <div className="metric">
                <Thermometer style={{ width: 14, height: 14 }} />
                <span>{busInfo.temperature.toFixed(1)}°C</span>
              </div>
              <div className="metric">
                <Zap style={{ width: 14, height: 14 }} />
                <span>{busInfo.batteryLevel.toFixed(0)}%</span>
              </div>
            </div>
            
            <div className="update-time">
              <Clock style={{ width: 14, height: 14 }} />
              <span>{formatLastUpdate()}</span>
            </div>
          </div>
        )}

        {/* Advanced Controls */}
        {showControls && !isMini && (
          <div className="map-controls">
            <div className="control-group primary-controls">
              <button
                className={`control-btn ${autoCenterMap ? 'active' : ''}`}
                onClick={toggleAutoCenter}
                title="Auto Center"
              >
                <MapPin style={{ width: 16, height: 16 }} />
              </button>
              
              <button
                className="control-btn"
                onClick={resetView}
                title="Reset View"
              >
                <RotateCcw style={{ width: 16, height: 16 }} />
              </button>
              
              <button
                className="control-btn"
                onClick={toggleFullscreen}
                title={isFullscreenMode ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreenMode ? 
                  <Minimize2 style={{ width: 16, height: 16 }} /> : 
                  <Maximize2 style={{ width: 16, height: 16 }} />
                }
              </button>
            </div>

            <div className="control-group secondary-controls">
              <button
                className={`control-btn ${showRt ? 'active' : ''}`}
                onClick={toggleShowRoute}
                title="Show Route"
              >
                Route
              </button>
              
              <button
                className={`control-btn ${showStps ? 'active' : ''}`}
                onClick={toggleShowStops}
                title="Show Stops"
              >
                Stops
              </button>
              
              <button
                className={`control-btn ${showAcc ? 'active' : ''}`}
                onClick={toggleShowAccuracy}
                title="Show Accuracy"
              >
                GPS
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Map */}
        <div className="leaflet-container">
          <MapContainer 
            center={pos} 
            zoom={isMini ? 13 : 15} 
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
            zoomControl={!isMini}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapUpdater position={pos} shouldCenter={autoCenterMap} />
            
            {/* Route Path */}
            {showRt && rtPath.length > 0 && (
              <Polyline
                positions={rtPath}
                pathOptions={{
                  color: '#3b82f6',
                  weight: 4,
                  opacity: 0.8,
                  dashArray: '10, 10'
                }}
              />
            )}
            
            {/* Bus Stops */}
            {showStps && busStps.map((stop) => (
              <Marker 
                key={stop.id}
                position={stop.position}
                icon={createStopIcon(stop.isNext)}
              >
                <Popup>
                  <div className="stop-popup">
                    <h4>{stop.name}</h4>
                    <p>{stop.isNext ? 'Next Stop' : 'Bus Stop'}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* GPS Accuracy Circle */}
            {showAcc && (
              <Circle
                center={pos}
                radius={acc}
                pathOptions={{
                  color: '#3b82f6',
                  fillColor: '#3b82f6',
                  fillOpacity: 0.1,
                  weight: 2,
                  dashArray: '5, 5'
                }}
              />
            )}
            
            {/* Bus Marker */}
            <Marker 
              position={pos}
              icon={createBusIcon(isBusMoving, busId, busInfo.heading)}
            >
              {!isMini && (
                <Popup className="bus-popup" maxWidth={300}>
                  <div className="popup-content">
                    <div className="popup-header">
                      <h3>Bus {busId}</h3>
                      <span className={`status-badge ${isBusMoving ? 'moving' : 'stopped'}`}>
                        {isBusMoving ? '🚌 Moving' : '🛑 Stopped'}
                      </span>
                    </div>
                    
                    <div className="popup-metrics">
                      <div className="metric-row">
                        <div className="metric-item">
                          <span className="label">Route:</span>
                          <span className="value">{busInfo.route}</span>
                        </div>
                        <div className="metric-item">
                          <span className="label">Speed:</span>
                          <span className="value">{busInfo.speed} km/h</span>
                        </div>
                      </div>
                      
                      <div className="metric-row">
                        <div className="metric-item">
                          <span className="label">Next Stop:</span>
                          <span className="value">{busInfo.nextStop}</span>
                        </div>
                        <div className="metric-item">
                          <span className="label">Passengers:</span>
                          <span className="value">{busInfo.passengers}/{busInfo.capacity}</span>
                        </div>
                      </div>
                      
                      <div className="occupancy-indicator">
                        <div className="occupancy-bar">
                          <div 
                            className="occupancy-fill"
                            style={{ 
                              width: `${(busInfo.passengers / busInfo.capacity) * 100}%`,
                              backgroundColor: getOccupancyColor()
                            }}
                          ></div>
                        </div>
                        <span className="occupancy-text">
                          {Math.round((busInfo.passengers / busInfo.capacity) * 100)}% full
                        </span>
                      </div>
                    </div>
                    
                    <div className="popup-footer">
                      <div className="accuracy-info">
                        <span>Accuracy: ±{acc.toFixed(0)}m</span>
                      </div>
                      <div className="update-info">
                        Updated {formatLastUpdate()}
                      </div>
                    </div>
                  </div>
                </Popup>
              )}
            </Marker>
          </MapContainer>
        </div>

        {/* Enhanced Footer */}
        {!isMini && (
          <div className="map-footer">
            <div className="footer-left">
              <div className="live-indicator">
                <div className={`pulse-dot ${connStatus}`}></div>
                <span className="live-text">
                  {connStatus === 'connected' ? 'Live Tracking' :
                  connStatus === 'connecting' ? 'Connecting...' :
                  'Connection Lost'}
                </span>
              </div>
            </div>
            
            <div className="footer-right">
              <div className="coordinates">
                {pos[0].toFixed(4)}, {pos[1].toFixed(4)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Complete Styles */}
      <style>{`
        .map-wrapper {
          position: relative;
          height: 600px;
          width: 100%;
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .map-wrapper.mini {
          height: 200px;
        }

        .map-wrapper.mini .map-header,
        .map-wrapper.mini .status-bar,
        .map-wrapper.mini .map-controls,
        .map-wrapper.mini .map-footer {
          display: none !important;
        }

        .map-wrapper.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          background: white;
          height: 100vh;
        }

        .map-container {
          position: relative;
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .map-wrapper.fullscreen .map-container {
          border-radius: 0;
          height: 100vh;
        }

        .map-wrapper.mini .map-container {
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .map-header {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 70px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .bus-icon {
          width: 2.5rem;
          height: 2.5rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .bus-info {
          display: flex;
          flex-direction: column;
        }

        .bus-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
        }

        .route-text {
          font-size: 0.875rem;
          opacity: 0.9;
          margin: 0;
          line-height: 1.2;
        }

        .header-right {
          display: flex;
          align-items: center;
        }

        .connection-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          backdrop-filter: blur(10px);
        }

        .status-text {
          font-size: 0.875rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .status-bar {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 0.75rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          min-height: 50px;
        }

        .status-metrics {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .metric {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          color: #374151;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .update-time {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .map-controls {
          position: absolute;
          top: 130px;
          right: 1rem;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 0.75rem;
          padding: 0.5rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .control-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border: none;
          border-radius: 0.5rem;
          background: transparent;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .control-btn:hover {
          background: rgba(79, 70, 229, 0.1);
          color: #4f46e5;
        }

        .control-btn.active {
          background: #4f46e5;
          color: white;
        }

        .secondary-controls .control-btn {
          width: auto;
          padding: 0.5rem 0.75rem;
          min-width: 3rem;
        }

        .leaflet-container {
          flex: 1;
          position: relative;
          min-height: 300px;
        }

        .map-wrapper.mini .leaflet-container {
          min-height: 200px;
        }

        .map-footer {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 0.75rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          min-height: 50px;
        }

        .footer-left {
          display: flex;
          align-items: center;
        }

        .footer-right {
          display: flex;
          align-items: center;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pulse-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          position: relative;
        }

        .pulse-dot.connected {
          background: #10b981;
          animation: pulse-green 2s infinite;
        }

        .pulse-dot.connecting {
          background: #f59e0b;
          animation: pulse-yellow 2s infinite;
        }

        .pulse-dot.error {
          background: #ef4444;
        }

        .live-text {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .coordinates {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.75rem;
          color: #6b7280;
          background: rgba(0, 0, 0, 0.05);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
        }

        /* Custom Marker Styles */
        .custom-bus-marker {
          background: transparent !important;
          border: none !important;
        }

        .bus-marker-container {
          position: relative;
          transform-origin: center;
          transition: transform 0.3s ease;
        }

        .bus-marker-body {
          width: 3.75rem;
          height: 2rem;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border: 3px solid white;
          position: relative;
          overflow: hidden;
        }

        .bus-marker-content {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
        }

        .bus-number {
          color: white;
          font-size: 0.875rem;
          font-weight: 700;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .bus-marker-indicator {
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
          width: 0.375rem;
          height: 0.375rem;
          border-radius: 50%;
          border: 1px solid white;
        }

        .bus-marker-indicator.moving {
          background: #10b981;
          animation: pulse-green 1.5s infinite;
        }

        .bus-marker-indicator.stopped {
          background: #ef4444;
        }

        .bus-marker-shadow {
          position: absolute;
          bottom: -0.125rem;
          left: 50%;
          transform: translateX(-50%);
          width: 2.5rem;
          height: 0.5rem;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          filter: blur(2px);
        }

        .pulse-animation {
          animation: bus-pulse 2s infinite;
        }

        /* Stop Marker Styles */
        .custom-stop-marker {
          background: transparent !important;
          border: none !important;
        }

        .stop-marker {
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .stop-marker.regular-stop {
          background: #6b7280;
        }

        .stop-marker.next-stop {
          background: #f59e0b;
          animation: pulse-yellow 2s infinite;
        }

        .stop-marker-inner {
          width: 0.375rem;
          height: 0.375rem;
          border-radius: 50%;
          background: white;
        }

        /* Popup Styles */
        .stop-popup h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
        }

        .stop-popup p {
          margin: 0;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .popup-content {
          max-width: 280px;
        }

        .popup-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .popup-header h3 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 700;
          color: #374151;
        }

        .status-badge {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
        }

        .status-badge.moving {
          background: #dcfce7;
          color: #16a34a;
        }

        .status-badge.stopped {
          background: #fef2f2;
          color: #dc2626;
        }

        .popup-metrics {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .metric-row {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }

        .metric-item {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .metric-item .label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
          margin-bottom: 0.125rem;
        }

        .metric-item .value {
          font-size: 0.875rem;
          color: #374151;
          font-weight: 600;
        }

        .occupancy-indicator {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e5e7eb;
        }

        .occupancy-bar {
          width: 100%;
          height: 0.5rem;
          background: #e5e7eb;
          border-radius: 9999px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .occupancy-fill {
          height: 100%;
          transition: width 0.3s ease;
          border-radius: 9999px;
        }

        .occupancy-text {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
        }

        .popup-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.75rem;
          padding-top: 0.5rem;
          border-top: 1px solid #e5e7eb;
          font-size: 0.75rem;
          color: #6b7280;
        }

        /* Animations */
        @keyframes pulse-green {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        @keyframes pulse-yellow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.15);
          }
        }

        @keyframes bus-pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 12px 35px rgba(79, 70, 229, 0.3);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .map-header {
            padding: 0.75rem 1rem;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .bus-title {
            font-size: 1.125rem;
          }

          .status-bar {
            padding: 0.5rem 1rem;
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }

          .status-metrics {
            gap: 1rem;
            flex-wrap: wrap;
          }

          .metric {
            font-size: 0.8rem;
          }

          .map-controls {
            top: 160px;
            right: 0.5rem;
          }

          .control-group {
            padding: 0.375rem;
          }

          .control-btn {
            width: 2.25rem;
            height: 2.25rem;
          }

          .secondary-controls .control-btn {
            padding: 0.375rem 0.5rem;
            min-width: 2.5rem;
            font-size: 0.7rem;
          }

          .map-footer {
            padding: 0.5rem 1rem;
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }

          .coordinates {
            font-size: 0.7rem;
          }

          .bus-marker-body {
            width: 3.25rem;
            height: 1.75rem;
          }

          .bus-number {
            font-size: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .map-wrapper {
            height: 500px;
          }

          .header-left {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .bus-icon {
            width: 2rem;
            height: 2rem;
          }

          .bus-title {
            font-size: 1rem;
          }

          .route-text {
            font-size: 0.8rem;
          }

          .status-metrics {
            gap: 0.75rem;
          }

          .metric {
            font-size: 0.75rem;
          }

          .map-controls {
            position: static;
            margin: 0.5rem;
            flex-direction: row;
            justify-content: center;
          }

          .control-group {
            flex-direction: row;
          }
        }

        /* Fix for Leaflet default styles */
        .leaflet-popup-content-wrapper {
          border-radius: 0.75rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .leaflet-popup-tip {
          background: white;
          box-shadow: none;
        }

        .leaflet-container {
          font-family: inherit;
        }

        /* Override default leaflet marker styles */
        .leaflet-marker-icon {
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
        }

        /* Loading states */
        .loading-shimmer {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        /* Connection status indicators */
        .connection-status.connecting {
          animation: pulse 2s infinite;
        }

        .connection-status.error {
          background: rgba(239, 68, 68, 0.1);
        }

        .connection-status.connected {
          background: rgba(34, 197, 94, 0.1);
        }

        /* Enhanced accessibility */
        .control-btn:focus {
          outline: 2px solid #4f46e5;
          outline-offset: 2px;
        }

        .control-btn:focus:not(:focus-visible) {
          outline: none;
        }

        /* Print styles */
        @media print {
          .map-controls,
          .map-footer,
          .status-bar {
            display: none;
          }
          
          .map-container {
            box-shadow: none;
            border: 1px solid #e5e7eb;
          }
        }
      `}</style>
    </div>
  );
}