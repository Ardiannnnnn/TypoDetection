"use client"

import { useState, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Navbar from '@/components/Navbar';

export default function UploadPage() {
  const t = useTranslations('upload');
  const locale = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [correctedPdfPreview, setCorrectedPdfPreview] = useState<string | null>(null);
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
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        setFile(selectedFile);
      } else {
        alert(t('alerts.pdfOnly'));
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        setFile(selectedFile);
      } else {
        alert(t('alerts.pdfOnly'));
      }
    }
  };

  const generateCorrectedPdfPreview = async () => {
    try {
      const fileUrl = URL.createObjectURL(file!);
      setCorrectedPdfPreview(fileUrl);
    } catch (error) {
      console.error('Error generating corrected PDF preview:', error);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    
    setTimeout(async () => {
      const mockResults = {
        fileName: file.name,
        totalPages: 3,
        totalWords: 892,
        typosFound: 7,
        processingTime: '2.3s',
        typos: [
          { word: 'recieve', suggestion: 'receive', page: 1, line: 5, position: 15 },
          { word: 'occured', suggestion: 'occurred', page: 1, line: 12, position: 8 },
          { word: 'seperate', suggestion: 'separate', page: 2, line: 3, position: 22 },
          { word: 'definately', suggestion: 'definitely', page: 2, line: 8, position: 45 },
          { word: 'accomodate', suggestion: 'accommodate', page: 2, line: 15, position: 12 },
          { word: 'priviledge', suggestion: 'privilege', page: 3, line: 2, position: 33 },
          { word: 'mispelled', suggestion: 'misspelled', page: 3, line: 7, position: 18 }
        ]
      };
      
      setResults(mockResults);
      await generateCorrectedPdfPreview();
      setIsProcessing(false);
    }, 4000);
  };

  const downloadCorrectedPdf = () => {
    const link = document.createElement('a');
    link.href = correctedPdfPreview || '#';
    link.download = `corrected_${file?.name || 'document.pdf'}`;
    
    if (correctedPdfPreview) {
      link.click();
    } else {
      alert(t('alerts.pdfGenerating'));
    }
  };

  const resetUpload = () => {
    setFile(null);
    setResults(null);
    setCorrectedPdfPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 font-poppins transition-colors duration-300">
      <Navbar showBackButton={true} />
      
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 pt-24 sm:pt-28">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-4 font-poppins px-4">
            {t('title')}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 font-poppins px-4 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {!results ? (
          /* Upload Section */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 sm:p-6 lg:p-8 mx-4 sm:mx-0 border border-transparent dark:border-gray-700">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 text-center font-poppins">
                {t('uploadSection.title')}
              </h2>
              
              {/* File Upload Area */}
              <div
                className={`border-2 sm:border-3 border-dashed rounded-xl p-4 sm:p-6 lg:p-8 text-center transition-colors duration-200 cursor-pointer ${
                  isDragging 
                    ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                    : file 
                    ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
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
                  accept=".pdf,application/pdf"
                  className="hidden"
                />
                
                {file ? (
                  <div>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white mb-2 font-poppins">
                      {t('uploadSection.ready')}
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-2 sm:mb-4 font-poppins break-all px-2">
                      {file.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 font-poppins">
                      {t('uploadSection.size')}: {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white mb-2 font-poppins">
                      {t('uploadSection.dragDrop')}
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-2 sm:mb-4 font-poppins">
                      {t('uploadSection.or')}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-poppins">
                      {t('uploadSection.support')}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8">
                {file && (
                  <button
                    onClick={resetUpload}
                    className="w-full sm:w-auto px-4 sm:px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 font-poppins text-sm sm:text-base"
                  >
                    {t('buttons.removeFile')}
                  </button>
                )}
                <button
                  onClick={handleUpload}
                  disabled={!file || isProcessing}
                  className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base lg:text-lg transition-colors duration-200 font-poppins ${
                    file && !isProcessing
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                      <div className="w-4 h-4 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">{t('buttons.analyzing')}</span>
                      <span className="sm:hidden">{t('buttons.analyzingMobile')}</span>
                    </div>
                  ) : (
                    <>
                      <span className="hidden sm:inline">{t('buttons.analyzeDesktop')}</span>
                      <span className="sm:hidden">{t('buttons.analyzeMobile')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-4 sm:space-y-6">
            {/* Summary Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 sm:p-6 mx-4 sm:mx-0 border border-transparent dark:border-gray-700">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 font-poppins text-center sm:text-left">
                {t('results.title')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
                <div className="text-center p-2 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400 font-poppins">
                    {results.totalPages}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-poppins">{t('results.stats.pages')}</div>
                </div>
                <div className="text-center p-2 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                  <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400 font-poppins">
                    {results.totalWords}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-poppins">{t('results.stats.words')}</div>
                </div>
                <div className="text-center p-2 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                  <div className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400 font-poppins">
                    {results.typosFound}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-poppins">{t('results.stats.typos')}</div>
                </div>
                <div className="text-center p-2 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                  <div className="text-lg sm:text-2xl font-bold text-purple-600 dark:text-purple-400 font-poppins">
                    {((results.totalWords - results.typosFound) / results.totalWords * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-poppins">{t('results.stats.accuracy')}</div>
                </div>
                <div className="text-center p-2 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800 col-span-2 sm:col-span-1">
                  <div className="text-lg sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400 font-poppins">
                    {results.processingTime}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-poppins">{t('results.stats.time')}</div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mx-4 sm:mx-0">
              {/* Corrected PDF Preview */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 sm:p-6 border border-transparent dark:border-gray-700">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4 font-poppins">
                  {t('results.correctedPdf.title')}
                  <span className="block sm:inline text-xs sm:text-sm font-normal text-green-600 dark:text-green-400 sm:ml-2 mt-1 sm:mt-0">
                    {t('results.correctedPdf.subtitle')}
                  </span>
                </h3>
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-2 sm:p-4 h-64 sm:h-80 lg:h-96 overflow-hidden bg-gray-50 dark:bg-gray-900">
                  {correctedPdfPreview ? (
                    <iframe
                      src={correctedPdfPreview}
                      className="w-full h-full rounded bg-white dark:bg-gray-800"
                      title="Corrected PDF with Highlighted Typos"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-2 sm:mb-4"></div>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-poppins">
                          {t('results.correctedPdf.generating')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 sm:mt-4">
                  <button 
                    onClick={downloadCorrectedPdf}
                    className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200 font-poppins flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{t('buttons.downloadPdf')}</span>
                  </button>
                </div>
              </div>

              {/* Typos List */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 sm:p-6 border border-transparent dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white font-poppins">
                    {t('results.typosList.title')}
                  </h3>
                  <span className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium font-poppins self-start sm:self-auto border border-red-200 dark:border-red-800">
                    {results.typosFound} {t('results.typosList.errors')}
                  </span>
                </div>
                
                <div className="space-y-2 sm:space-y-3 h-64 sm:h-80 lg:h-96 overflow-y-auto">
                  {results.typos.map((typo: any, index: number) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-3">
                          <span className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 px-2 py-1 rounded text-xs sm:text-sm font-medium font-poppins inline-block border border-red-200 dark:border-red-800">
                            {typo.word}
                          </span>
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                          <span className="text-xs sm:hidden text-gray-400 dark:text-gray-500">↓</span>
                          <span className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded text-xs sm:text-sm font-medium font-poppins inline-block border border-green-200 dark:border-green-800">
                            {typo.suggestion}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-poppins">
                        📄 Page {typo.page} • 📝 Line {typo.line} • 📍 Pos {typo.position}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mx-4 sm:mx-0">
              <button
                onClick={resetUpload}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 font-poppins flex items-center justify-center space-x-2 text-sm sm:text-base border border-transparent dark:border-gray-600"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="hidden sm:inline">{t('buttons.newAnalysisDesktop')}</span>
                <span className="sm:hidden">{t('buttons.newAnalysisMobile')}</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}