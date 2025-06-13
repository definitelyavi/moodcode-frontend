const moodPatterns = {
  frustrated: {
    keywords: ['fix', 'bug', 'error', 'critical', 'broken', 'issue', 'fail', 'crash', 'urgent', 'hack', 'temp', 'wtf', 'damn'],
    phrases: ['this is broken', 'not working', 'quick fix', 'band-aid', 'dirty fix'],
    weight: 1.0
  },
  excited: {
    keywords: ['awesome', 'new', 'feature', 'add', 'implement', 'create', 'launch', 'release', 'amazing', 'cool', 'neat'],
    phrases: ['new feature', 'just added', 'finally working', 'looks great', 'super cool'],
    weight: 1.2
  },
  satisfied: {
    keywords: ['refactor', 'clean', 'improve', 'better', 'optimize', 'update', 'enhance', 'polish'],
    phrases: ['much better', 'cleaner code', 'good improvement', 'nice refactor'],
    weight: 1.0
  },
  tired: {
    keywords: ['late', 'small', 'minor', 'again', 'another', 'quick', 'tiny', 'wip', 'todo'],
    phrases: ['working late', 'small change', 'minor fix', 'quick update', 'will fix later'],
    weight: 0.8
  },
  euphoric: {
    keywords: ['breakthrough', 'finally', 'solved', 'success', 'complete', 'done', 'perfect', 'nailed'],
    phrases: ['finally works', 'major breakthrough', 'problem solved', 'it works'],
    weight: 1.5
  }
};

export const analyzeSentiment = (commitMessage, timestamp = null, author = null) => {
  const msg = commitMessage.toLowerCase();
  const scores = {};
  
  Object.keys(moodPatterns).forEach(mood => {
    scores[mood] = 0;
  });
  
  Object.entries(moodPatterns).forEach(([mood, pattern]) => {
    pattern.keywords.forEach(keyword => {
      if (msg.includes(keyword)) {
        scores[mood] += pattern.weight;
      }
    });
    
    pattern.phrases.forEach(phrase => {
      if (msg.includes(phrase)) {
        scores[mood] += pattern.weight * 1.5;
      }
    });
  });
  
  if (timestamp) {
    const hour = new Date(timestamp).getHours();
    
    if (hour >= 22 || hour <= 6) {
      scores.tired += 0.5;
      scores.frustrated += 0.3;
    }
    
    const day = new Date(timestamp).getDay();
    if (day === 0 || day === 6) {
      scores.excited += 0.2;
      scores.euphoric += 0.2;
    }
  }
  
  const words = msg.split(' ').length;
  if (words > 10) {
    scores.excited += 0.2;
  } else if (words <= 3) {
    scores.tired += 0.3;
  }
  
  const exclamations = (msg.match(/!/g) || []).length;
  if (exclamations > 0) {
    scores.excited += exclamations * 0.3;
    scores.euphoric += exclamations * 0.2;
  }
  
  const questions = (msg.match(/\?/g) || []).length;
  if (questions > 0) {
    scores.frustrated += questions * 0.2;
  }
  
  const dominantMood = Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b
  );
  
  return {
    mood: dominantMood,
    confidence: Math.max(...Object.values(scores)) / 3,
    scores,
    factors: {
      timeOfDay: timestamp ? new Date(timestamp).getHours() : null,
      messageLength: words,
      exclamations,
      questions
    }
  };
};

export const analyzeMoodTrend = (commits) => {
  const analyses = commits.map(commit => 
    analyzeSentiment(commit.message, commit.date, commit.author)
  );
  
  const weightedScores = {};
  Object.keys(moodPatterns).forEach(mood => {
    weightedScores[mood] = 0;
  });
  
  analyses.forEach((analysis, index) => {
    const timeWeight = Math.pow(0.8, index);
    Object.entries(analysis.scores).forEach(([mood, score]) => {
      weightedScores[mood] += score * timeWeight;
    });
  });
  
  const dominantMood = Object.keys(weightedScores).reduce((a, b) => 
    weightedScores[a] > weightedScores[b] ? a : b
  );
  
  return {
    overallMood: dominantMood,
    confidence: Math.max(...Object.values(weightedScores)) / analyses.length,
    moodDistribution: weightedScores,
    individualAnalyses: analyses,
    trend: calculateTrend(analyses)
  };
};

const calculateTrend = (analyses) => {
  if (analyses.length < 3) return 'stable';
  
  const recent = analyses.slice(0, 2);
  const older = analyses.slice(2, 4);
  
  const recentAvg = recent.reduce((sum, a) => sum + a.confidence, 0) / recent.length;
  const olderAvg = older.reduce((sum, a) => sum + a.confidence, 0) / older.length;
  
  const diff = recentAvg - olderAvg;
  
  if (diff > 0.2) return 'improving';
  if (diff < -0.2) return 'declining';
  return 'stable';
};