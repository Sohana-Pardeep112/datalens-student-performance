import React, { useState } from 'react'
import { Upload } from './components/Upload'
import { DataProfile } from './components/DataProfile'
import { ExecutiveSummary } from './components/ExecutiveSummary'

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

        {!datasetId ? (
          <Upload onUploadSuccess={handleUploadSuccess} />
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md flex justify-between items-center shadow-sm">
              <span className="font-medium">Dataset successfully uploaded and active!</span>
              <button onClick={() => setDatasetId(null)} className="text-sm font-semibold underline hover:text-green-900 transition">Upload another dataset</button>
            </div>
            <DataProfile datasetId={datasetId} />
            <ExecutiveSummary datasetId={datasetId} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
