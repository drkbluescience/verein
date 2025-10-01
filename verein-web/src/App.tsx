import React, { useState, useEffect } from 'react';
import './App-new.css';

interface HealthStatus {
  status: string;
  timestamp: string;
}

function App() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkApiHealth = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Checking API health...');
      const response = await fetch('http://localhost:5103/api/health');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const health = await response.json();
      console.log('API health response:', health);

      setHealthStatus(health);
      setIsConnected(true);
    } catch (err) {
      console.error('API Health Check failed:', err);
      setIsConnected(false);
      setHealthStatus(null);
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkApiHealth();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏛️ Verein Web App</h1>
        <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
          {loading ? '⏳ Bağlanıyor...' : isConnected ? '🟢 API Verbunden' : '🔴 API Getrennt'}
        </div>
        {healthStatus && (
          <div className="health-info">
            Status: {healthStatus.status} | {new Date(healthStatus.timestamp).toLocaleString()}
          </div>
        )}
        {error && (
          <div className="error">
            ❌ Hata: {error}
          </div>
        )}
      </header>

      <main className="main-content">
        {!isConnected && !loading ? (
          <div className="error-message">
            <h2>⚠️ Backend API nicht erreichbar</h2>
            <p>Stellen Sie sicher, dass die .NET API auf http://localhost:5103 läuft</p>
            <button onClick={checkApiHealth} className="retry-btn" disabled={loading}>
              🔄 Erneut versuchen
            </button>
          </div>
        ) : (
          <div className="success-message">
            <h2>✅ Web App Başarıyla Çalışıyor!</h2>
            <p>Backend API bağlantısı kuruldu. Verein yönetim özellikleri yakında eklenecek.</p>

            <div className="buttons">
              <button
                className="test-btn"
                onClick={() => alert('Test button çalışıyor!')}
              >
                🧪 Test Button
              </button>

              <button
                className="refresh-btn"
                onClick={checkApiHealth}
                disabled={loading}
              >
                🔄 API Yenile
              </button>
            </div>

            <div className="features">
              <p><strong>Web App Özellikleri:</strong></p>
              <ul>
                <li>✅ React + TypeScript</li>
                <li>✅ Responsive tasarım</li>
                <li>✅ Backend API entegrasyonu</li>
                <li>✅ Modern web teknolojileri</li>
                <li>✅ Cross-platform uyumluluk</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>🌐 Web App - Tarayıcınızda çalışır</p>
      </footer>
    </div>
  );
}

export default App;
