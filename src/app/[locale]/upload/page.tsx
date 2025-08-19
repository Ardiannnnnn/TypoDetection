"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Navbar from "@/components/Navbar";
import { uploadFile, fetchProgress, downloadResult } from "@/service/uploadService";
import Loader from "@/components/loader";

export default function UploadPage() {
  const t = useTranslations("upload");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [progressData, setProgressData] = useState<any>(null);
  const [isPolling, setIsPolling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload handler
  const handleUpload = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgressData(null);

    try {
      const data = await uploadFile(file);
      setResults({
        fileName: data.original_filename,
        status: data.status,
        message: data.message,
        jobId: data.job_id,
      });
    } catch (error) {
      setResults({
        status: "error",
        message: "Failed to upload file. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Polling progress after upload
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (results?.jobId && results.status === "success") {
      setIsPolling(true);
      interval = setInterval(async () => {
        try {
          const data = await fetchProgress(results.jobId); // Panggil dari service
          setProgressData(data);
          if (data.status === "completed" || data.status === "error") {
            setIsPolling(false);
            clearInterval(interval);
          }
        } catch {
          setIsPolling(false);
          clearInterval(interval);
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [results?.jobId, results?.status]);

  // Download result (update penggunaan)
  const handleDownload = async () => {
    if (!results?.jobId) return;
    
    try {
      await downloadResult(results.jobId, results.fileName); // Panggil dari service
    } catch (error) {
      alert("Download failed");
    }
  };

  const resetUpload = () => {
    setFile(null);
    setResults(null);
    setProgressData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag & drop handlers
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
      if (
        selectedFile.type === "application/pdf" ||
        selectedFile.name.endsWith(".pdf")
      ) {
        setFile(selectedFile);
      } else {
        alert(t("alerts.pdfOnly"));
      }
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type === "application/pdf" ||
        selectedFile.name.endsWith(".pdf")
      ) {
        setFile(selectedFile);
      } else {
        alert(t("alerts.pdfOnly"));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 font-poppins transition-colors duration-300">
      <Navbar showBackButton={true} />
      <main className="container mx-auto px-2 sm:px-6 py-6 sm:py-8 pt-24 sm:pt-28">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-4 font-poppins px-4">
            {t("title")}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 font-poppins px-4 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 w-full ">
          {/* Left: Upload Section */}
          <div className="flex-1 w-full mx-auto lg:mx-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-transparent dark:border-gray-700 relative">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center font-poppins">
                {t("uploadSection.title")}
              </h2>
              
              {/* Loader Overlay - di depan konten */}
              {(isProcessing || isPolling) && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-50">
                  <Loader />
                  <div className="mt-4 text-lg font-semibold text-indigo-600 dark:text-indigo-400 font-poppins">
                    {isPolling && progressData
                      ? `Progress: ${progressData.progress ?? 0}%`
                      : t("buttons.analyzing")}
                  </div>
                </div>
              )}

              {/* Konten upload tetap ada di bawah */}
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-200 cursor-pointer ${
                  isDragging
                    ? "border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                    : file
                    ? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
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
                    <div className="w-14 h-14 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 font-poppins break-all px-2">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-poppins">
                      {t("uploadSection.size")}:{" "}
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 font-poppins">
                      {t("uploadSection.dragDrop")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 font-poppins">
                      {t("uploadSection.or")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-poppins">
                      {t("uploadSection.support")}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3 justify-center mt-6">
                {file && (
                  <button
                    onClick={resetUpload}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors font-poppins text-sm"
                  >
                    {t("buttons.removeFile")}
                  </button>
                )}
                <button
                  onClick={handleUpload}
                  disabled={!file || isProcessing || isPolling}
                  className={`w-full px-6 py-3 rounded-lg font-semibold text-sm transition-colors font-poppins relative overflow-hidden
    ${
      file && !isProcessing && !isPolling
        ? "bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-lg hover:shadow-xl"
        : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
    }
  `}
                >
                  {isProcessing || isPolling ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-indigo-500 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                        <span>
                          {isPolling && progressData
                            ? `Analyzing... ${progressData.progress ?? 0}%`
                            : t("buttons.analyzing")}
                        </span>
                      </div>
                      {/* Progress bar */}
                      {isPolling && progressData && (
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded mt-3 overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-300"
                            style={{
                              width: `${progressData.progress ?? 0}%`,
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ) : (
                    t("buttons.analyzeDesktop")
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Result Section */}
          <div className="flex-1 w-full mx-auto lg:mx-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-transparent dark:border-gray-700 min-h-[350px] flex flex-col justify-between">
              {/* Status & Result */}
              {!results ? (
                // --- Default summary sebelum upload ---
                <div className="flex flex-col items-center justify-center h-full">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 font-poppins">
                    {t("results.title")}
                  </h2>
                  <p className="text-base text-gray-600 dark:text-gray-300 font-poppins mb-4">
                    {t("results.details.title")}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-4">
                    <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400 font-poppins">
                        0
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-poppins">
                        {t("results.stats.pages")}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                      <div className="text-lg font-bold text-red-600 dark:text-red-400 font-poppins">
                        0
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-poppins">
                        {t("results.stats.typos")}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400 font-poppins">
                        0
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-poppins">
                        {t("results.stats.words")}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
                      <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400 font-poppins">
                        0
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-poppins">
                        {t("results.stats.foreign")}
                      </div>
                    </div>
                  </div>
                </div>
              ) : progressData?.status === "error" || !progressData?.result ? (
                // --- Error state ---
                <div className="flex flex-col items-center justify-center h-full">
                  <h2 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2 font-poppins">
                    {t("results.title")}
                  </h2>
                  <p className="text-base text-green-500 dark:text-green-400 font-poppins mb-2">
                    {progressData?.message ||
                      "An error occurred during analysis."}
                  </p>
                  {progressData?.error && (
                    <p className="text-sm text-green-400 dark:green-red-300 font-poppins">
                      {progressData.error}
                    </p>
                  )}
                </div>
              ) : progressData?.status !== "completed" ? (
                // --- Loading state ---
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-8 h-8 border-4 border-green-600 dark:border-green-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <h2 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2 font-poppins">
                    {t("results.title")}
                  </h2>
                  <span className="text-green-700 dark:text-green-200 font-poppins text-base">
                    {progressData?.message || "Processing..."}
                  </span>
                  <span className="text-sm text-green-500 dark:text-green-400 mt-2 font-poppins">
                    {`Progress: ${progressData?.progress ?? 0}%`}
                  </span>
                </div>
              ) : (
                // --- Analysis result ---
                <div className="flex flex-col items-center justify-center h-full">
                  <h2 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2 font-poppins">
                    {t("results.title")}
                  </h2>
                  <p className="text-base text-gray-700 dark:text-gray-200 font-poppins mb-2">
                    Analysis completed!
                  </p>
                  <div className="grid grid-cols-2 gap-4 w-full mt-4">
                    <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400 font-poppins">
                        {progressData?.result?.total_pages ?? "0"}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-poppins">
                        {t("results.stats.pages")}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                      <div className="text-lg font-bold text-red-600 dark:text-red-400 font-poppins">
                        {progressData?.result?.total_typos ?? "0"}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-poppins">
                        {t("results.stats.typos")}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400 font-poppins">
                        {progressData?.result?.total_words ?? "0"}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-poppins">
                        {t("results.stats.words")}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
                      <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400 font-poppins">
                        {progressData?.result?.total_foreign_words ?? "0"}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-poppins">
                        {t("results.stats.foreign")}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Download Button - always visible */}
              <button
                onClick={handleDownload}
                disabled={progressData?.status !== "completed"}
                className={`text-sm mt-8 w-full px-6 py-3 rounded-lg font-semibold transition-colors font-poppins
    ${
      progressData?.status === "completed"
        ? "bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-600 shadow-lg hover:shadow-xl"
        : "bg-gray-300 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
    }
  `}
              >
                {t("buttons.downloadResults")}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
