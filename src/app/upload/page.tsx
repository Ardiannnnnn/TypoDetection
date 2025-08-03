'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      const selectedFile = droppedFiles[0];
      if (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt')) {
        setFile(selectedFile);
      } else {
        alert('Please upload a text file (.txt)');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt')) {
        setFile(selectedFile);
      } else {
        alert('Please upload a text file (.txt)');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      // Mock results for demonstration
      setResults({
        totalWords: 156,
        typosFound: 3,
        typos: [
          { word: 'recieve', suggestion: 'receive', line: 2, position: 15 },
          { word: 'occured', suggestion: 'occurred', line: 5, position: 8 },
          { word: 'seperate', suggestion: 'separate', line: 8, position: 22 }
        ]
      });
      setIsProcessing(false);
    }, 3000);
  };

  const resetUpload = () => {
    setFile(null);
    setResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-poppins">
      <Navbar showBackButton={true} />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 font-poppins">Upload Your Document</h1>
            <p className="text-xl text-gray-600 font-poppins">
              Upload a text file and let our AI detect typos and grammatical errors
            </p>
          </div>

          {!results ? (
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* File Upload Area */}
              <div
                className={`border-3 border-dashed rounded-xl p-12 text-center transition-colors duration-200 ${
                  isDragging 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : file 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".txt"
                  className="hidden"
                />
                
                {file ? (
                  <div>
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 font-poppins">File Selected</h3>
                    <p className="text-gray-600 mb-4 font-poppins">{file.name}</p>
                    <p className="text-sm text-gray-500 mb-6 font-poppins">Size: {(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <div>
                    <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 font-poppins">
                      Drag & drop your text file here
                    </h3>
                    <p className="text-gray-600 mb-4 font-poppins">or click to browse files</p>
                    <p className="text-sm text-gray-500 font-poppins">Supports: .txt files (Max 10MB)</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center mt-8">
                {file && (
                  <button
                    onClick={resetUpload}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-700 transition-colors duration-200 font-poppins"
                  >
                    Remove File
                  </button>
                )}
                <button
                  onClick={handleUpload}
                  disabled={!file || isProcessing}
                  className={`px-8 py-3 rounded-lg font-semibold transition-colors duration-200 font-poppins ${
                    file && !isProcessing
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Detect Typos'
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Results Section */
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 font-poppins">Detection Results</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 font-poppins">{results.totalWords}</div>
                    <div className="text-gray-600 font-poppins">Total Words</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-3xl font-bold text-red-600 font-poppins">{results.typosFound}</div>
                    <div className="text-gray-600 font-poppins">Typos Found</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 font-poppins">
                      {((results.totalWords - results.typosFound) / results.totalWords * 100).toFixed(1)}%
                    </div>
                    <div className="text-gray-600 font-poppins">Accuracy</div>
                  </div>
                </div>
              </div>

              {/* Typos List */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 font-poppins">Found Typos</h3>
                <div className="space-y-4">
                  {results.typos.map((typo: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                            {typo.word}
                          </div>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {typo.suggestion}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 font-poppins">
                          Line {typo.line}, Position {typo.position}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetUpload}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-poppins"
                >
                  Upload Another File
                </button>
                <button className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 font-poppins">
                  Download Report
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
