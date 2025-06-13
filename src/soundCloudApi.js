const SOUNDCLOUD_CLIENT_ID = 'your_soundcloud_client_id';

export class SoundCloudAPI {
  constructor(clientId = SOUNDCLOUD_CLIENT_ID) {
    this.clientId = clientId;
    this.baseUrl = 'https://api.soundcloud.com';
  }
  
  async request(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append('client_id', this.clientId);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`SoundCloud API error: ${response.status}`);
    }
    
    return response.json();
  }
  
  async searchTracks(query, limit = 20) {
    return this.request('/tracks', {
      q: query,
      limit: limit.toString()
    });
  }
  
  async getPlaylist(playlistId) {
    return this.request(`/playlists/${playlistId}`);
  }
  
  async searchPlaylists(query, limit = 10) {
    return this.request('/playlists', {
      q: query,
      limit: limit.toString()
    });
  }
}

export const moodToSearchTerms = {
  frustrated: {
    genre: "Heavy & Intense",
    energy: "High",
    searchTerms: ["heavy metal coding", "intense electronic", "aggressive beats", "hard rock programming"],
    tags: ["metal", "hard-rock", "aggressive", "intense"]
  },
  excited: {
    genre: "Upbeat & Electronic",
    energy: "Very High", 
    searchTerms: ["upbeat electronic", "energetic dance", "uplifting house", "happy coding"],
    tags: ["electronic", "dance", "uplifting", "energetic"]
  },
  satisfied: {
    genre: "Indie & Alternative",
    energy: "Medium",
    searchTerms: ["indie rock", "alternative coding", "chill indie", "relaxed alternative"],
    tags: ["indie", "alternative", "chill", "relaxed"]
  },
  tired: {
    genre: "Ambient & Chill",
    energy: "Low",
    searchTerms: ["ambient chill", "lo-fi hip hop", "relaxing instrumental", "sleepy beats"],
    tags: ["ambient", "lo-fi", "chill", "relaxing"]
  },
  euphoric: {
    genre: "Euphoric & Uplifting",
    energy: "Maximum",
    searchTerms: ["euphoric trance", "uplifting electronic", "progressive house", "epic instrumental"],
    tags: ["trance", "euphoric", "uplifting", "epic"]
  }
};

export const curatedPlaylists = {
  frustrated: {
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1623790151&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    title: "Frustrated Coding - Heavy & Intense",
    tracks: [
      { title: "Intense Electronic Beats", artist: "Various Artists", duration: "4:23" },
      { title: "Heavy Bass Programming", artist: "Electronic Mix", duration: "3:45" },
      { title: "Aggressive Energy Tracks", artist: "High Energy", duration: "5:12" }
    ]
  },
  excited: {
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1623790152&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    title: "Excited Coding - Upbeat & Electronic",
    tracks: [
      { title: "Energetic Coding Beats", artist: "Upbeat Mix", duration: "3:30" },
      { title: "Happy Programming Vibes", artist: "Positive Energy", duration: "4:15" },
      { title: "Celebration Tracks", artist: "Success Sounds", duration: "3:58" }
    ]
  },
  satisfied: {
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1623790153&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    title: "Satisfied Coding - Indie & Alternative",
    tracks: [
      { title: "Clean Code Vibes", artist: "Indie Mix", duration: "4:02" },
      { title: "Refactored Melodies", artist: "Alternative Coding", duration: "3:41" },
      { title: "Peaceful Programming", artist: "Calm Indie", duration: "4:28" }
    ]
  },
  tired: {
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/318136141&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    title: "Tired Coding - Ambient & Chill",
    tracks: [
      { title: "Late Night Coding", artist: "Lo-Fi Developers", duration: "5:15" },
      { title: "Sleepy Debugging", artist: "Ambient Code", duration: "6:23" },
      { title: "Calm Programming", artist: "Chill Beats", duration: "4:45" }
    ]
  },
  euphoric: {
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1623790155&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
    title: "Euphoric Coding - Uplifting & Epic",
    tracks: [
      { title: "Epic Code Victory", artist: "Triumphant Beats", duration: "5:45" },
      { title: "Breakthrough Moment", artist: "Epic Mix", duration: "4:33" },
      { title: "Success Celebration", artist: "Victory Sounds", duration: "3:52" }
    ]
  }
};

export const generateSoundCloudEmbed = (playlistUrl, autoPlay = false) => {
  const params = new URLSearchParams({
    url: playlistUrl,
    color: '#171717',
    auto_play: autoPlay.toString(),
    hide_related: 'true',
    show_comments: 'false',
    show_user: 'true',
    show_reposts: 'false',
    show_teaser: 'false'
  });
  
  return `https://w.soundcloud.com/player/?${params.toString()}`;
};

export const searchMoodTracks = async (mood, limit = 10) => {
  try {
    return curatedPlaylists[mood] || curatedPlaylists.satisfied;
  } catch (error) {
    console.error('Failed to search SoundCloud:', error);
    return curatedPlaylists[mood] || curatedPlaylists.satisfied;
  }
};

export const getTrackEmbedUrl = (trackId) => {
  return `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}&color=%23171717&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
};