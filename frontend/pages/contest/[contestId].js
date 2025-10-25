import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getContest, postSubmission, getSubmission } from '../../lib/api';
import CodeEditor from '../../components/CodeEditor';
import ProblemView from '../../components/ProblemView';
import Leaderboard from '../../components/Leaderboard';

export default function Contest() {
  const router = useRouter();
  const { contestId, user } = router.query;
  
  const [contest, setContest] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [currentSubmission, setCurrentSubmission] = useState(null);

  useEffect(() => {
    if (contestId) {
      fetchContest();
    }
  }, [contestId]);

  const fetchContest = async () => {
    try {
      const data = await getContest(contestId);
      setContest(data);
      if (data.problems && data.problems.length > 0) {
        setSelectedProblem(data.problems[0]);
      }
    } catch (error) {
      console.error('Failed to fetch contest:', error);
    }
  };

  const handleSubmit = async (language) => {
    if (!selectedProblem || !code.trim()) {
      alert('Please select a problem and write some code');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus('Submitting...');

    try {
      const submissionData = {
        contestId: parseInt(contestId),
        problemId: selectedProblem.id,
        userName: user,
        language: language,
        code: code
      };

      const response = await postSubmission(submissionData);
      const submissionId = response.submissionId;
      
      setCurrentSubmission(submissionId);
      setSubmissionStatus('Processing...');
      
      // Poll for submission status
      pollSubmissionStatus(submissionId);
      
    } catch (error) {
      console.error('Failed to submit:', error);
      setSubmissionStatus('Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pollSubmissionStatus = async (submissionId) => {
    const pollInterval = setInterval(async () => {
      try {
        const submission = await getSubmission(submissionId);
        
        if (submission.status === 'PENDING' || submission.status === 'RUNNING') {
          setSubmissionStatus('Processing...');
        } else {
          setSubmissionStatus(submission.status);
          clearInterval(pollInterval);
          
          // Show result
          if (submission.status === 'ACCEPTED') {
            alert('✅ Accepted! All test cases passed.');
          } else {
            alert(`❌ ${submission.status}: ${submission.result || 'Unknown error'}`);
          }
        }
      } catch (error) {
        console.error('Failed to poll submission status:', error);
        clearInterval(pollInterval);
        setSubmissionStatus('Error checking status');
      }
    }, 2000);

    // Clear interval after 30 seconds to prevent infinite polling
    setTimeout(() => {
      clearInterval(pollInterval);
    }, 30000);
  };

  if (!contest) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading contest...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-white font-bold text-xl">Shodh-a-Code</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white/80">Welcome, <span className="font-semibold text-white">{user}</span></span>
              <button
                onClick={() => router.push('/')}
                className="btn-secondary text-sm"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contest Header */}
        <div className="mb-8 animate-fadeInUp">
          <div className="glass-card rounded-2xl p-8">
            <h1 className="text-4xl font-bold text-white mb-2">{contest.title}</h1>
            <p className="text-white/80 text-lg">{contest.description}</p>
            {submissionStatus && (
              <div className={`mt-4 p-4 rounded-lg border ${
                submissionStatus === 'ACCEPTED' ? 'status-accepted' :
                submissionStatus === 'WRONG_ANSWER' ? 'status-wrong-answer' :
                submissionStatus === 'PENDING' || submissionStatus === 'RUNNING' ? 'status-pending' :
                'status-running'
              }`}>
                <div className="flex items-center">
                  {submissionStatus === 'ACCEPTED' && <span className="text-green-600 mr-2">✅</span>}
                  {submissionStatus === 'WRONG_ANSWER' && <span className="text-red-600 mr-2">❌</span>}
                  {(submissionStatus === 'PENDING' || submissionStatus === 'RUNNING') && <span className="text-yellow-600 mr-2">⏳</span>}
                  <span className="font-semibold">Status: {submissionStatus}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Column - Problems and Code Editor */}
          <div className="xl:col-span-3 space-y-6">
            {/* Problem Selection */}
            <div className="card animate-fadeInUp">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Problems</h2>
                <p className="text-gray-600 mt-1">Select a problem to start coding</p>
              </div>
              <div className="p-6">
                <div className="grid gap-3">
                  {contest.problems.map((problem, index) => (
                    <button
                      key={problem.id}
                      onClick={() => setSelectedProblem(problem)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedProblem?.id === problem.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">{problem.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">Problem {index + 1}</p>
                        </div>
                        {selectedProblem?.id === problem.id && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">✓</span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Problem View */}
            <ProblemView problem={selectedProblem} />

            {/* Code Editor */}
            <div className="card animate-fadeInUp">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Code Editor</h2>
                <p className="text-gray-600 mt-1">Write your solution and submit</p>
              </div>
              <div className="p-6">
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language="java"
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Leaderboard */}
          <div className="xl:col-span-1">
            <Leaderboard contestId={contestId} />
          </div>
        </div>
      </div>
    </div>
  );
}
