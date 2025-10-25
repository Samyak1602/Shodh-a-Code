import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Join() {
  const [contestId, setContestId] = useState('1');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (contestId && userName) {
      setIsLoading(true);
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push(`/contest/${contestId}?user=${encodeURIComponent(userName)}`);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-white font-bold text-xl">Shodh-a-Code</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
            <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
            <a href="#contact" className="text-white/80 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fadeInUp">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Code. Compete.{' '}
              <span className="gradient-text bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Conquer.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join the ultimate coding competition platform. Test your skills, solve challenging problems, 
              and climb the leaderboard in real-time.
            </p>
          </div>

          {/* Join Form */}
          <div className="animate-fadeInUp max-w-md mx-auto">
            <div className="glass-card rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Join Contest</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="contestId" className="block text-sm font-semibold text-gray-700 mb-2">
                    Contest ID
                  </label>
                  <input
                    id="contestId"
                    name="contestId"
                    type="text"
                    required
                    value={contestId}
                    onChange={(e) => setContestId(e.target.value)}
                    className="input-field"
                    placeholder="Enter contest ID"
                  />
                </div>

                <div>
                  <label htmlFor="userName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    id="userName"
                    name="userName"
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="input-field"
                    placeholder="Enter your username"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner mr-3"></div>
                      Joining...
                    </div>
                  ) : (
                    'Join Contest'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Why Choose Shodh-a-Code?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Real-time Coding</h3>
              <p className="text-gray-600">Code with syntax highlighting and real-time feedback</p>
            </div>
            
            <div className="glass-card rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Instant Judging</h3>
              <p className="text-gray-600">Get immediate results with our advanced judging system</p>
            </div>
            
            <div className="glass-card rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Live Leaderboard</h3>
              <p className="text-gray-600">Compete with others and track your progress in real-time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/80">
            © 2024 Shodh-a-Code. Built with ❤️ for the coding community.
          </p>
        </div>
      </footer>
    </div>
  );
}
