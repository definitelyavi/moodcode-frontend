# MoodCode Frontend

An intelligent mood detection system that analyzes Git commit patterns and generates personalized SoundCloud playlists to match your coding state.

**[Live Application](https://moodcode-frontend.vercel.app)** | **[Backend Repository](https://github.com/definitelyavi/moodcode-backend)**

## Features

- **Intelligent Mood Detection**: Analyzes commit messages, timestamps, and development patterns using custom sentiment analysis algorithms
- **SoundCloud Integration**: OAuth 2.0 authentication with playlist creation and curation
- **Real-time Analysis**: Processes recent commits to determine current coding mood
- **5 Mood Categories**: Frustrated, Excited, Satisfied, Tired, and Euphoric with corresponding music styles
- **Responsive Design**: Modern interface built with React and Tailwind CSS

## Tech Stack

- **Frontend**: React 18, React Router, Tailwind CSS
- **APIs**: GitHub REST API, SoundCloud API
- **Authentication**: OAuth 2.0 with PKCE flow
- **Deployment**: Vercel

## How It Works

1. **Repository Analysis**: Enter any GitHub repository URL for commit analysis
2. **Mood Detection**: Custom algorithms analyze commit sentiment, timing, and patterns
3. **Music Matching**: Maps detected mood to appropriate music genres and energy levels
4. **Playlist Generation**: Creates personalized SoundCloud playlists via authenticated API calls

## Architecture

The application features a clean component structure with custom hooks for SoundCloud integration, dedicated services for GitHub API communication, and sophisticated sentiment analysis algorithms that consider multiple factors including keyword analysis, temporal patterns, and message structure.

## Quick Start

```bash
git clone https://github.com/definitelyavi/moodcode-frontend.git
cd moodcode-frontend
npm install
npm start
```

Requires environment variables for API integration. See `.env.example` for configuration.

## Author

**Jashandeep Singh** [@definitelyavi](https://github.com/definitelyavi)

---

*Intelligent music curation for developers*
