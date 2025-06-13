import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSoundCloud } from './useSoundCloud';

const CallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleCallback } = useSoundCloud();
  const [status, setStatus] = useState('Processing SoundCloud Authorization...');
  const [error, setError] = useState(null);
  const hasProcessed = useRef(false);

  const processCallback = useCallback(async () => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;
    
    try {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      
      if (error) {
        throw new Error(`Authorization failed: ${error}`);
      }
      
      if (!code) {
        throw new Error('No authorization code received');
      }
      
      if (!state) {
        throw new Error('No state parameter received (PKCE required)');
      }
      
      setStatus('Exchanging authorization code with PKCE...');
      await handleCallback(code, state);
      setStatus('Success! Redirecting...');
      
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
      
    } catch (err) {
      console.error('Callback error:', err);
      setError(err.message);
      setStatus('Authorization failed');
      
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
    }
  }, [searchParams, handleCallback, navigate]);

  useEffect(() => {
    processCallback();
  }, [processCallback]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        {!error ? (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        ) : (
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
        )}
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {status}
        </h2>
        
        {error ? (
          <div className="text-red-600 mb-4">
            <p className="font-medium">Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <p className="text-gray-600">This window will close automatically.</p>
        )}
        
        <div className="mt-6">
          <button
            onClick={() => navigate('/', { replace: true })}
            className="text-orange-600 hover:text-orange-700 text-sm"
          >
            Return to MoodCode →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallbackPage;