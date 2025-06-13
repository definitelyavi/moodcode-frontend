const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://moodcode-backend-production.up.railway.app' 
    : 'http://localhost:3001');

class ApiService {
  static async getSoundCloudAuthUrl() {
    const response = await fetch(`${API_BASE_URL}/auth/soundcloud/url`);
    if (!response.ok) {
      throw new Error('Failed to get auth URL');
    }
    return response.json();
  }
  
  static async exchangeCodeForToken(code) {
    const response = await fetch(`${API_BASE_URL}/auth/soundcloud/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to exchange code for token');
    }
    
    return response.json();
  }
  
  static async getCurrentUser(accessToken) {
    const response = await fetch(`${API_BASE_URL}/api/soundcloud/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get user info');
    }
    
    return response.json();
  }
  
  static async createPlaylist(accessToken, mood, analysisData) {
    const response = await fetch(`${API_BASE_URL}/api/soundcloud/playlist`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mood, analysisData }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create playlist');
    }
    
    return response.json();
  }
  
  static async searchTracks(query, limit = 20) {
    const response = await fetch(`${API_BASE_URL}/api/soundcloud/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to search tracks');
    }
    
    return response.json();
  }
  
  static async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default ApiService;