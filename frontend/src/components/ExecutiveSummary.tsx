import React, { useEffect, useState } from 'react';
import { fetchSummary } from '../services/api';

interface ExecutiveSummaryProps {
  datasetId: number;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ datasetId }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSummary(datasetId);
        setSummary(data.summary);
      } catch (err: any) {
        setError(err.message || 'Failed to load executive summary');
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [datasetId]);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6 mt-6 border border-gray-200" data-testid="executive-summary-loading">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating Executive Summary...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-6 rounded-lg mt-6 border border-red-200">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!summary) return null;

  const paragraphs = summary.split('\n').filter((p) => p.trim() !== '');

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6 border border-gray-200" data-testid="executive-summary-content">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Executive Summary</h2>
      <div className="space-y-4 text-gray-700 leading-relaxed">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};
