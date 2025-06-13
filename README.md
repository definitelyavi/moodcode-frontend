# MoodCode Frontend

An intelligent mood detection system that analyzes your Git commit patterns and generates personalized SoundCloud playlists to match your current coding state.

## Overview

MoodCode bridges the gap between your development workflow and your music preferences. By analyzing the sentiment and patterns in your Git commits, it intelligently detects your coding mood and curates the perfect soundtrack for your development session.

## Features

- **Intelligent Mood Detection**: Analyzes commit messages, timestamps, and development patterns
- **SoundCloud Integration**: OAuth authentication and playlist creation
- **Real-time Analysis**: Processes recent commits to understand current coding state  
- **5 Mood Categories**: Frustrated, Excited, Satisfied, Tired, and Euphoric states
- **Responsive Design**: Modern, clean interface built with React and Tailwind CSS
- **GitHub API Integration**: Fetches and analyzes repository commit history
- **Personalized Playlists**: Generates mood-appropriate music collections

## Live Demo

**[View Live Application](https://moodcode-frontend.vercel.app)**

## Tech Stack

- **Frontend Framework**: React 18
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **APIs**: GitHub REST API, SoundCloud API
- **Authentication**: OAuth 2.0 with PKCE flow
- **Deployment**: Vercel
- **Backend**: Node.js (separate repository)

## Installation

### Prerequisites
- Node.js 16+ and npm
- GitHub account (for repository analysis)
- SoundCloud account (for playlist creation)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/definitelyavi/moodcode-frontend.git
   cd moodcode-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file
   cp .env.example .env
   ```
   
   Add your configuration:
   ```env
   REACT_APP_API_URL=http://localhost:3001
   REACT_APP_SOUNDCLOUD_CLIENT_ID=your_soundcloud_client_id
   ```

4. **Start development server**
   ```bash
   npm start
   ```

## How It Works

### 1. Repository Analysis
- Enter any public GitHub repository URL
- System fetches recent commit history via GitHub API
- Optional: Add GitHub token for private repos and higher rate limits

### 2. Mood Detection Algorithm
The system analyzes multiple factors:
- **Keyword Analysis**: Detects sentiment in commit messages
- **Temporal Patterns**: Considers commit timing and frequency  
- **Message Structure**: Analyzes length, punctuation, and formatting
- **Development Context**: Weighs recent vs. older commits

### 3. Music Matching
Each detected mood maps to specific music characteristics:
- **Frustrated** → Heavy & Intense (Metal, Hard Rock)
- **Excited** → Upbeat & Electronic (Dance, House)
- **Satisfied** → Indie & Alternative (Chill Indie)
- **Tired** → Ambient & Chill (Lo-fi, Ambient)
- **Euphoric** → Uplifting & Epic (Trance, Progressive)

### 4. Playlist Generation
- Authenticates with SoundCloud via OAuth
- Creates personalized playlist based on detected mood
- Curates tracks matching energy level and genre preferences

## Mood Detection Examples

```javascript
// Frustrated mood indicators
"fix critical bug in payment system"
"another damn deployment issue"
"urgent hotfix for production crash"

// Excited mood indicators  
"awesome new feature implementation!"
"finally got the algorithm working"
"amazing performance improvements"

// Satisfied mood indicators
"clean code refactor complete"
"improved error handling"
"optimized database queries"
```

## Architecture

```
src/
├── App.js                         # Main application router
├── App.css                        # Application styles
├── App.test.js                    # Application tests
├── index.js                       # React DOM entry point
├── index.css                      # Global styles
├── reportWebVitals.js            # Performance monitoring
├── setupTests.js                 # Test configuration
├── api.js                        # General API service
├── githubApi.js                  # GitHub API client
├── sentimentAnalysis.js          # Mood detection algorithms
├── soundCloudApi.js              # SoundCloud API utilities
├── useSoundCloud.js              # SoundCloud API integration hook
├── CallbackPage.jsx              # OAuth callback handler
├── DemoBanner.jsx                # Demo mode indicator
└── MoodPlaylistGenerator.jsx     # Main application component
```

## API Endpoints

The frontend communicates with these backend endpoints:

- `GET /auth/soundcloud/url` - Get OAuth authorization URL
- `POST /auth/soundcloud/token` - Exchange code for access token
- `POST /api/soundcloud/playlist` - Create mood-based playlist
- `GET /api/soundcloud/search` - Search SoundCloud tracks

## Testing

```bash
# Run test suite
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Manual Build
```bash
# Create production build
npm run build

# Serve locally to test
npx serve -s build
```

## Security & Privacy

- No sensitive data stored in frontend code
- OAuth tokens handled securely via backend
- Environment variables for all API configurations  
- GitHub tokens optional and never stored permanently
- PKCE flow implementation for enhanced security

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Future Enhancements

- [ ] Machine learning-based mood detection
- [ ] Spotify integration as alternative to SoundCloud
- [ ] Team mood analysis for collaborative projects
- [ ] Historical mood trends and analytics
- [ ] Custom mood-music mapping preferences
- [ ] Integration with other music platforms

## Known Issues

- SoundCloud API approval pending for full production features
- Rate limiting on GitHub API for unauthenticated requests
- OAuth flow requires HTTPS in production

## Author

**Jashandeep Singh** (definitelyavi)
- GitHub: [@definitelyavi](https://github.com/definitelyavi)
- Project Backend: [moodcode-backend](https://github.com/definitelyavi/moodcode-backend)

## Acknowledgments

- [Create React App](https://create-react-app.dev/) for the React boilerplate
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Lucide React](https://lucide.dev/) for the beautiful icons
- [SoundCloud](https://soundcloud.com/) for music API access
- [GitHub](https://github.com/) for repository data access

---

*Built with care for developers who code to music*
