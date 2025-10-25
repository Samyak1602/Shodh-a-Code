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
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-lg">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-semibold text-gray-700">Language:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="java">☕ Java</option>
              <option value="python">🐍 Python</option>
              <option value="cpp">⚡ C++</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => onSubmit(selectedLanguage)}
          disabled={isSubmitting}
          className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="spinner mr-2" style={{ width: '16px', height: '16px' }}></div>
              Submitting...
            </div>
          ) : (
            '🚀 Submit'
          )}
        </button>
      </div>
      <div className="h-96 bg-white">
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
            fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
            fontWeight: '400',
            cursorStyle: 'line',
            cursorBlinking: 'blink',
            renderLineHighlight: 'gutter',
            selectOnLineNumbers: true,
            wordWrap: 'on',
            wrappingIndent: 'indent',
            smoothScrolling: true,
            mouseWheelZoom: true,
            contextmenu: true,
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            unfoldOnClickAfterEnd: false,
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
