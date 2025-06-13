const API_HEADERS = {
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'MoodPlaylistGenerator/1.0'
};

export const fetchGitHubCommits = async (repoUrl, token = '', limit = 10) => {
  try {
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      throw new Error('Invalid GitHub URL format. Expected: https://github.com/owner/repo');
    }
    
    const [, owner, repo] = match;
    const cleanRepo = repo.replace('.git', '');
    const apiUrl = `https://api.github.com/repos/${owner}/${cleanRepo}/commits?per_page=${limit}`;
    
    const headers = { ...API_HEADERS };
    if (token) headers['Authorization'] = `token ${token}`;
    
    const response = await fetch(apiUrl, { headers });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      switch (response.status) {
        case 404:
          throw new Error('Repository not found. Check the URL or make sure it\'s public.');
        case 403:
          throw new Error('Rate limit exceeded or access denied. Try adding a GitHub token.');
        case 401:
          throw new Error('Invalid GitHub token.');
        default:
          throw new Error(`GitHub API error: ${response.status} ${errorData.message || ''}`);
      }
    }
    
    const commits = await response.json();
    
    return commits.map(commit => ({
      message: commit.commit.message.split('\n')[0],
      fullMessage: commit.commit.message,
      timestamp: new Date(commit.commit.author.date).toLocaleString(),
      author: commit.commit.author.name,
      email: commit.commit.author.email,
      sha: commit.sha.substring(0, 7),
      url: commit.html_url,
      date: commit.commit.author.date
    }));
    
  } catch (error) {
    throw new Error(`Failed to fetch commits: ${error.message}`);
  }
};

export const getRepositoryInfo = async (repoUrl, token = '') => {
  try {
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      throw new Error('Invalid GitHub URL format');
    }
    
    const [, owner, repo] = match;
    const cleanRepo = repo.replace('.git', '');
    
    const headers = { ...API_HEADERS };
    if (token) headers['Authorization'] = `token ${token}`;
    
    const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, { headers });
    
    if (!response.ok) {
      throw new Error(`Repository info fetch failed: ${response.status}`);
    }
    
    const repoData = await response.json();
    
    return {
      name: repoData.name,
      fullName: repoData.full_name,
      description: repoData.description,
      language: repoData.language,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      isPrivate: repoData.private,
      url: repoData.html_url
    };
    
  } catch (error) {
    throw new Error(`Failed to fetch repository info: ${error.message}`);
  }
};

export const isValidGitHubUrl = (url) => {
  const githubPattern = /^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/;
  return githubPattern.test(url.replace('.git', ''));
};

export const parseGitHubUrl = (url) => {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  
  return {
    owner: match[1],
    repo: match[2].replace('.git', '')
  };
};

export const checkRateLimit = async (token = '') => {
  try {
    const headers = { ...API_HEADERS };
    if (token) headers['Authorization'] = `token ${token}`;
    
    const response = await fetch('https://api.github.com/rate_limit', { headers });
    const data = await response.json();
    
    return {
      limit: data.rate.limit,
      remaining: data.rate.remaining,
      reset: new Date(data.rate.reset * 1000),
      hasToken: !!token
    };
  } catch (error) {
    console.warn('Could not check rate limit:', error);
    return null;
  }
};