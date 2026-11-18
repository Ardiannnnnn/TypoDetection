export type UploadResponse = {
  original_filename: string;
  status: "success" | "error";
  message: string;
  job_id: string;
};

export type EvaluationSummary = {
  total_units: number;
  spelling_findings_count: number;
  italic_findings_count: number;
  review_count: number;
  not_assessed_units: number;
  annotation_count: number;
};

export type CheckResult = {
  total_pages: number;
  total_typos: number;
  total_words: number;
  total_foreign_words: number;
  schema_version?: string;
  policy_version: string;
  resource_version: string;
  evaluation: EvaluationSummary;
  coverage?: { unreadable_pages: number; [key: string]: unknown };
  warnings?: string[];
  download_url?: string;
  report_url?: string;
  findings_url?: string;
  json_url?: string;
};

export type ProgressResponse = {
  job_id?: string;
  original_filename?: string;
  status: "queued" | "processing" | "completed" | "error";
  progress: number;
  current_page?: number;
  total_pages?: number;
  message?: string;
  error?: string;
  result?: CheckResult;
};

export type FindingType = "spelling" | "missing_italic" | "review";

export type FindingItem = {
  finding_id?: string;
  unit_id?: string;
  type?: FindingType;
  page: number;
  target: string;
  message?: string;
  review_reasons?: string[];
  rule_ids?: string[];
};

export type FindingsResponse = {
  total: number;
  page: number;
  page_size: number;
  items: FindingItem[];
  review_count?: number;
  schema_version: string;
  policy_version: string;
  resource_version: string;
};

export type DownloadResponse = Blob;
