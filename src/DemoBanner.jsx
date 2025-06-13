import React from 'react';
import { Info } from 'lucide-react';

const DemoBanner = () => {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 mb-8">
      <div className="flex items-start space-x-3">
        <Info className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-orange-900 mb-1">
            🎵 Demo Version
          </h3>
          <p className="text-sm text-orange-800 leading-relaxed">
            This is a fully functional demonstration of MoodCode's capabilities. 
            Real SoundCloud integration is pending API approval. 
            <span className="font-medium"> All features work exactly as they would in production</span> - 
            analyzing GitHub commits, detecting moods, and generating personalized playlists.
          </p>
          <div className="mt-2 text-xs text-orange-700">
            <strong>For Employers:</strong> This demonstrates API integration, data analysis, 
            OAuth flows, and full-stack development skills.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoBanner;