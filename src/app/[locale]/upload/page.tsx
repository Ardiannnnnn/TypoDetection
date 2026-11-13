"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import Navbar from "@/components/Navbar";
import {
  uploadFile,
  fetchProgress,
  downloadResult,
} from "@/service/uploadService";
import Loader from "@/components/loader";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { ProgressResponse } from "@/types/upload";

export default function UploadPage() {
  const t = useTranslations("upload");
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<{
    fileName?: string;
    status: string;
    message?: string;
    jobId?: string;
  } | null>(null);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      setInlineError(null);
      setResults({
        fileName: data.original_filename,
        status: data.status,
        message: data.message,
        jobId: data.job_id,
      });
    },
    onError: () => {
      setResults({
        status: "error",
        message: "Failed to upload file. Please try again.",
      });
    },
  });

  const { data: progressData } = useQuery<ProgressResponse>({
    queryKey: ["progress", results?.jobId],
    queryFn: () => fetchProgress(results!.jobId!),
    enabled: !!results?.jobId && results?.status === "success",
    refetchInterval: (query) => {
      const data = query.state.data as ProgressResponse | undefined;
      if (data?.status === "completed" || data?.status === "error") {
        return false;
      }
      return 1500;
    },
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const downloadMutation = useMutation({
    mutationFn: ({ jobId, fileName }: { jobId: string; fileName: string }) =>
      downloadResult(jobId, fileName),
    onError: () => {
      setInlineError("Download failed. Please try again.");
    },
  });

  const isProcessing = uploadMutation.isPending;
  const isAnalyzing =
    !!results?.jobId &&
    results?.status === "success" &&
    progressData?.status !== "completed" &&
    progressData?.status !== "error";
  const isLoading = isProcessing || isAnalyzing;

  const handleUpload = () => {
    if (!file) return;
    setInlineError(null);
    uploadMutation.mutate(file);
  };

  const handleDownload = () => {
    if (!results?.jobId || !results?.fileName) return;
    setInlineError(null);
    downloadMutation.mutate({
      jobId: results.jobId,
      fileName: results.fileName,
    });
  };

  const resetUpload = () => {
    setFile(null);
    setResults(null);
    setInlineError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setInlineError(null);
      setFile(selectedFile);
    } else {
      setInlineError(t("alerts.pdfOnly"));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isLoading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isLoading) return;
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      validateAndSetFile(droppedFiles[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const handleDropzoneKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isLoading) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const hasError =
    results?.status === "error" || progressData?.status === "error";
  const isCompleted = progressData?.status === "completed";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 font-poppins">
      <Navbar showBackButton={true} />

      <section className="container mx-auto px-4 sm:px-6 max-w-6xl pt-28 pb-16">
        {/* Header Section */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-3">
            {t("title")}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {inlineError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-sm text-red-700 dark:text-red-300"
          >
            {inlineError}
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Upload Section */}
          <div className="lg:col-span-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 relative h-full flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-5">
                  {t("uploadSection.title")}
                </h2>

                {/* Loader Overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 rounded-xl flex flex-col items-center justify-center z-10 p-6">
                    <Loader />
                    <div className="mt-4 text-base font-semibold text-indigo-700 dark:text-indigo-400">
                      {isAnalyzing && progressData
                        ? `Progress: ${progressData.progress ?? 0}%`
                        : t("buttons.analyzing")}
                    </div>
                  </div>
                )}

                {/* Dropzone */}
                <div
                  role="button"
                  tabIndex={isLoading ? -1 : 0}
                  aria-disabled={isLoading}
                  aria-label={t("uploadSection.dragDrop")}
                  onKeyDown={handleDropzoneKeyDown}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !isLoading && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    isDragging
                      ? "border-indigo-600 dark:border-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40"
                      : file
                      ? "border-indigo-600 dark:border-indigo-400 bg-slate-50 dark:bg-slate-800/50"
                      : "border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,application/pdf"
                    className="hidden"
                    disabled={isLoading}
                  />

                  {file ? (
                    <div>
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-6 h-6 text-indigo-700 dark:text-indigo-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1 break-all px-2">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {t("uploadSection.size")}:{" "}
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-6 h-6 text-indigo-700 dark:text-indigo-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-1.5">
                        {t("uploadSection.dragDrop")}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                        {t("uploadSection.or")}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t("uploadSection.support")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                {file && (
                  <button
                    type="button"
                    onClick={resetUpload}
                    disabled={isLoading}
                    className="w-full min-h-[44px] px-4 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {t("buttons.removeFile")}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!file || isLoading}
                  className={`w-full min-h-[44px] px-6 py-3 rounded-lg font-semibold text-sm transition-colors ${
                    file && !isLoading
                      ? "bg-indigo-700 text-white hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {t("buttons.analyzeDesktop")}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Result Section */}
          <div className="lg:col-span-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 min-h-[360px] h-full flex flex-col justify-between">
              {!results ? (
                <div className="flex flex-col justify-center h-full py-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    {t("results.title")}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {t("results.details.title")}
                  </p>
                  <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-5">
                    <li>• {t("results.stats.pages")}</li>
                    <li>• {t("results.stats.typos")}</li>
                    <li>• {t("results.stats.words")}</li>
                    <li>• {t("results.stats.foreign")}</li>
                  </ul>
                </div>
              ) : hasError ? (
                <div className="flex flex-col justify-center h-full py-6">
                  <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
                    {t("results.title")}
                  </h2>
                  <p className="text-sm sm:text-base text-red-600 dark:text-red-300 mb-2">
                    {progressData?.message ||
                      results?.message ||
                      "An error occurred during analysis."}
                  </p>
                  {progressData?.error && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {progressData.error}
                    </p>
                  )}
                </div>
              ) : isCompleted ? (
                <div className="flex flex-col justify-center h-full">
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                      {t("results.title")}
                    </h2>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
                      {t("results.completed", { defaultValue: "Completed" })}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                        {progressData?.result?.total_pages ?? "0"}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {t("results.stats.pages")}
                      </div>
                    </div>
                    <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900">
                      <div className="text-2xl font-bold text-amber-800 dark:text-amber-300">
                        {progressData?.result?.total_typos ?? "0"}
                      </div>
                      <div className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                        {t("results.stats.typos")}
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                        {progressData?.result?.total_words ?? "0"}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {t("results.stats.words")}
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
                        {progressData?.result?.total_foreign_words ?? "0"}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {t("results.stats.foreign")}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-6 text-center">
                  <div className="w-8 h-8 border-4 border-indigo-700 dark:border-indigo-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-1.5">
                    {t("results.title")}
                  </h2>
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {progressData?.message || "Processing..."}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={handleDownload}
                disabled={!isCompleted || downloadMutation.isPending}
                className={`mt-8 w-full min-h-[44px] px-6 py-3 rounded-lg font-semibold text-sm transition-colors ${
                  isCompleted && !downloadMutation.isPending
                    ? "bg-indigo-700 text-white hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                {t("buttons.downloadResults")}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
