import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, User, Phone, MessageCircle, AlertTriangle, CheckCircle, Activity, Navigation, Fuel, Settings, Bell, Share, Download } from 'lucide-react';
import Map from '../components/Map';

// Mock useParams hook for demo
const useParams = () => ({ id: '101' });

function BusDetail() {
  const { id } = useParams();
  
  const [busData, setBusData] = useState({
    id: id,
    status: "On Time",
    route: "Route 42A - Downtown Express",
    currentLocation: "Central Station",
    nextStop: "Mall Plaza",
    eta: "3 minutes",
    passengers: 24,
    capacity: 50,
    driver: {
      name: "John Smith",
      phone: "(555) 123-4567",
      id: "D001",
      rating: 4.8,
      experience: "5 years"
    },
    speed: 35,
    fuel: 78,
    temperature: 22,
    lastUpdate: new Date(),
    alerts: [
      { type: 'info', message: 'Next stop announcement made', time: '2 min ago' },
      { type: 'warning', message: 'High passenger load', time: '5 min ago' }
    ],
    schedule: [
      { stop: "Central Station", time: "14:30", status: "completed", delay: 0 },
      { stop: "Mall Plaza", time: "14:35", status: "current", delay: 2 },
      { stop: "University", time: "14:42", status: "upcoming", delay: 2 },
      { stop: "Hospital", time: "14:48", status: "upcoming", delay: 2 },
      { stop: "Airport", time: "15:05", status: "upcoming", delay: 2 }
    ]
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setBusData(prev => ({
        ...prev,
        passengers: Math.max(0, Math.min(50, prev.passengers + Math.floor(Math.random() * 6) - 3)),
        speed: Math.max(0, Math.min(60, prev.speed + Math.floor(Math.random() * 10) - 5)),
        fuel: Math.max(0, Math.min(100, prev.fuel - Math.random() * 0.5)),
        lastUpdate: new Date()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'On Time': return 'status-ontime';
      case 'Delayed': return 'status-delayed';
      case 'In Service': return 'status-service';
      case 'Out of Service': return 'status-out';
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'On Time': return <CheckCircle className="status-icon" />;
      case 'Delayed': return <AlertTriangle className="status-icon" />;
      case 'In Service': return <Activity className="status-icon" />;
      case 'Out of Service': return <Activity className="status-icon" />;
      default: return <Activity className="status-icon" />;
    }
  };

  const getOccupancyLevel = () => {
    const percentage = (busData.passengers / busData.capacity) * 100;
    if (percentage >= 90) return 'critical';
    if (percentage >= 70) return 'high';
    if (percentage >= 40) return 'medium';
    return 'low';
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="bus-detail-wrapper">
      {/* Navigation Header */}
      <nav className="detail-nav">
        <div className="nav-content">
          <button className="back-btn">
            <ArrowLeft />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="nav-actions">
            <button className="icon-btn" title="Share">
              <Share />
            </button>
            <button className="icon-btn" title="Download Report">
              <Download />
            </button>
            <button className="icon-btn" title="Settings">
              <Settings />
            </button>
            <button className={`icon-btn ${notifications ? 'active' : ''}`} 
                    onClick={() => setNotifications(!notifications)}
                    title="Notifications">
              <Bell />
            </button>
          </div>
        </div>
      </nav>

      <div className="bus-detail-container">
        {/* Hero Section */}
        <div className="bus-hero">
          <div className="hero-content">
            <div className="bus-identity">
              <div className="bus-icon">
                <Activity />
              </div>
              <div className="bus-info">
                <h1 className="bus-title">Bus {busData.id}</h1>
                <p className="route-name">{busData.route}</p>
              </div>
            </div>
            
            <div className={`hero-status ${getStatusClass(busData.status)}`}>
              {getStatusIcon(busData.status)}
              <span>{busData.status}</span>
            </div>
          </div>

          {/* Live Stats Bar */}
          <div className="live-stats">
            <div className="stat-item">
              <div className="stat-icon">
                <Navigation />
              </div>
              <div className="stat-content">
                <span className="stat-value">{busData.speed} km/h</span>
                <span className="stat-label">Speed</span>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">
                <Fuel />
              </div>
              <div className="stat-content">
                <span className="stat-value">{busData.fuel.toFixed(0)}%</span>
                <span className="stat-label">Fuel</span>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon occupancy">
                👥
              </div>
              <div className="stat-content">
                <span className="stat-value">{busData.passengers}/{busData.capacity}</span>
                <span className="stat-label">Passengers</span>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">
                🌡️
              </div>
              <div className="stat-content">
                <span className="stat-value">{busData.temperature}°C</span>
                <span className="stat-label">Temperature</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'route' ? 'active' : ''}`}
            onClick={() => setActiveTab('route')}
          >
            Route & Schedule
          </button>
          <button 
            className={`tab-btn ${activeTab === 'driver' ? 'active' : ''}`}
            onClick={() => setActiveTab('driver')}
          >
            Driver Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            Alerts
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="content-grid">
                {/* Map Section */}
                <div className="map-section">
                  <div className="section-header">
                    <h3>Live Location</h3>
                    <span className="live-indicator">● LIVE</span>
                  </div>
                  <div className="map-container">
                    <Map busId={busData.id} />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="quick-stats">
                  <div className="section-header">
                    <h3>Quick Stats</h3>
                  </div>
                  
                  <div className="stats-cards">
                    <div className="mini-card">
                      <div className="mini-card-icon location">
                        <MapPin />
                      </div>
                      <div className="mini-card-content">
                        <span className="mini-card-label">Current Stop</span>
                        <span className="mini-card-value">{busData.currentLocation}</span>
                      </div>
                    </div>
                    
                    <div className="mini-card">
                      <div className="mini-card-icon time">
                        <Clock />
                      </div>
                      <div className="mini-card-content">
                        <span className="mini-card-label">Next Stop</span>
                        <span className="mini-card-value">{busData.nextStop}</span>
                        <span className="mini-card-meta">ETA: {busData.eta}</span>
                      </div>
                    </div>
                  </div>

                  {/* Occupancy Chart */}
                  <div className="occupancy-chart">
                    <div className="chart-header">
                      <span>Passenger Load</span>
                      <span className={`occupancy-status ${getOccupancyLevel()}`}>
                        {Math.round((busData.passengers / busData.capacity) * 100)}%
                      </span>
                    </div>
                    <div className="occupancy-bar">
                      <div 
                        className={`occupancy-fill ${getOccupancyLevel()}`}
                        style={{ width: `${(busData.passengers / busData.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <div className="occupancy-labels">
                      <span>0</span>
                      <span>{busData.capacity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'route' && (
            <div className="route-content">
              <div className="section-header">
                <h3>Route Schedule</h3>
                <span className="route-status">Updated {formatTime(busData.lastUpdate)}</span>
              </div>
              
              <div className="schedule-timeline">
                {busData.schedule.map((stop, index) => (
                  <div key={index} className={`timeline-item ${stop.status}`}>
                    <div className="timeline-marker">
                      <div className="timeline-dot"></div>
                      {index < busData.schedule.length - 1 && <div className="timeline-line"></div>}
                    </div>
                    
                    <div className="timeline-content">
                      <div className="stop-header">
                        <h4 className="stop-name">{stop.stop}</h4>
                        <div className="stop-meta">
                          <span className="stop-time">{stop.time}</span>
                          {stop.delay > 0 && (
                            <span className="delay-indicator">+{stop.delay}min</span>
                          )}
                        </div>
                      </div>
                      
                      <div className={`stop-status ${stop.status}`}>
                        {stop.status === 'completed' && '✓ Completed'}
                        {stop.status === 'current' && '📍 Current Stop'}
                        {stop.status === 'upcoming' && '⏳ Upcoming'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'driver' && (
            <div className="driver-content">
              <div className="driver-card">
                <div className="driver-avatar">
                  <span>{busData.driver.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                
                <div className="driver-info">
                  <h3>{busData.driver.name}</h3>
                  <p className="driver-id">Driver ID: {busData.driver.id}</p>
                  
                  <div className="driver-stats">
                    <div className="driver-stat">
                      <span className="stat-label">Rating</span>
                      <div className="rating">
                        <span className="rating-value">⭐ {busData.driver.rating}</span>
                      </div>
                    </div>
                    
                    <div className="driver-stat">
                      <span className="stat-label">Experience</span>
                      <span className="stat-value">{busData.driver.experience}</span>
                    </div>
                  </div>
                  
                  <div className="driver-actions">
                    <button className="action-btn primary">
                      <Phone />
                      <span>Call Driver</span>
                    </button>
                    <button className="action-btn secondary">
                      <MessageCircle />
                      <span>Send Message</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="alerts-content">
              <div className="section-header">
                <h3>Recent Alerts</h3>
              </div>
              
              <div className="alerts-list">
                {busData.alerts.map((alert, index) => (
                  <div key={index} className={`alert-item ${alert.type}`}>
                    <div className="alert-icon">
                      {alert.type === 'warning' ? <AlertTriangle /> : <CheckCircle />}
                    </div>
                    <div className="alert-content">
                      <p className="alert-message">{alert.message}</p>
                      <span className="alert-time">{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .bus-detail-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .detail-nav {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          color: white;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .nav-actions {
          display: flex;
          gap: 0.5rem;
        }

        .icon-btn {
          width: 2.5rem;
          height: 2.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .icon-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .icon-btn.active {
          background: rgba(59, 130, 246, 0.3);
          border-color: rgba(59, 130, 246, 0.5);
        }

        .bus-detail-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .bus-hero {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .hero-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .bus-identity {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .bus-icon {
          width: 4rem;
          height: 4rem;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .bus-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          margin: 0;
        }

        .route-name {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0.25rem 0 0 0;
        }

        .hero-status {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .status-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .status-ontime {
          background: rgba(34, 197, 94, 0.2);
          color: #10b981;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .status-delayed {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .status-service {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .status-out {
          background: rgba(156, 163, 175, 0.2);
          color: #9ca3af;
          border: 1px solid rgba(156, 163, 175, 0.3);
        }

        .live-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat-icon {
          width: 2.5rem;
          height: 2.5rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.8);
        }

        .stat-icon.occupancy {
          background: none;
          font-size: 1.5rem;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 0.25rem;
        }

        .tab-navigation {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.5rem;
          border-radius: 0.75rem;
          backdrop-filter: blur(20px);
        }

        .tab-btn {
          flex: 1;
          padding: 1rem 1.5rem;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab-btn.active {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .tab-content {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          padding: 2rem;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
          margin: 0;
        }

        .live-indicator {
          background: #ef4444;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          animation: pulse 2s infinite;
        }

        .map-container {
          height: 400px;
          border-radius: 0.75rem;
          overflow: hidden;
        }

        .stats-cards {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .mini-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mini-card-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .mini-card-icon.location {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .mini-card-icon.time {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        }

        .mini-card-content {
          display: flex;
          flex-direction: column;
        }

        .mini-card-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .mini-card-value {
          font-size: 1.125rem;
          font-weight: 600;
          color: white;
        }

        .mini-card-meta {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .occupancy-chart {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          padding: 1.5rem;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .chart-header span:first-child {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
        }

        .occupancy-status {
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }

        .occupancy-status.low {
          background: rgba(34, 197, 94, 0.2);
          color: #10b981;
        }

        .occupancy-status.medium {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        .occupancy-status.high {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .occupancy-status.critical {
          background: rgba(220, 38, 38, 0.3);
          color: #dc2626;
        }

        .occupancy-bar {
          width: 100%;
          height: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.375rem;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .occupancy-fill {
          height: 100%;
          border-radius: 0.375rem;
          transition: all 0.3s ease;
        }

        .occupancy-fill.low {
          background: linear-gradient(90deg, #10b981, #059669);
        }

        .occupancy-fill.medium {
          background: linear-gradient(90deg, #f59e0b, #d97706);
        }

        .occupancy-fill.high {
          background: linear-gradient(90deg, #ef4444, #dc2626);
        }

        .occupancy-fill.critical {
          background: linear-gradient(90deg, #dc2626, #b91c1c);
        }

        .occupancy-labels {
          display: flex;
          justify-content: space-between;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
        }

        .route-status {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
        }

        .schedule-timeline {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .timeline-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .timeline-marker {
          position: relative;
          margin-top: 0.25rem;
        }

        .timeline-dot {
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          position: relative;
          z-index: 1;
        }

        .timeline-item.completed .timeline-dot {
          background: #10b981;
        }

        .timeline-item.current .timeline-dot {
          background: #3b82f6;
          animation: pulse 2s infinite;
        }

        .timeline-line {
          position: absolute;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 2rem;
          background: rgba(255, 255, 255, 0.2);
        }

        .timeline-content {
          flex: 1;
          padding-bottom: 0.5rem;
        }

        .stop-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .stop-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: white;
          margin: 0;
        }

        .stop-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stop-time {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
        }

        .delay-indicator {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 0.125rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .stop-status {
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .stop-status.completed {
          color: #10b981;
        }

        .stop-status.current {
          color: #3b82f6;
        }

        .stop-status.upcoming {
          color: rgba(255, 255, 255, 0.6);
        }

        .driver-card {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 2rem;
        }

        .driver-avatar {
          width: 5rem;
          height: 5rem;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .driver-info h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin: 0 0 0.25rem 0;
        }

        .driver-id {
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 1.5rem 0;
        }

        .driver-stats {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .driver-stat {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .driver-stat .stat-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
        }

        .driver-stat .stat-value {
          color: white;
          font-weight: 600;
        }

        .rating-value {
          color: white;
          font-weight: 600;
        }

        .driver-actions {
          display: flex;
          gap: 1rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .action-btn.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .action-btn.secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .action-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .alert-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          border-radius: 0.75rem;
          border-left: 4px solid transparent;
        }

        .alert-item.info {
          background: rgba(59, 130, 246, 0.1);
          border-left-color: #3b82f6;
        }

        .alert-item.warning {
          background: rgba(245, 158, 11, 0.1);
          border-left-color: #f59e0b;
        }

        .alert-item.error {
          background: rgba(239, 68, 68, 0.1);
          border-left-color: #ef4444;
        }

        .alert-icon {
          width: 1.25rem;
          height: 1.25rem;
          margin-top: 0.125rem;
        }

        .alert-item.info .alert-icon {
          color: #3b82f6;
        }

        .alert-item.warning .alert-icon {
          color: #f59e0b;
        }

        .alert-item.error .alert-icon {
          color: #ef4444;
        }

        .alert-content {
          flex: 1;
        }

        .alert-message {
          color: white;
          margin: 0 0 0.25rem 0;
          font-size: 0.875rem;
        }

        .alert-time {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }

          .live-stats {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .bus-detail-container {
            padding: 1rem;
          }

          .hero-content {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .bus-identity {
            width: 100%;
          }

          .hero-status {
            align-self: flex-end;
          }

          .tab-navigation {
            flex-direction: column;
          }

          .driver-card {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
            text-align: center;
          }

          .driver-actions {
            width: 100%;
            flex-direction: column;
          }

          .nav-content {
            padding: 0 1rem;
          }

          .back-btn span {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default BusDetail;