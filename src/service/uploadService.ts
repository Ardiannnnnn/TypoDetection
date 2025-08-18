export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://periksa-laporan.jrycodes.me/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  return response.json();
}

export async function fetchProgress(jobId: string) {
  const response = await fetch(`https://periksa-laporan.jrycodes.me/progress/${jobId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch progress');
  }
  
  return response.json();
}

export async function downloadResult(jobId: string, fileName?: string) {
  const response = await fetch(`https://periksa-laporan.jrycodes.me/download/${jobId}`);
  
  if (!response.ok) {
    throw new Error('Download failed');
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || 'result.pdf';
  link.click();
  window.URL.revokeObjectURL(url);
}