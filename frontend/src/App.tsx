import React, { useState } from 'react'
import { Upload } from './components/Upload'

function App() {
  const [datasetId, setDatasetId] = useState<number | null>(null);

  const handleUploadSuccess = (id: number) => {
    setDatasetId(id);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">DataLens</h1>
          <p className="mt-2 text-lg text-gray-600">Generic CSV Analytics Platform</p>
        </header>

        <Upload onUploadSuccess={handleUploadSuccess} />

        {datasetId && (
          <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-blue-800 font-medium">Active Dataset ID: {datasetId}</p>
            <p className="text-sm text-blue-600 mt-1">Ready for profiling and analysis.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
