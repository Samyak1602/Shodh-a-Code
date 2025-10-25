const ProblemView = ({ problem }) => {
  if (!problem) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Select a problem to view its details</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{problem.title}</h2>
      <div className="prose max-w-none">
        <p className="text-gray-700 whitespace-pre-wrap">{problem.statement}</p>
      </div>
    </div>
  );
};

export default ProblemView;
