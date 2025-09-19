import React, { useState} from 'react';
import { Search, Filter, Bell, Activity, MapPin, Clock, Users, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function Dashboard() {
  const [buses] = useState([
    { id: '101', name: 'Bus 101', status: 'On Time', route: 'Route 42A', passengers: 24, capacity: 50, nextStop: 'Central Station', eta: '3 min', driver: 'John Smith' },
    { id: '102', name: 'Bus 102', status: 'Delayed', route: 'Route 42B', passengers: 18, capacity: 45, nextStop: 'Mall Plaza', eta: '8 min', driver: 'Sarah Johnson' },
    { id: '103', name: 'Bus 103', status: 'In Service', route: 'Route 42C', passengers: 35, capacity: 50, nextStop: 'University', eta: '5 min', driver: 'Mike Davis' },
    { id: '104', name: 'Bus 104', status: 'On Time', route: 'Route 42D', passengers: 12, capacity: 40, nextStop: 'Hospital', eta: '2 min', driver: 'Emma Wilson' },
    { id: '105', name: 'Bus 105', status: 'Out of Service', route: 'Route 42E', passengers: 0, capacity: 45, nextStop: 'Depot', eta: '-', driver: 'Alex Brown' },
    { id: '106', name: 'Bus 106', status: 'On Time', route: 'Route 42F', passengers: 28, capacity: 50, nextStop: 'Airport', eta: '12 min', driver: 'Lisa Garcia' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [notifications] = useState(3);

  const filteredBuses = buses.filter(bus => {
    const matchesSearch = bus.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         bus.route.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || bus.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'On Time':
        return 'status-ontime';
      case 'Delayed':
        return 'status-delayed';
      case 'In Service':
        return 'status-service';
      case 'Out of Service':
        return 'status-out';
      default:
        return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'On Time':
        return <CheckCircle className="status-icon" />;
      case 'Delayed':
        return <AlertTriangle className="status-icon" />;
      case 'In Service':
        return <Activity className="status-icon" />;
      case 'Out of Service':
        return <XCircle className="status-icon" />;
      default:
        return <Activity className="status-icon" />;
    }
  };

  const getOccupancyLevel = (passengers, capacity) => {
    const percentage = (passengers / capacity) * 100;
    if (percentage >= 90) return 'high';
    if (percentage >= 70) return 'medium';
    return 'low';
  };

  const stats = {
    total: buses.length,
    active: buses.filter(b => b.status !== 'Out of Service').length,
    onTime: buses.filter(b => b.status === 'On Time').length,
    delayed: buses.filter(b => b.status === 'Delayed').length
  };

  return (
    <div className="dashboard-wrapper">
      {/* Navigation Header */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          <div className="nav-brand">
            <div className="brand-icon">
              <Activity />
            </div>
            <h1 className="brand-title">BusTracker Pro</h1>
          </div>
          
          <div className="nav-actions">
            <button className="notification-btn">
              <Bell />
              {notifications > 0 && <span className="notification-badge">{notifications}</span>}
            </button>
            <div className="user-avatar">
              <span>AD</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="header-content">
            <h2 className="dashboard-title">Fleet Dashboard</h2>
            <p className="dashboard-subtitle">Real-time monitoring and management of your bus fleet</p>
          </div>
          
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total">
                <Activity />
              </div>
              <div className="stat-content">
                <span className="stat-number">{stats.total}</span>
                <span className="stat-label">Total Buses</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon active">
                <MapPin />
              </div>
              <div className="stat-content">
                <span className="stat-number">{stats.active}</span>
                <span className="stat-label">Active Routes</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon success">
                <CheckCircle />
              </div>
              <div className="stat-content">
                <span className="stat-number">{stats.onTime}</span>
                <span className="stat-label">On Time</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon warning">
                <AlertTriangle />
              </div>
              <div className="stat-content">
                <span className="stat-number">{stats.delayed}</span>
                <span className="stat-label">Delayed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="controls-section">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search buses or routes..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-controls">
            <div className="filter-group">
              <Filter className="filter-icon" />
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="On Time">On Time</option>
                <option value="Delayed">Delayed</option>
                <option value="In Service">In Service</option>
                <option value="Out of Service">Out of Service</option>
              </select>
            </div>
            
            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
              <button
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Bus Grid/List */}
        <div className={`buses-container ${viewMode}`}>
          {filteredBuses.map((bus) => (
            <div key={bus.id} className="bus-card">
              <div className="bus-card-header">
                <div className="bus-info">
                  <h3 className="bus-title">{bus.name}</h3>
                  <span className="bus-route">{bus.route}</span>
                </div>
                <div className={`bus-status ${getStatusClass(bus.status)}`}>
                  {getStatusIcon(bus.status)}
                  <span>{bus.status}</span>
                </div>
              </div>

              <div className="bus-details">
                <div className="detail-item">
                  <MapPin className="detail-icon" />
                  <span>Next: {bus.nextStop}</span>
                </div>
                <div className="detail-item">
                  <Clock className="detail-icon" />
                  <span>ETA: {bus.eta}</span>
                </div>
                <div className="detail-item">
                  <Users className="detail-icon" />
                  <span>{bus.passengers}/{bus.capacity} passengers</span>
                </div>
              </div>

              {/* Occupancy Bar */}
              <div className="occupancy-section">
                <div className="occupancy-header">
                  <span className="occupancy-label">Occupancy</span>
                  <span className="occupancy-percentage">
                    {Math.round((bus.passengers / bus.capacity) * 100)}%
                  </span>
                </div>
                <div className="occupancy-bar">
                  <div 
                    className={`occupancy-fill ${getOccupancyLevel(bus.passengers, bus.capacity)}`}
                    style={{ width: `${(bus.passengers / bus.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Map Section */}
              <div className="bus-map-container">
                <div className="map-placeholder">
                  <MapPin style={{ width: '2rem', height: '2rem', color: 'rgba(255, 255, 255, 0.5)' }} />
                  <span>Live Map - Bus {bus.id}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bus-actions">
                <button className="action-btn primary">
                  View Details
                </button>
                <button className="action-btn secondary">
                  Contact Driver
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredBuses.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">
              <Search />
            </div>
            <h3>No buses found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow-x: hidden;
        }

        .dashboard-wrapper {
          min-height: 100vh;
          width: 100vw;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding: 0;
          margin: 0;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow-y: auto;
        }

        .dashboard-nav {
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

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .notification-btn {
          position: relative;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          padding: 0.75rem;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .notification-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .notification-badge {
          position: absolute;
          top: -0.25rem;
          right: -0.25rem;
          background: #ef4444;
          color: white;
          font-size: 0.75rem;
          padding: 0.125rem 0.375rem;
          border-radius: 9999px;
          min-width: 1.25rem;
          text-align: center;
        }

        .user-avatar {
          width: 2.5rem;
          height: 2.5rem;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .dashboard-header {
          margin-bottom: 2rem;
        }

        .header-content {
          text-align: center;
          margin-bottom: 2rem;
        }

        .brand-icon {
          width: 2.5rem;
          height: 2.5rem;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .brand-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin: 0;
        }

        .dashboard-title {
          font-size: 3rem;
          font-weight: 800;
          color: white;
          margin: 0 0 0.5rem 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .dashboard-subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .stat-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-icon.total { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
        .stat-icon.active { background: linear-gradient(135deg, #06b6d4, #0891b2); }
        .stat-icon.success { background: linear-gradient(135deg, #10b981, #059669); }
        .stat-icon.warning { background: linear-gradient(135deg, #f59e0b, #d97706); }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 0.25rem;
        }

        .controls-section {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .search-container {
          position: relative;
          flex: 1;
          min-width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.6);
          width: 1.25rem;
          height: 1.25rem;
        }

        .search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.75rem;
          padding: 1rem 1rem 1rem 3rem;
          color: white;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .search-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.15);
        }

        .filter-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-icon {
          color: rgba(255, 255, 255, 0.7);
          width: 1.25rem;
          height: 1.25rem;
        }

        .filter-select {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          color: white;
          font-size: 0.875rem;
          min-width: 140px;
        }

        .filter-select option {
          background: #1f2937;
          color: white;
        }

        .view-toggle {
          display: flex;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .toggle-btn {
          padding: 0.75rem 1rem;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .toggle-btn.active {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .buses-container {
          display: grid;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .buses-container.grid {
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        }

        .buses-container.list {
          grid-template-columns: 1fr;
        }

        .bus-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .bus-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .bus-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .bus-info h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin: 0 0 0.25rem 0;
        }

        .bus-route {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
        }

        .bus-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .status-icon {
          width: 1rem;
          height: 1rem;
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

        .bus-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
        }

        .detail-icon {
          width: 1.125rem;
          height: 1.125rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .occupancy-section {
          margin-bottom: 1.5rem;
        }

        .occupancy-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .occupancy-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
        }

        .occupancy-percentage {
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .occupancy-bar {
          width: 100%;
          height: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.25rem;
          overflow: hidden;
        }

        .occupancy-fill {
          height: 100%;
          border-radius: 0.25rem;
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

        .bus-map-container {
          height: 200px;
          border-radius: 0.75rem;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .map-placeholder {
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          border: 1px dashed rgba(255, 255, 255, 0.2);
        }

        .bus-actions {
          display: flex;
          gap: 0.75rem;
        }

        .action-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
        }

        .action-btn.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
        }

        .action-btn.secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .action-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .no-results-icon {
          width: 4rem;
          height: 4rem;
          margin: 0 auto 1rem;
          opacity: 0.5;
        }

        .no-results h3 {
          font-size: 1.5rem;
          margin: 0 0 0.5rem 0;
          color: white;
        }

        .no-results p {
          margin: 0;
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1rem;
          }

          .dashboard-title {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .controls-section {
            flex-direction: column;
            align-items: stretch;
          }

          .search-container {
            min-width: auto;
          }

          .filter-controls {
            justify-content: space-between;
          }

          .buses-container.grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}