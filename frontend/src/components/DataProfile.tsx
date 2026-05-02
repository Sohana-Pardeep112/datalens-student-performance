import React, { useEffect, useState } from 'react';
import { fetchProfile } from '../services/api';
import { Database, ListTree, Hash } from 'lucide-react';

interface DataProfileProps {
  datasetId: number;
}

export const DataProfile: React.FC<DataProfileProps> = ({ datasetId }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProfile(datasetId);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Error loading profile');
      } finally {
        setLoading(false);
      }
    };
    
    if (datasetId) {
      loadProfile();
    }
  }, [datasetId]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading dataset profile...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-md shadow-sm border border-red-100">{error}</div>;
  }

  if (!profile) return null;

  return (
    <div className="w-full bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden mt-8">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Database size={24} className="text-blue-500" />
          Dataset Profile
        </h2>
        <div className="text-sm text-gray-500 flex gap-4">
          <span className="flex items-center gap-1"><ListTree size={16} /> {profile.num_rows} Rows</span>
          <span className="flex items-center gap-1"><Hash size={16} /> {profile.num_columns} Columns</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">Column</th>
              <th scope="col" className="px-6 py-3">Type</th>
              <th scope="col" className="px-6 py-3">Nulls</th>
              <th scope="col" className="px-6 py-3">Statistics</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(profile.columns).map(([colName, colData]: [string, any], idx) => (
              <tr key={colName} className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {colName}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${colData.type === 'numeric' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {colData.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={colData.null_count > 0 ? 'text-red-500 font-bold' : 'text-gray-500'}>
                    {colData.null_count}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs">
                  {colData.type === 'numeric' ? (
                    <div className="flex gap-4">
                      <span><span className="text-gray-400">Min:</span> {colData.stats.min?.toFixed(2) ?? 'N/A'}</span>
                      <span><span className="text-gray-400">Max:</span> {colData.stats.max?.toFixed(2) ?? 'N/A'}</span>
                      <span><span className="text-gray-400">Avg:</span> {colData.stats.mean?.toFixed(2) ?? 'N/A'}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <span><span className="text-gray-400">Unique:</span> {colData.stats.unique_values}</span>
                      <span className="text-gray-400 max-w-xs truncate" title={JSON.stringify(colData.stats.value_counts)}>
                        Top: {Object.entries(colData.stats.value_counts || {}).slice(0,3).map(([k,v]) => `${k} (${v})`).join(', ')}
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
