export const uploadCsv = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || 'Upload failed');
  }

  return response.json();
};

export const fetchProfile = async (datasetId: number) => {
  const response = await fetch(`/api/datasets/${datasetId}/profile`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || 'Failed to fetch profile');
  }
  return response.json();
};

export const fetchSummary = async (datasetId: number) => {
  const response = await fetch(`/api/datasets/${datasetId}/summary`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || 'Failed to fetch summary');
  }
  return response.json();
};
