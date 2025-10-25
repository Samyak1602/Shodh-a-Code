import { useState, useEffect } from 'react';
import { getLeaderboard } from '../lib/api';

const Leaderboard = ({ contestId }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard(contestId);
        setLeaderboard(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    
    // Poll every 20 seconds
    const interval = setInterval(fetchLeaderboard, 20000);
    
    return () => clearInterval(interval);
  }, [contestId]);

  if (loading) {
    return (
      <div className="card animate-fadeInUp">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Live Leaderboard
          </h3>
        </div>
        <div className="p-6 text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-500">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  const getRankIcon = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getRankColor = (index) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (index === 1) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (index === 2) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="card animate-fadeInUp">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Live Leaderboard
        </h3>
        <p className="text-gray-600 text-sm mt-1">Real-time competition rankings</p>
      </div>
      
      {leaderboard.length === 0 ? (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-600 mb-2">No Submissions Yet</h4>
          <p className="text-gray-500">Be the first to submit a solution!</p>
        </div>
      ) : (
        <div className="p-6">
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.userName}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  index < 3 
                    ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getRankColor(index)}`}>
                      {getRankIcon(index)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{entry.userName}</h4>
                      <p className="text-sm text-gray-600">
                        {entry.problemsSolved || entry.acceptedCount || 0} problems solved
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-800">
                      {entry.totalTime ? `${entry.totalTime}s` : '-'}
                    </div>
                    <div className="text-xs text-gray-500">Total Time</div>
                  </div>
                </div>
                
                {index < 3 && (
                  <div className="mt-3 pt-3 border-t border-yellow-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-yellow-700 font-medium">
                        {index === 0 && '🏆 Champion'}
                        {index === 1 && '🥈 Runner-up'}
                        {index === 2 && '🥉 Third Place'}
                      </span>
                      <span className="text-yellow-600">
                        {index === 0 && 'Excellent work!'}
                        {index === 1 && 'Great job!'}
                        {index === 2 && 'Well done!'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-blue-800 text-sm font-medium">
                Leaderboard updates every 20 seconds
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
