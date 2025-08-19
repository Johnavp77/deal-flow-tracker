'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs/client';

export default function Documents() {
  const supabase = createClientComponentClient();
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchFiles = async () => {
    const { data, error } = await supabase.storage
      .from('documents')
      .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
    if (!error && data) setFiles(data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const filePath = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from('documents')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });
    setUploading(false);
    if (!error) fetchFiles();
  };

  const downloadFile = async (path: string) => {
    const { data, error } = await supabase.storage.from('documents').download(path);
    if (error || !data) return;
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = path.split('/').pop() || 'file';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Document Hub</h1>

      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        className="mb-4"
      />
      {uploading && <p className="text-sm text-gray-500">Uploading…</p>}

      <ul className="space-y-2">
        {files.map((file) => (
          <li key={file.id} className="flex items-center justify-between border p-2 rounded">
            <span>{file.name}</span>
            <button
              onClick={() => downloadFile(file.name)}
              className="text-blue-600 hover:underline text-sm"
            >
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>

  
  );
}
