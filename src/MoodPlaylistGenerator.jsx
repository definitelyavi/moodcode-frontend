import React, { useState, useRef } from 'react';
import { ArrowRight, ExternalLink, Play, Share, Music2, LogIn, LogOut, User, RotateCcw } from 'lucide-react';
import { fetchGitHubCommits, isValidGitHubUrl } from './githubApi.js';
import { analyzeSentiment, analyzeMoodTrend } from './sentimentAnalysis.js';
import { useSoundCloud } from './useSoundCloud.js';
import DemoBanner from './DemoBanner.jsx';

const MoodPlaylistGenerator = () => {
  const [commits, setCommits] = useState([]);
  const [currentMood, setCurrentMood] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [error, setError] = useState('');
  
  const soundCloudHook = useSoundCloud();
  const { 
    isLoading, 
    currentPlaylist, 
    isAuthenticated, 
    user,
    authenticate,
    logout,
    generatePlaylist, 
    sharePlaylist, 
    openInSoundCloud,
    error: soundCloudError,
    isDemo,
    clearPlaylist
  } = soundCloudHook;

  const formRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start',
      inline: 'nearest' 
    });
  };

  const moodMusicMap = {
    frustrated: { genre: "Heavy & Intense", energy: "High", emoji: "😤" },
    excited: { genre: "Upbeat & Electronic", energy: "Very High", emoji: "🎉" },
    satisfied: { genre: "Indie & Alternative", energy: "Medium", emoji: "😌" },
    tired: { genre: "Ambient & Chill", energy: "Low", emoji: "😴" },
    euphoric: { genre: "Euphoric & Uplifting", energy: "Maximum", emoji: "🚀" }
  };

  const handleSoundCloudAuth = async () => {
    try {
      setError('');
      await authenticate();
    } catch (error) {
      setError(`Authentication failed: ${error.message}`);
    }
  };

  const analyzeRecentMood = async () => {
    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }
    
    if (!isValidGitHubUrl(repoUrl)) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }
    
    setIsAnalyzing(true);
    setError('');
    
    try {
      const commitsData = await fetchGitHubCommits(repoUrl, githubToken);
      const recentCommits = commitsData.slice(0, 5);
      const moodAnalysis = analyzeMoodTrend(recentCommits);
      
      setCurrentMood(moodAnalysis.overallMood);
      setCommits(recentCommits.map(commit => ({
        ...commit,
        moodAnalysis: analyzeSentiment(commit.message, commit.date, commit.author)
      })));
      
      setIsAnalyzing(false);
    } catch (err) {
      setError(err.message);
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setCurrentMood('');
    setCommits([]);
    clearPlaylist?.();
    setRepoUrl('');
    setGithubToken('');
    setError('');
    setTimeout(() => scrollToSection(formRef), 100);
  };

  const handleGeneratePlaylist = async () => {
    if (!currentMood) {
      setError('Please analyze a repository first');
      return;
    }

    if (!isAuthenticated) {
      setError('Please authenticate with SoundCloud first');
      return;
    }

    try {
      await generatePlaylist(currentMood, { commits });
    } catch (error) {
      setError(`Failed to generate playlist: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-16">
      {isDemo && <DemoBanner />}
      
      <div className="mb-12 md:mb-20 opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-5xl font-light leading-tight tracking-tight mb-4 md:mb-6">
            MoodCode is an intelligent<br className="hidden md:block" />
            <span className="md:hidden"> mood detection system that analyzes your coding patterns.</span>
            <span className="hidden md:block">mood detection system that<br />
            analyzes your coding patterns.</span>
          </h1>
          <p className="text-base md:text-lg text-neutral-600 max-w-2xl leading-relaxed">
            By examining your Git commit messages and development patterns, 
            it generates personalized SoundCloud playlists that match your current coding state.
          </p>
        </div>
        
        <div className="mb-6 md:mb-8 p-4 border border-neutral-200 bg-white rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <Music2 className="w-5 h-5 text-orange-500" />
              <div>
                <h3 className="font-medium text-sm">SoundCloud Integration</h3>
                {isAuthenticated ? (
                  <p className="text-xs text-green-600 flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>Connected as {user?.username}</span>
                  </p>
                ) : (
                  <p className="text-xs text-neutral-500">Connect to create playlists</p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-3 py-1 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              ) : (
                <button
                  onClick={handleSoundCloudAuth}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Connect SoundCloud</span>
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-sm text-neutral-500 mb-6 md:mb-8">
          Looking for the perfect coding soundtrack? Here's your
          <span className="font-medium text-neutral-900 mx-1">ANALYSIS</span>
        </div>
      </div>

      <div ref={formRef} className="mb-12 md:mb-20 opacity-0 animate-[fadeIn_0.8s_ease-out_0.2s_forwards]">
        <div className="border border-neutral-200 bg-white p-4 md:p-8 transition-all duration-300 hover:shadow-sm">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                GitHub Repository URL
              </label>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full px-0 py-3 text-base md:text-lg border-0 border-b border-neutral-200 focus:border-neutral-900 outline-none bg-transparent placeholder-neutral-400 transition-colors duration-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                GitHub Token <span className="font-normal text-neutral-500">(optional)</span>
              </label>
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-0 py-3 text-base md:text-lg border-0 border-b border-neutral-200 focus:border-neutral-900 outline-none bg-transparent placeholder-neutral-400 transition-colors duration-300"
              />
              <p className="text-xs text-neutral-500 mt-2">
                For private repositories and higher rate limits
              </p>
            </div>
            
            {(error || soundCloudError) && (
              <div className="py-4 text-sm text-neutral-600 border-l-2 border-neutral-300 pl-4">
                {error || soundCloudError}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
              <button
                onClick={analyzeRecentMood}
                disabled={isAnalyzing}
                className="inline-flex items-center justify-center space-x-3 text-base md:text-lg font-medium text-neutral-900 hover:text-neutral-600 transition-all duration-300 disabled:opacity-50 group"
              >
                <span>{isAnalyzing ? "Analyzing commits..." : "Analyze Repository"}</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              
              {(commits.length > 0 || currentPlaylist) && (
                <button
                  onClick={resetAnalysis}
                  className="inline-flex items-center justify-center space-x-2 text-sm text-neutral-600 hover:text-neutral-900 transition-all duration-300 group"
                >
                  <RotateCcw className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-90" />
                  <span>Analyze Another Repository</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {commits.length > 0 && (
        <div className="mb-12 md:mb-20 opacity-0 animate-[fadeIn_0.8s_ease-out_0.4s_forwards]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <div>
              <h3 className="text-lg md:text-xl font-medium mb-6 md:mb-8 tracking-tight">Recent Commits</h3>
              <div className="space-y-4 md:space-y-6">
                {commits.map((commit, index) => (
                  <div key={index} className="pb-4 md:pb-6 border-b border-neutral-100 last:border-0 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]" style={{animationDelay: `${0.6 + index * 0.1}s`}}>
                    <p className="text-sm md:text-base leading-relaxed mb-2">
                      {commit.message}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs text-neutral-500">
                      <span>{commit.timestamp}</span>
                      {commit.author && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[120px] md:max-w-none">{commit.author}</span>
                        </>
                      )}
                      {commit.moodAnalysis && (
                        <>
                          <span>•</span>
                          <span className="font-medium text-neutral-700 flex items-center space-x-1">
                            <span>{moodMusicMap[commit.moodAnalysis.mood]?.emoji}</span>
                            <span>{commit.moodAnalysis.mood}</span>
                          </span>
                          <span>{Math.round(commit.moodAnalysis.confidence * 100)}% confident</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg md:text-xl font-medium mb-6 md:mb-8 tracking-tight">Mood Analysis</h3>
              
              {currentMood && (
                <div className="mb-6 md:mb-8 pb-4 md:pb-6 border-b border-neutral-100 opacity-0 animate-[fadeIn_0.8s_ease-out_0.6s_forwards]">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-xl md:text-2xl">{moodMusicMap[currentMood]?.emoji}</span>
                    <div>
                      <h4 className="font-medium capitalize text-base md:text-lg">
                        {currentMood} Mood Detected
                      </h4>
                      <p className="text-xs md:text-sm text-neutral-600">
                        {moodMusicMap[currentMood]?.genre} • {moodMusicMap[currentMood]?.energy} Energy
                      </p>
                    </div>
                  </div>
                  
                  {!currentPlaylist && (
                    <button
                      onClick={handleGeneratePlaylist}
                      disabled={!isAuthenticated || isLoading || currentPlaylist}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-4 md:px-6 py-2 md:py-3 bg-orange-500 text-white text-sm md:text-base font-medium rounded-lg hover:bg-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          <span>Creating playlist...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Generate SoundCloud Playlist</span>
                        </>
                      )}
                    </button>
                  )}
                  
                  {!isAuthenticated && (
                    <p className="text-xs text-neutral-500 mt-2">
                      Connect to SoundCloud above to create playlists
                    </p>
                  )}
                </div>
              )}

              {currentPlaylist && (
                <div className="mb-6 md:mb-8 opacity-0 animate-[fadeIn_0.8s_ease-out_0.8s_forwards]">
                  <div className="bg-neutral-100 rounded-lg p-3 md:p-4 mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-3">
                        <Music2 className="w-4 md:w-5 h-4 md:h-5 text-orange-500" />
                        <div>
                          <h5 className="font-medium text-sm">{currentPlaylist.title}</h5>
                          <p className="text-xs text-neutral-500">
                            {currentPlaylist.tracks?.length || 0} tracks • SoundCloud Playlist
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => sharePlaylist(currentPlaylist)}
                          className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                          title="Share playlist"
                        >
                          <Share className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openInSoundCloud(currentPlaylist)}
                          className="p-2 text-neutral-600 hover:text-orange-500 transition-colors"
                          title="Open in SoundCloud"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded p-3 text-sm">
                      <p className="text-neutral-600 mb-2">{currentPlaylist.description}</p>
                      {currentPlaylist.permalink_url && (
                        <a 
                          href={currentPlaylist.permalink_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:text-orange-600 transition-colors"
                        >
                          View on SoundCloud →
                        </a>
                      )}
                    </div>
                  </div>

                  {currentPlaylist.tracks?.length > 0 && (
                    <div className="space-y-2 md:space-y-3">
                      <h6 className="text-sm font-medium text-neutral-700 mb-3">Track List:</h6>
                      {currentPlaylist.tracks.map((track, index) => (
                        <div key={track.id || index} className="flex items-center space-x-3 md:space-x-4 py-2 px-2 md:px-3 bg-neutral-50 rounded opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]" style={{animationDelay: `${1.0 + index * 0.05}s`}}>
                          <span className="text-xs md:text-sm text-neutral-400 w-5 md:w-6">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs md:text-sm font-medium truncate">{track.title}</div>
                            <div className="text-xs text-neutral-500 truncate">
                              {track.user?.username || 'Unknown Artist'}
                            </div>
                          </div>
                          <div className="text-xs text-neutral-400 flex-shrink-0">
                            {track.duration ? Math.floor(track.duration / 60000) + ':' + String(Math.floor((track.duration % 60000) / 1000)).padStart(2, '0') : '--:--'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {currentMood && (
        <div className="mb-12 md:mb-20 opacity-0 animate-[fadeIn_0.8s_ease-out_1.2s_forwards]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 py-6 md:py-8 border-t border-neutral-200">
            {[
              { label: "Commits", value: commits.length },
              { label: "Tracks", value: currentPlaylist?.tracks?.length || 0 },
              { label: "Energy", value: moodMusicMap[currentMood]?.energy },
              { label: "Platform", value: "SoundCloud" }
            ].map((stat, index) => (
              <div key={index} className="text-center opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]" style={{animationDelay: `${1.4 + index * 0.1}s`}}>
                <div className="text-xl md:text-2xl font-light mb-1">{stat.value}</div>
                <div className="text-xs text-neutral-500 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        @media (max-width: 640px) {
          input[type="text"], input[type="password"] {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default MoodPlaylistGenerator;