const ProblemView = ({ problem }) => {
  if (!problem) {
    return (
      <div className="card animate-fadeInUp">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Problem Selected</h3>
          <p className="text-gray-500">Choose a problem from the list above to view its details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-fadeInUp">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{problem.title}</h2>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              Problem Statement
            </span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="prose max-w-none">
          <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Problem Description
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{problem.statement}</p>
          </div>
          
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Input Format
              </h4>
              <p className="text-green-700 text-sm">Read input from standard input as specified in the problem statement.</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Output Format
              </h4>
              <p className="text-blue-700 text-sm">Print output to standard output as specified in the problem statement.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemView;
