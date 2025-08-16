"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Navbar from "@/components/Navbar";
import { uploadFile } from "@/service/uploadService";

async function fetchProgress(jobId: string) {
  const res = await fetch(
    `https://periksa-laporan.jrycodes.me/progress/${jobId}`
  );
  if (!res.ok) throw new Error("Failed to fetch progress");
  return res.json();
}

export default function UploadPage() {
  const t = useTranslations("upload");
  const locale = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [correctedPdfPreview, setCorrectedPdfPreview] = useState<string | null>(
    null
  );
  const [progressData, setProgressData] = useState<any>(null);
  const [isPolling, setIsPolling] = useState(false);
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

  const generateCorrectedPdfPreview = async () => {
    try {
      const fileUrl = URL.createObjectURL(file!);
      setCorrectedPdfPreview(fileUrl);
    } catch (error) {
      console.error("Error generating corrected PDF preview:", error);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsProcessing(true);

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

  const downloadCorrectedPdf = () => {
    const link = document.createElement("a");
    link.href = correctedPdfPreview || "#";
    link.download = `corrected_${file?.name || "document.pdf"}`;

    if (correctedPdfPreview) {
      link.click();
    } else {
      alert(t("alerts.pdfGenerating"));
    }
  };

  const resetUpload = () => {
    setFile(null);
    setResults(null);
    setCorrectedPdfPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Polling progress after upload
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (results?.jobId && results.status === "success") {
      setIsPolling(true);
      interval = setInterval(async () => {
        try {
          const data = await fetchProgress(results.jobId);
          setProgressData(data);
          if (data.status === "finished" || data.status === "error") {
            setIsPolling(false);
            clearInterval(interval);
          }
        } catch {
          setIsPolling(false);
          clearInterval(interval);
        }
      }, 2000); // Poll every 2 seconds
    }
    return () => clearInterval(interval);
  }, [results?.jobId, results?.status]);

  // Download result
  const handleDownload = async () => {
    if (!results?.jobId) return;
    const res = await fetch(
      `https://periksa-laporan.jrycodes.me/download/${results.jobId}`
    );
    if (!res.ok) {
      alert("Download failed");
      return;
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = results.fileName || "result.pdf";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 font-poppins transition-colors duration-300">
      <Navbar showBackButton={true} />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 pt-24 sm:pt-28">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-4 font-poppins px-4">
            {t("title")}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 font-poppins px-4 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {!results ? (
          /* Upload Section */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 sm:p-6 lg:p-8 mx-4 sm:mx-0 border border-transparent dark:border-gray-700">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 text-center font-poppins">
                {t("uploadSection.title")}
              </h2>

              {/* File Upload Area */}
              <div
                className={`border-2 sm:border-3 border-dashed rounded-xl p-4 sm:p-6 lg:p-8 text-center transition-colors duration-200 cursor-pointer ${
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
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <svg
                        className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-green-600 dark:text-green-400"
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
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white mb-2 font-poppins">
                      {t("uploadSection.ready")}
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-2 sm:mb-4 font-poppins break-all px-2">
                      {file.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 font-poppins">
                      {t("uploadSection.size")}:{" "}
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <svg
                        className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-indigo-600 dark:text-indigo-400"
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
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white mb-2 font-poppins">
                      {t("uploadSection.dragDrop")}
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-2 sm:mb-4 font-poppins">
                      {t("uploadSection.or")}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-poppins">
                      {t("uploadSection.support")}
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
                    {t("buttons.removeFile")}
                  </button>
                )}
                <button
                  onClick={handleUpload}
                  disabled={!file || isProcessing}
                  className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base lg:text-lg transition-colors duration-200 font-poppins ${
                    file && !isProcessing
                      ? "bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-lg hover:shadow-xl"
                      : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                      <div className="w-4 h-4 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">
                        {t("buttons.analyzing")}
                      </span>
                      <span className="sm:hidden">
                        {t("buttons.analyzingMobile")}
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="hidden sm:inline">
                        {t("buttons.analyzeDesktop")}
                      </span>
                      <span className="sm:hidden">
                        {t("buttons.analyzeMobile")}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-4 sm:space-y-6">
            {/* Analysis Summary Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 sm:p-6 mx-4 sm:mx-0 border border-transparent dark:border-gray-700">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 font-poppins text-center sm:text-left">
                {t("results.title")}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
                <div className="text-center p-2 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400 font-poppins">
                    {progressData?.result?.total_pages ?? "-"}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-poppins">
                    {t("results.stats.pages")}
                  </div>
                </div>
                <div className="text-center p-2 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                  <div className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400 font-poppins">
                    {progressData?.result?.total_typos ?? 0}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-poppins">
                    {t("results.stats.typos")}
                  </div>
                </div>
                <div className="text-center p-2 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                  <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400 font-poppins">
                    {progressData?.result?.total_words ?? "-"}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-poppins">
                    {t("results.stats.words")}
                  </div>
                </div>
                <div className="text-center p-2 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
                  <div className="text-lg sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400 font-poppins">
                    {progressData?.result?.total_foreign_words ?? "-"}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-poppins">
                    {t("results.stats.foreign")}
                  </div>
                </div>
                <div className="text-center p-2 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                  <div className="text-lg sm:text-2xl font-bold text-purple-600 dark:text-purple-400 font-poppins">
                    {progressData?.progress ?? "-"}%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-poppins">
                    Progress
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
