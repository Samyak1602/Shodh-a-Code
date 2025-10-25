import { useState } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ value, onChange, language, onSubmit, isSubmitting }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(language || 'java');

  const handleLanguageChange = (newLanguage) => {
    setSelectedLanguage(newLanguage);
    // Reset code when language changes
    const defaultCode = getDefaultCode(newLanguage);
    onChange(defaultCode);
  };

  const getDefaultCode = (lang) => {
    switch (lang) {
      case 'java':
        return `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your code here
        
    }
}`;
      case 'python':
        return `# Your code here
import sys

`;
      case 'cpp':
        return `#include <iostream>
using namespace std;

int main() {
    // Your code here
    
    return 0;
}`;
      default:
        return '';
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Language:</label>
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        <button
          onClick={() => onSubmit(selectedLanguage)}
          disabled={isSubmitting}
          className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm font-medium"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
      <div className="h-96">
        <Editor
          height="100%"
          language={selectedLanguage}
          value={value}
          onChange={onChange}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
