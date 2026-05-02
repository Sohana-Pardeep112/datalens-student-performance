import React, { useState } from 'react';
import { uploadCsv } from '../services/api';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadProps {
  onUploadSuccess: (datasetId: number) => void;
}

export const Upload: React.FC<UploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ filename: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccess(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await uploadCsv(file);
      setSuccess({ filename: data.filename });
      onUploadSuccess(data.id);
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
          <UploadCloud size={32} />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Upload Dataset</h2>
        <p className="text-sm text-gray-500 text-center">Select a semicolon-delimited CSV file to begin analysis</p>
        
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
          data-testid="file-input"
        />

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition ${!file || loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          data-testid="upload-button"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>

        {error && (
          <div className="w-full p-3 bg-red-50 text-red-600 rounded-md text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="w-full p-3 bg-green-50 text-green-700 rounded-md text-sm flex flex-col gap-1 items-center" data-testid="success-message">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle size={16} />
              <span>Upload Complete</span>
            </div>
            <span className="text-green-600">Successfully uploaded {success.filename}</span>
          </div>
        )}
      </div>
    </div>
  );
};
