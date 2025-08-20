export type UploadResponse = {
  original_filename: string;
  status: "success" | "error";
  message: string;
  job_id: string;
};

export type ProgressResponse = {
  status: "pending" | "processing" | "completed" | "error";
  progress?: number;
  message?: string;
  error?: string;
  result?: {
    total_pages: number;
    total_typos: number;
    total_words: number;
    total_foreign_words: number;
  };
};

export type DownloadResponse = Blob;