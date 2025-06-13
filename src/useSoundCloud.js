import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://moodcode-backend-production.up.railway.app' 
    : 'http://localhost:3001');

export const useSoundCloud = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('soundcloud_token');
    const userData = localStorage.getItem('soundcloud_user');
    
    if (token && userData) {
      setAccessToken(token);
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []);
  
  const getAuthUrl = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/soundcloud/url`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get authorization URL');
      }
      
      return data.authUrl;
    } catch (err) {
      console.error('Error getting auth URL:', err);
      throw err;
    }
  };
  
  const authenticate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/soundcloud/url`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get authorization URL');
      }
      
      if (data.state) {
        sessionStorage.setItem('soundcloud_oauth_state', data.state);
      }
      
      window.location.href = data.authUrl;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };
  
  const handleCallback = async (code, state) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const storedState = sessionStorage.getItem('soundcloud_oauth_state');
      if (storedState && state !== storedState) {
        throw new Error('State parameter mismatch. This may be a security issue.');
      }
      
      sessionStorage.removeItem('soundcloud_oauth_state');
      
      const response = await fetch(`${API_BASE_URL}/auth/soundcloud/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to exchange code for token');
      }
      
      setAccessToken(data.access_token);
      setUser(data.user);
      setIsAuthenticated(true);
      
      localStorage.setItem('soundcloud_token', data.access_token);
      localStorage.setItem('soundcloud_user', JSON.stringify(data.user));
      if (data.refresh_token) {
        localStorage.setItem('soundcloud_refresh_token', data.refresh_token);
      }
      
      setIsLoading(false);
      return data;
      
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };
  
  const logout = () => {
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPlaylist(null);
    setError(null);
    
    localStorage.removeItem('soundcloud_token');
    localStorage.removeItem('soundcloud_user');
  };
  
  const generatePlaylist = async (mood, analysisData = {}) => {
    if (!isAuthenticated || !accessToken) {
      throw new Error('Please authenticate with SoundCloud first');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/soundcloud/playlist`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood, analysisData }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create playlist');
      }
      
      const playlistWithTimestamp = {
        ...data.playlist,
        generatedAt: new Date().toISOString()
      };
      
      setCurrentPlaylist(playlistWithTimestamp);
      setIsLoading(false);
      
      return playlistWithTimestamp;
      
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };
  
  const searchTracks = async (query, limit = 20) => {
    if (!isAuthenticated || !accessToken) {
      throw new Error('Please authenticate first to search tracks');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/soundcloud/search?q=${encodeURIComponent(query)}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to search tracks');
      }
      
      return data.tracks;
      
    } catch (err) {
      console.error('Search error:', err);
      throw err;
    }
  };
  
  const getUserPlaylists = async () => {
    if (!isAuthenticated || !accessToken) {
      throw new Error('Please authenticate first');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/soundcloud/playlists`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get playlists');
      }
      
      return data.playlists;
      
    } catch (err) {
      console.error('Error getting playlists:', err);
      throw err;
    }
  };
  
  const clearPlaylist = () => {
    setCurrentPlaylist(null);
    setError(null);
  };
  
  const sharePlaylist = (playlist) => {
    if (!playlist) return;
    
    const shareText = `🎵 Check out my ${playlist.mood} coding playlist: "${playlist.title}" \n\nGenerated by MoodCode - AI-powered playlist generation!\n\n${playlist.permalink_url}`;
    
    if (navigator.share) {
      navigator.share({
        title: playlist.title,
        text: shareText,
        url: playlist.permalink_url,
      });
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Playlist link copied to clipboard!');
      }).catch(() => {
        prompt('Copy this playlist link:', shareText);
      });
    }
  };
  
  const openInSoundCloud = (playlist) => {
    if (!playlist?.permalink_url) return;
    
    const justCreated = playlist.generatedAt && 
      (Date.now() - new Date(playlist.generatedAt).getTime()) < 30000;
    
    if (justCreated) {
      setTimeout(() => {
        window.open(playlist.permalink_url, '_blank');
      }, 20000);
    } else {
      window.open(playlist.permalink_url, '_blank');
    }
  };
  
  const getCurrentUser = async () => {
    if (!isAuthenticated || !accessToken) {
      throw new Error('Please authenticate first');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/soundcloud/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get user info');
      }
      
      setUser(data.user);
      return data.user;
      
    } catch (err) {
      console.error('Error getting user info:', err);
      throw err;
    }
  };
  
  return {
    isLoading,
    currentPlaylist,
    error,
    accessToken,
    user,
    isAuthenticated,
    authenticate,
    handleCallback,
    logout,
    generatePlaylist,
    clearPlaylist,
    sharePlaylist,
    openInSoundCloud,
    searchTracks,
    getUserPlaylists,
    getCurrentUser,
    getAuthUrl,
    isDemo: false
  };
};