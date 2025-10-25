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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contest...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{contest.title}</h1>
          <p className="mt-2 text-gray-600">Welcome, {user}!</p>
          {submissionStatus && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800">Status: {submissionStatus}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Problems and Code Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Problem Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Problems</h2>
              <div className="space-y-2">
                {contest.problems.map((problem) => (
                  <button
                    key={problem.id}
                    onClick={() => setSelectedProblem(problem)}
                    className={`w-full text-left p-3 rounded-lg border ${
                      selectedProblem?.id === problem.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900">{problem.title}</h3>
                  </button>
                ))}
              </div>
            </div>

            {/* Problem View */}
            <ProblemView problem={selectedProblem} />

            {/* Code Editor */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Code Editor</h2>
              <CodeEditor
                value={code}
                onChange={setCode}
                language="java"
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>

          {/* Right Column - Leaderboard */}
          <div className="lg:col-span-1">
            <Leaderboard contestId={contestId} />
          </div>
        </div>
      </div>
    </div>
  );
}
